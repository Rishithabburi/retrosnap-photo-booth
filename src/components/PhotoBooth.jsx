import React, { useState } from "react";
import Webcam from "react-webcam";
import PhotoStudio from "./PhotoStudio";
import "./PhotoBooth.css";

const PhotoBooth = () => {
  const [coinInserted, setCoinInserted] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  const handleInsertClick = () => {
    setCoinInserted(true);
  };

  const handleCoinClick = () => {
    setCurtainOpen(true);

    setTimeout(() => {
      setShowStudio(true);
    }, 900);
  };

  if (showStudio) {
    return <PhotoStudio />;
  }

  return (
    <div className="booth-container">

      <div className="booth-header">
        ✦ RetroSnap Studio ✦
      </div>

      <div className="booth-subtitle">
        Capture Moments • Keep Memories
      </div>

      <div className="booth-body">

        <div className="coin-slot">

          {!coinInserted ? (
            <div
              className="insert-card"
              onClick={handleInsertClick}
            >
              <span className="insert-icon">🪙</span>

              <p>
                INSERT
                <br />
                TOKEN
              </p>

              <small>Tap to Start</small>
            </div>
          ) : (
            <div
              className="coin"
              onClick={handleCoinClick}
            >
              GO
            </div>
          )}

        </div>

        <div className="curtain-wrapper">

          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            className="webcam-preview"
          />

          <div
            className={`curtain ${
              curtainOpen ? "open" : ""
            }`}
          />

        </div>

      </div>

    </div>
  );
};

export default PhotoBooth;