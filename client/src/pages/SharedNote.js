import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/SharedNote.css";
import API from "../utils/api";

function SharedNote() {
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/api/notes/shared/${id}`)
      .then((res) => setNote(res.data))
      .catch(() => setError(true));
  }, [id]);

  // ❌ Error state
  if (error) {
    return (
      <div className="shared-page">
        <h2>Note not found or link expired</h2>
      </div>
    );
  }

  // ⏳ Loading state
  if (!note) {
    return (
      <div className="shared-page">
        <p>Loading note...</p>
      </div>
    );
  }

  return (
    <div className="shared-page">
      <div className="shared-card">
        <div className="badge">Shared Note</div>

        <h1 className="title">{note.title}</h1>
        <p className="desc">{note.description}</p>

        {/* 🔥 FILE PREVIEW + DOWNLOAD */}
        {note.file && (
          <div className="preview-section">

            {/* 📄 PDF PREVIEW */}
            {note.file.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={note.file}
                width="100%"
                height="400px"
                title="PDF Preview"
                style={{ borderRadius: "10px" }}
              />
            ) : 

            /* 🖼️ IMAGE PREVIEW */
            note.file.match(/\.(jpg|jpeg|png|gif)$/) ? (
              <img
                src={note.file}
                alt="preview"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "10px"
                }}
              />
            ) : (

              /* 📎 OTHER FILES (docx, ppt, etc.) */
              <p style={{ marginBottom: "10px" }}>
                Preview not available. Please download the file.
              </p>
            )}

            {/* ⬇️ DOWNLOAD BUTTON */}
            <a
              href={note.file}
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Download Attachment
            </a>

          </div>
        )}
      </div>
    </div>
  );
}

export default SharedNote;