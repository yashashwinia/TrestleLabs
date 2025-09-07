/* global cv */
import React, { useEffect, useState } from "react";

const AutoCrop = ({ srcBase64, onCropped }) => {
  const [croppedSrc, setCroppedSrc] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!srcBase64) return;

    setIsProcessing(true);
    setError("");

    const waitForCv = () => {
      if (window.cv && window.cv.imread) {
        processImage();
      } else {
        setTimeout(waitForCv, 100);
      }
    };

    const processImage = () => {
      const img = new Image();
      img.src = srcBase64;
      img.onload = () => {
        try {
          const src = cv.imread(img);
          let dst = new cv.Mat();
          let gray = new cv.Mat();
          let blurred = new cv.Mat();
          let edges = new cv.Mat();

          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
          cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
          cv.Canny(blurred, edges, 75, 200);

          let contours = new cv.MatVector();
          let hierarchy = new cv.Mat();
          cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

          let approx = new cv.Mat();
          let maxArea = 0;
          let maxContour = null;

          for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let peri = cv.arcLength(contour, true);
            cv.approxPolyDP(contour, approx, 0.02 * peri, true);
            if (approx.rows === 4) {
              let area = cv.contourArea(approx);
              if (area > maxArea) {
                maxArea = area;
                maxContour = approx.clone();
              }
            }
            contour.delete();
          }

          if (!maxContour) throw new Error("No document-like contour found");

          const points = [];
          for (let i = 0; i < 4; i++) {
            points.push({ x: maxContour.data32S[i * 2], y: maxContour.data32S[i * 2 + 1] });
          }

          points.sort((a, b) => a.y - b.y);
          const top = points.slice(0, 2).sort((a, b) => a.x - b.x);
          const bottom = points.slice(2, 4).sort((a, b) => a.x - b.x);
          const sorted = [top[0], top[1], bottom[1], bottom[0]];

          const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

          const widthTop = dist(sorted[0], sorted[1]);
          const widthBottom = dist(sorted[2], sorted[3]);
          const maxWidth = Math.max(widthTop, widthBottom);

          const heightLeft = dist(sorted[0], sorted[3]);
          const heightRight = dist(sorted[1], sorted[2]);
          const maxHeight = Math.max(heightLeft, heightRight);

          let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
            sorted[0].x, sorted[0].y,
            sorted[1].x, sorted[1].y,
            sorted[2].x, sorted[2].y,
            sorted[3].x, sorted[3].y,
          ]);

          let dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            maxWidth - 1, 0,
            maxWidth - 1, maxHeight - 1,
            0, maxHeight - 1,
          ]);

          let M = cv.getPerspectiveTransform(srcCoords, dstCoords);

          cv.warpPerspective(src, dst, M, new cv.Size(maxWidth, maxHeight));

          cv.imshow("outputCanvas", dst);
          const canvas = document.getElementById("outputCanvas");
          const croppedBase64 = canvas.toDataURL();

          setCroppedSrc(croppedBase64);
          if (onCropped) onCropped(croppedBase64);

          src.delete();
          dst.delete();
          gray.delete();
          blurred.delete();
          edges.delete();
          contours.delete();
          hierarchy.delete();
          approx.delete();
          maxContour.delete();
          srcCoords.delete();
          dstCoords.delete();
          M.delete();
        } catch (err) {
          setError(err.message);
          setCroppedSrc(null);
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        setError("Failed to load image");
        setIsProcessing(false);
      };
    };

    waitForCv();
  }, [srcBase64, onCropped]);

  return (
    <div>
      {/* Always render this canvas to avoid the "valid canvas element" error */}
      <canvas id="outputCanvas" style={{ display: "none" }}></canvas>

      {isProcessing && <p>Processing image for auto-crop...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {croppedSrc && (
        <>
          <h3>Cropped Document Preview</h3>
          <img src={croppedSrc} alt="Cropped Document" style={{ maxWidth: "100%" }} />
        </>
      )}
    </div>
  );
};

export default AutoCrop;
