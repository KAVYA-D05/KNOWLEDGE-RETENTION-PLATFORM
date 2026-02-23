import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";   // 🔥 THIS WAS MISSING
import "../css/SharedNote.css";
function SharedNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/notes/shared/${id}`)
      .then((res) => setNote(res.data))
      .catch(() => alert("Note not found"));
  }, [id]);

  if (!note) return <h2>Loading...</h2>;

  return (
  <div className="shared-note-page">
    {!note ? (
      <p className="loading-text">Loading note...</p>
    ) : (
      <div className="shared-note-card">
        <h2 className="shared-note-title">{note.title}</h2>
        <p className="shared-note-description">{note.description}</p>

        {note.fileName && (
          <a
            href={`http://localhost:5000/uploads/${note.fileName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="attachment-btn"
          >
            📎 View Attachment
          </a>
        )}
      </div>
    )}
  </div>
);
}

export default SharedNote;