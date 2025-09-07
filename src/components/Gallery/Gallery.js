import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const [uploads, setUploads] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }
    const q = query(
      collection(db, "uploads"),
      where("userId", "==", auth.currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUploads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setSelectedIds([]); // Clear selection on data change
    });
    return () => unsubscribe();
  }, [navigate]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected upload(s)?`)) return;

    setDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteDoc(doc(db, "uploads", id))));
      alert("Selected uploads deleted.");
      setSelectedIds([]);
    } catch (err) {
      alert("Failed to delete some uploads: " + err.message);
    }
    setDeleting(false);
  };

  return (
    <div style={{ minHeight: "90vh", background: "linear-gradient(135deg, #f9faff 60%, #e3ffe8 100%)", padding: "50px 0", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: 1050, margin: "auto" }}>
        <h2 style={{ color: "#4e69ea", marginBottom: 20, letterSpacing: 1 }}>Your Upload History</h2>

        {uploads.length === 0 && <p style={{ textAlign:"center", color:"#888", fontWeight: "500", fontSize: 20, marginTop: 40}}>No uploads found yet.</p>}

        {uploads.length > 0 && (
          <div style={{ marginBottom: 20, textAlign: "right" }}>
            <button
              disabled={selectedIds.length === 0 || deleting}
              onClick={deleteSelected}
              style={{
                padding: "8px 18px",
                fontWeight: "600",
                backgroundColor: selectedIds.length === 0 || deleting ? "#ccc" : "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                cursor: selectedIds.length === 0 || deleting ? "default" : "pointer",
                boxShadow: selectedIds.length === 0 || deleting ? "none" : "0 3px 10px rgba(220,53,69,0.5)",
                transition: "background-color 0.3s",
              }}
            >
              {deleting ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 28 }}>
          {uploads.map(({ id, originalFile, croppedFile, timestamp }) => (
            <div
              key={id}
              style={{
                background: "#fff",
                borderRadius: 13,
                boxShadow: "0 4px 32px rgba(110,130,255,0.15)",
                padding: "22px 20px 18px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(id)}
                onChange={() => toggleSelect(id)}
                style={{ position: "absolute", top: 15, left: 15, width: 20, height: 20, cursor: "pointer" }}
              />
              <div style={{ fontSize: 13, color: "#979797", marginBottom: 12, letterSpacing: 1 }}>
                <strong>Uploaded:</strong> {timestamp?.toDate().toLocaleString()}
              </div>
              <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#6A6AFF", fontWeight: 600, fontSize: 15, marginBottom: 7 }}>Original</p>
                  <img
                    src={originalFile}
                    alt="Original"
                    style={{ width: 120, borderRadius: 8, boxShadow: "0 2px 10px rgba(100,120,210,0.09)" }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#6A6AFF", fontWeight: 600, fontSize: 15, marginBottom: 7 }}>Cropped</p>
                  <img
                    src={croppedFile}
                    alt="Cropped"
                    style={{ width: 120, borderRadius: 8, boxShadow: "0 2px 10px rgba(50,170,90,0.09)" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
