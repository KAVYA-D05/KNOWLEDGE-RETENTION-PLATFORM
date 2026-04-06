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

  /* ================= FETCH NOTES ================= */
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

  /* ================= ADD NOTE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("createdBy", email);

    if (file) formData.append("file", file);

    try {
      await axios.post(`${API}/api/notes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDescription("");
      setFile(null);
      e.target.reset();
      fetchNotes();

    } catch (err) {
      console.error("Error adding note", err);
      alert("Failed to add note");
    }
  };

  /* ================= DELETE NOTE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this note?")) {
      try {
        await axios.delete(`${API}/api/notes/${id}`);
        fetchNotes();
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  /* ================= SHARE NOTE ================= */
  const handleShare = async (noteId) => {
    try {
      const res = await axios.get(`${API}/api/notes/share-link/${noteId}`);
      setShareLink(res.data.shareLink);
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

          {/* CREATE NOTE */}
          <section className="create-note-box">
            <h3>Create New Note</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button type="submit">Add Note</button>
            </form>
          </section>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* NOTES LIST */}
          <div className="notes-list">
            {notes
              .filter((n) =>
                n.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((note) => (
                <div className="note-card" key={note._id}>
                  <h4>{note.title}</h4>
                  <p>{note.description}</p>

                  <div className="actions">

                    {/* VIEW (PREVIEW) */}
                    {note.file ? (
                      <button onClick={() => setPreviewFile(note.file)}>
                        View
                      </button>
                    ) : (
                      <span>No File</span>
                    )}

                    {/* SHARE */}
                    <button onClick={() => handleShare(note._id)}>
                      Share
                    </button>

                    {/* DELETE */}
                    <button onClick={() => handleDelete(note._id)}>
                      Delete
                    </button>

                  </div>
                </div>
              ))}
          </div>

        </div>

        {/* SHARE MODAL */}
        {shareModal && (
          <div className="overlay" onClick={() => setShareModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Share Link</h3>

              <input value={shareLink} readOnly />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert("Copied!");
                }}
              >
                Copy
              </button>

              <button onClick={() => setShareModal(false)}>Close</button>
            </div>
          </div>
        )}

        {/* 🔥 PREVIEW MODAL */}
        {previewFile && (
          <div className="overlay" onClick={() => setPreviewFile(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

              <h3>Preview</h3>

              {/* PDF */}
              {previewFile.includes(".pdf") ? (
                <iframe
                  src={previewFile}
                  width="100%"
                  height="500px"
                  title="preview"
                />
              ) : (
                <img src={previewFile} alt="preview" width="100%" />
              )}

              <br />

              {/* DOWNLOAD */}
              <a href={previewFile} download>
                Download
              </a>

              <button onClick={() => setPreviewFile(null)}>
                Close
              </button>

            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default Notes;