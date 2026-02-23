import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Notes.css";

function Notes() {
  const email = localStorage.getItem("email");

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [shareModal, setShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/notes/my/${email}`
    );
    setNotes(res.data);
  };

  /* ================= CREATE NOTE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("createdBy", email);

    if (file) formData.append("file", file);

    await axios.post("http://localhost:5000/api/notes", formData);

    setTitle("");
    setDescription("");
    setFile(null);

    fetchNotes();
  };

  /* ================= DELETE NOTE ================= */
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`);
    fetchNotes();
  };

  /* ================= SHARE NOTE ================= */
  const handleShare = (note) => {
    let link;
    let type = "";

    if (note.fileName) {
      link = `http://localhost:5000/uploads/${note.fileName}`;

      if (note.fileName.endsWith(".pdf")) {
        type = "PDF Document";
      } else if (
        note.fileName.endsWith(".doc") ||
        note.fileName.endsWith(".docx")
      ) {
        type = "Word Document";
      }
    } else {
      link = `http://localhost:3000/shared-note/${note._id}`;
      type = "Note Page";
    }

    setShareLink(link);
    setFileType(type);
    setShareModal(true);
  };

  return (
    <div className="notes-page">
      <Navbar />

      <div className="notes-container">

        <div className="notes-header">
          <h2>My Notes</h2>
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="create-note-box">
          <h3>Create New Note</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Write description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button type="submit">+ Add Note</button>
          </form>
        </div>

        <div className="notes-list">
          {notes
            .filter((note) =>
              note.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((note) => (
              <div className="note-card" key={note._id}>
                <div className="note-info">
                  <h4>{note.title}</h4>
                  <p>{note.description}</p>
                </div>

                <div className="note-actions">
                  {note.fileName ? (
                    <a
                      href={`http://localhost:5000/uploads/${note.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      View
                    </a>
                  ) : (
                    <span className="no-file">No File</span>
                  )}

                  <button
                    className="share-btn"
                    onClick={() => handleShare(note)}
                  >
                    Share
                  </button>

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ================= SHARE MODAL ================= */}
      {shareModal && (
        <div className="share-overlay">
          <div className="share-modal">
            <h3>Share {fileType}</h3>

            <input type="text" value={shareLink} readOnly />

            <div className="share-buttons">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(shareLink)
                }
              >
                📋 Copy Link
              </button>

              <a
                href={`https://wa.me/?text=Check this document: ${shareLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                📲 WhatsApp
              </a>

              <a
                href={`mailto:?subject=Shared Document&body=Download here: ${shareLink}`}
              >
                📧 Email
              </a>
            </div>

            <button
              className="close-btn"
              onClick={() => setShareModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;