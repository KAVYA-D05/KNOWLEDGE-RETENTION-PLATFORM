import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/SharedNote.css";

function SharedNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/notes/shared/${id}`)
      .then((res) => setNote(res.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) return <div className="shared-page"><h2>Note not found or link expired</h2></div>;
  if (!note) return <div className="shared-page"><p>Loading note...</p></div>;

  return (
    <div className="shared-page">
      <div className="shared-card">
        <div className="badge">Shared Note</div>
        <h1 className="title">{note.title}</h1>
        <p className="desc">{note.description}</p>
        {note.fileName && (
          <a href={`http://localhost:5000/uploads/${note.fileName}`} target="_blank" rel="noreferrer" className="btn"> Download Attachment </a>
        )}
      </div>
    </div>
  );
}
export default SharedNote;