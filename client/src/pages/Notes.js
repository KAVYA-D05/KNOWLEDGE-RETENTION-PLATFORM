import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Notes.css";
import API from "../utils/api";
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
  
  // 1. Optimized fetch function to satisfy ESLint
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/notes/my/${email}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  }, [email]);

  // 2. useEffect now has fetchNotes as a stable dependency
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("createdBy", email);
    if (file) formData.append("file", file);

    try {
      await axios.post(`${API}/api/notes`, formData);
      setTitle("");
      setDescription("");
      setFile(null);
      e.target.reset(); // Resets file input UI
      fetchNotes();
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await axios.delete(`${API}/api/notes/${id}`);
      fetchNotes();
    }
  };

  const handleShare = (note) => {
    let link = note.fileName
      ? `${API}/uploads/${note.fileName}`
      : `${API}/shared-note/${note._id}`;

    setShareLink(link);
    setFileType(note.fileName ? "File" : "Note Page");
    setShareModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="notes-page">
        <div className="notes-container">
          
          {/* CREATE SECTION */}
          <section className="create-note-box">
            <h3>Create New Note</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="text" placeholder="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="input-group">
                <textarea placeholder="Write description..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="input-group file-input-wrapper">
                <input type="file" accept=".pdf,.doc,.docx,.png,.jpg" onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <button type="submit" className="add-note-btn">Add Note</button>
            </form>
          </section>

          {/* LIST HEADER */}
          <div className="notes-header">
            <h2>My Notes</h2>
            <div className="search-wrapper">
              <input type="text" placeholder="🔍 Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {/* NOTES GRID */}
          <div className="notes-list">
            {notes
              .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
              .map((note) => (
                <div className="note-card" key={note._id}>
                  <div className="note-info">
                    <h4>{note.title}</h4>
                    <p>{note.description}</p>
                  </div>
                  <div className="note-actions">
                    {note.fileName ? (
                      <a href={`${API}/uploads/${note.fileName}`} target="_blank" rel="noreferrer" className="view-btn">View</a>
                    ) : (
                      <span className="view-btn disabled">No File</span>
                    )}
                    <button className="share-btn" onClick={() => handleShare(note)}>Share</button>
                    <button className="delete-btn" onClick={() => handleDelete(note._id)}>Delete</button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* SHARE MODAL */}
        {shareModal && (
          <div className="share-overlay" onClick={() => setShareModal(false)}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Share {fileType}</h3>
              <p className="modal-subtitle">Copy the link below to share your note.</p>
              
              <div className="share-input-group">
                <input type="text" value={shareLink} readOnly />
                <button className="copy-inner-btn" onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert("Link copied!");
                }}>Copy</button>
              </div>

              <div className="share-social-grid">
                <a href={`https://wa.me/?text=Check this: ${shareLink}`} target="_blank" rel="noreferrer" className="social-link whatsapp">WhatsApp</a>
                <a href={`mailto:?subject=Shared Note&body=${shareLink}`} className="social-link email">Email</a>
              </div>
              
              <button className="modal-close-btn" onClick={() => setShareModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Notes;