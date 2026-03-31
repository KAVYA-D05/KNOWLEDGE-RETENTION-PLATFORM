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
    try {
      const res = await axios.get(`http://localhost:5000/api/notes/my/${email}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      fetchNotes();
    }
  };

  const handleShare = (note) => {
    let link = note.fileName
      ? `http://localhost:5000/uploads/${note.fileName}`
      : `http://localhost:3000/shared-note/${note._id}`;

    setShareLink(link);
    setFileType(note.fileName ? "File" : "Note Page");
    setShareModal(true);
  };

  return (
    <>
      {/* ✅ Navbar OUTSIDE */}
      <Navbar />

      <div className="notes-page">
        <div className="notes-container">

          {/* CREATE NOTE */}
          <section className="create-note-box">
            <h3>Create New Note</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <textarea
                  placeholder="Write description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <button type="submit">Add Note</button>
            </form>
          </section>

          {/* HEADER */}
          <div className="notes-header">
            <h2>My Notes</h2>
            <input
              type="text"
              placeholder="🔍 Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* NOTES LIST */}
          <div className="notes-list">
            {notes
              .filter((n) =>
                n.title.toLowerCase().includes(search.toLowerCase())
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
                        rel="noreferrer"
                        className="view-btn"
                      >
                        View
                      </a>
                    ) : (
                      <span className="view-btn disabled">No File</span>
                    )}

                    <button
                      className="share-btn"
                      onClick={() => handleShare(note)}
                    >
                      Share
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* SHARE MODAL */}
        {shareModal && (
          <div className="share-overlay">
            <div className="share-modal">
              <h3>Share {fileType}</h3>

              <input type="text" value={shareLink} readOnly />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert("Link copied!");
                }}
              >
                Copy
              </button>

              <button onClick={() => setShareModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Notes;