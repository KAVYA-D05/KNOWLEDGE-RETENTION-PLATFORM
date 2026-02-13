import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Notes.css";

function Notes() {
  const email = localStorage.getItem("email");

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [visibility, setVisibility] = useState("private");
  const [allowedUsers, setAllowedUsers] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ================= FETCH NOTES ================= */
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notes/my/${email}`
      );
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes");
    }
  }, [email]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /* ================= CREATE / UPDATE NOTE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("createdBy", email);
    formData.append("visibility", visibility);
    formData.append("allowedUsers", allowedUsers);

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/notes/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/notes",
          formData
        );
      }

      resetForm();
      fetchNotes();
    } catch (err) {
      console.error("Error saving note");
    }
  };

  /* ================= DELETE NOTE ================= */
  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notes/${id}`
      );
      fetchNotes();
    } catch {
      console.error("Delete failed");
    }
  };

  /* ================= EDIT NOTE ================= */
  const editNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setVisibility(note.visibility);
    setAllowedUsers(note.allowedUsers?.join(",") || "");
    setEditingId(note._id);
  };

  /* ================= SHARE NOTE ================= */
  const shareNote = async (note) => {
    if (note.visibility === "private") {
      alert("Private notes cannot be shared");
      return;
    }

    // PUBLIC → Copy link
    if (note.visibility === "public") {
      const link = `http://localhost:5000/api/notes/public/${note._id}`;
      navigator.clipboard.writeText(link);
      alert("Public link copied!");
      return;
    }

    // RESTRICTED → Ask email
    if (note.visibility === "restricted") {
      const emailToShare = prompt("Enter email to share with:");

      if (!emailToShare) return;

      try {
        await axios.put(
          `http://localhost:5000/api/notes/share/${note._id}`,
          { email: emailToShare }
        );

        alert("Note shared successfully with " + emailToShare);
      } catch {
        alert("Sharing failed");
      }
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setVisibility("private");
    setAllowedUsers("");
    setEditingId(null);
  };

  return (
    <div className="notes-container">
      <Navbar />

      <div className="notes-content">
        <h2>📘 My Notes</h2>

        {/* ================= NOTE FORM ================= */}
        <form className="note-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="restricted">Restricted</option>
          </select>

          {visibility === "restricted" && (
            <input
              type="text"
              placeholder="Allowed emails (comma separated)"
              value={allowedUsers}
              onChange={(e) => setAllowedUsers(e.target.value)}
            />
          )}

          <button type="submit">
            {editingId ? "Update Note" : "Create Note"}
          </button>
        </form>

        {/* ================= NOTES GRID ================= */}
        <div className="notes-grid">
          {notes.map((note) => (
            <div className="note-card" key={note._id}>
              <h4>{note.title}</h4>
              <p>{note.description}</p>

              <p>
                <strong>Visibility:</strong> {note.visibility}
              </p>

              {note.file && (
                <a
                  href={`http://localhost:5000/uploads/${note.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 View File
                </a>
              )}

              <div className="note-actions">
                <button onClick={() => editNote(note)}>
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </button>

                <button onClick={() => shareNote(note)}>
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notes;
