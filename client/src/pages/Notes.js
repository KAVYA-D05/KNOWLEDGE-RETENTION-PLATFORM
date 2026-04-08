import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Notes.css";
import API from "../utils/api";

axios.defaults.withCredentials = true;

function Notes() {
  const email = localStorage.getItem("email");

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [shareModal, setShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/notes/my/${email}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  }, [email]);

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
      await axios.post(`${API}/api/notes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setDescription("");
      setFile(null);
      e.target.reset();
      fetchNotes();
    } catch (err) {
      alert("Failed to add note");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`${API}/api/notes/${id}`);
        fetchNotes();
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

 const handleShare = async (noteId) => {
  try {
    const shareUrl = `${window.location.origin}/shared/${noteId}`;
    setShareLink(shareUrl);
    setShareModal(true);
  } catch {
    alert("Share failed");
  }
};

  return (
    <>
      <Navbar />

      <div className="notes-page">
        <div className="notes-container">
          
          {/* CREATE NOTE SECTION */}
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
                <textarea
                  placeholder="Take a note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-footer">
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit" className="add-note-btn">
                  Add Note
                </button>
              </div>
            </form>
          </section>

          {/* SEARCH & HEADER */}
          <div className="notes-header">
            <h2>Your Library</h2>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search your notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* NOTES LIST GRID */}
          <div className="notes-list">
            {notes
              .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
              .map((note) => (
                <div className="note-card" key={note._id}>
                  <div className="note-content">
                    <h4>{note.title}</h4>
                    <p>{note.description}</p>
                  </div>

                  <div className="note-actions">
                    {note.file ? (
                      <button className="view-btn" onClick={() => setPreviewFile(note.file)}>
                        View
                      </button>
                    ) : (
                      <button className="view-btn disabled" disabled>No File</button>
                    )}
                    <button className="share-btn" onClick={() => handleShare(note._id)}>
                      Share
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(note._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* SHARE MODAL */}
        {shareModal && (
          <div className="share-overlay" onClick={() => setShareModal(false)}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Share Link</h3>
              <p className="modal-subtitle">Copy the link below to share your note.</p>
              
              <div className="share-input-group">
                <input value={shareLink} readOnly />
                <button 
                  className="copy-inner-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    alert("Copied!");
                  }}
                >
                  Copy
                </button>
              </div>

              <div className="share-social-grid">
                <a href={`https://wa.me/?text=${shareLink}`} className="social-link whatsapp" target="_blank" rel="noreferrer">WhatsApp</a>
                <a href={`mailto:?body=${shareLink}`} className="social-link email">Email</a>
              </div>

              <button className="modal-close-btn" onClick={() => setShareModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* PREVIEW MODAL */}
        {previewFile && (
          <div className="share-overlay" onClick={() => setPreviewFile(null)}>
            <div className="share-modal preview-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Document Preview</h3>
              <div className="preview-container">
                {previewFile.toLowerCase().endsWith(".pdf") ? (
                  <iframe src={previewFile} title="preview" />
                ) : (
                  <img src={previewFile} alt="preview" />
                )}
              </div>
              <div className="preview-footer">
                <a href={previewFile} download className="download-link">Download File</a>
                <button className="modal-close-btn" onClick={() => setPreviewFile(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Notes;