import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import AutoCrop from "./AutoCrop";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Use CDN-hosted PDF.js worker matching version 2.14.305
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

const UploadPage = () => {
  const [fileData, setFileData] = useState(null);
  const [croppedData, setCroppedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorMsg("");
    setSuccessMsg("");
    setCroppedData(null);
    setFileData(null);

    if (file.type === "application/pdf") {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        const base64 = canvas.toDataURL("image/png");
        setFileData(base64);
      } catch (err) {
        setErrorMsg("Failed to process PDF file: " + err.message);
      }
    } else if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMsg("Unsupported file type. Please upload PNG, JPEG, or PDF.");
    }
  };

  const saveToFirestore = async (croppedBase64) => {
    setIsUploading(true);
    try {
      const userId = auth.currentUser.uid;
      await addDoc(collection(db, "uploads"), {
        userId,
        originalFile: fileData,
        croppedFile: croppedBase64,
        timestamp: serverTimestamp(),
        status: "processed",
      });
      setSuccessMsg("File uploaded and cropped saved.");
      setFileData(null);
      setCroppedData(null);
    } catch (error) {
      setErrorMsg(error.message);
    }
    setIsUploading(false);
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        background: "linear-gradient(135deg, #f7faff 70%, #e0f7fa 100%)",
        padding: 40,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "auto",
          backgroundColor: "#ffffffee",
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 6px 22px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#0077c2", marginBottom: 30, fontWeight: 700 }}>
          Upload and Auto-Crop Document
        </h2>
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileChange}
          style={{
            marginBottom: 30,
            cursor: "pointer",
            borderRadius: 6,
            border: "1px solid #bbb",
            padding: 6,
            fontSize: 16,
          }}
        />
        {errorMsg && (
          <p style={{ color: "#d32f2f", fontWeight: "600", marginBottom: 20 }}>
            {errorMsg}
          </p>
        )}
        {successMsg && (
          <p
            style={{
              color: "#388e3c",
              background: "#e6ffe6",
              padding: 9,
              borderRadius: 6,
              marginBottom: 20,
            }}
          >
            {successMsg}
          </p>
        )}
        {fileData && (
          <>
            <h3 style={{ color: "#004e8a", marginBottom: 10 }}>Original Preview:</h3>
            <div
              style={{
                border: "1px solid #ccc",
                width: "100%",
                maxHeight: 320,
                overflow: "hidden",
                borderRadius: 10,
                marginBottom: 25,
              }}
            >
              <TransformWrapper>
                <TransformComponent>
                  <img
                    src={fileData}
                    alt="Original"
                    style={{ width: "100%", userSelect: "none", pointerEvents: "none" }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
            <AutoCrop
              srcBase64={fileData}
              onCropped={(cropped) => {
                if (!croppedData) {
                  setCroppedData(cropped);
                  saveToFirestore(cropped);
                }
              }}
            />
          </>
        )}
        {croppedData && (
          <>
            <h3 style={{ color: "#004e8a", marginTop: 40, marginBottom: 10 }}>Cropped Preview:</h3>
            <div
              style={{
                border: "1px solid #ccc",
                width: "100%",
                maxHeight: 320,
                overflow: "hidden",
                borderRadius: 10,
              }}
            >
              <TransformWrapper>
                <TransformComponent>
                  <img
                    src={croppedData}
                    alt="Cropped"
                    style={{ width: "100%", userSelect: "none", pointerEvents: "none" }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          </>
        )}
        {isUploading && (
          <p style={{ color: "#0077c2", fontWeight: 600, marginTop: 15 }}>
            Uploading & saving, please wait...
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
