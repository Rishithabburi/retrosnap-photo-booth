import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./PhotoStudio.css";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

const filters = [
  "90s",
  "2000s",
  "Noir",
  "Fisheye",
  "Rainbow",
  "Glitch",
  "Crosshatch",
];

const quotes = [
  "Capture Happiness ✨",
  "Smile & Shine 📸",
  "Vintage Memories 💜",
  "Every Picture Tells A Story 🌈",
];

const PhotoStudio = () => {
  const [selectedFilter, setSelectedFilter] = useState("90s");
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const webcamRef = useRef(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const getFilterClass = (filter) => {
    switch (filter.toLowerCase()) {
      case "90s":
        return "_90s";
      case "2000s":
        return "_2000s";
      default:
        return filter.toLowerCase();
    }
  };

  const takePhoto = async () => {
    const video = webcamRef.current?.video;

    if (!video || video.readyState < 2) return;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    let cssFilter = "none";

    switch (selectedFilter.toLowerCase()) {
      case "noir":
        cssFilter = "grayscale(1) contrast(.8) brightness(1.1)";
        break;

      case "90s":
        cssFilter =
          "contrast(1.1) sepia(.3) hue-rotate(-10deg) saturate(.8) brightness(1.1)";
        break;

      case "2000s":
        cssFilter =
          "saturate(1.8) contrast(1.05) brightness(1.1) sepia(.1) hue-rotate(10deg)";
        break;

      case "rainbow":
        cssFilter = "hue-rotate(90deg)";
        break;

      case "glitch":
        cssFilter = "contrast(1.5) saturate(2)";
        break;

      case "crosshatch":
        cssFilter = "grayscale(.5) blur(1px)";
        break;

      case "fisheye":
        cssFilter = "brightness(1.1)";
        break;

      default:
        cssFilter = "none";
    }

    ctx.filter = cssFilter;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg");

    setPhotos((prev) => [
      ...prev,
      {
        src: image,
        filter: selectedFilter,
      },
    ]);
  };

  const countdownStep = async (value) => {
    setCountdown(value);

    await new Promise((r) => requestAnimationFrame(r));

    await delay(1000);
  };

  const startPhotoSequence = async () => {
    setPhotos([]);
    setShowResult(false);
    setIsCapturing(true);

    for (let i = 0; i < 3; i++) {
      await countdownStep("3");
      await countdownStep("2");
      await countdownStep("1");
      await countdownStep("😊");

      await takePhoto();

      setCountdown(null);

      await delay(500);
    }

    setIsCapturing(false);
    setShowResult(true);
  };

  const handleReshoot = () => {
    setPhotos([]);
    setShowResult(false);
  };

  const handleDownload = async () => {
    const frame = document.getElementById("photostrip-canvas-source");

    const canvas = await html2canvas(frame, {
      useCORS: true,
    });

    const dataURL = canvas.toDataURL("image/jpeg");

    const link = document.createElement("a");

    link.href = dataURL;
    link.download = "RetroSnap-Strip.jpg";

    link.click();
  };

  const slideIn = {
    hidden: {
      x: "100%",
      opacity: 0,
    },

    visible: {
      x: "0%",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const randomQuote =
    quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <motion.div
      className="photoStudio"
      variants={slideIn}
      initial="hidden"
      animate="visible"
    >
      {!showResult && (
        <div className="studio-container">

          <h1 className="studio-title">
            RetroSnap Studio
          </h1>

          <p className="studio-subtitle">
            Capture • Create • Remember
          </p>

          <div className="studio-webcam-container">

            {countdown && (
              <div className="countdown-overlay">
                {countdown}
              </div>
            )}

            <div
              className={`studio-webcam ${getFilterClass(
                selectedFilter
              )}`}
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="webcam-view"
              />
            </div>

          </div>

          <div className="filter-bar">

            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${
                  selectedFilter === filter
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedFilter(filter)
                }
                disabled={isCapturing}
              >
                {filter}
              </button>
            ))}

          </div>

          <button
            className="capture-btn"
            onClick={startPhotoSequence}
            disabled={isCapturing}
          >
            📸
          </button>

        </div>
      )}

      {showResult && (
        <div className="studio-result slide-in-top">

          <div
            id="photostrip-canvas-source"
            className={`photostrip-frame ${
              showResult
                ? "strip-slide-in"
                : ""
            }`}
          >

            {photos.map((photo, index) => (
              <div
                key={index}
                className="strip-photo-wrapper"
              >
                <img
                  src={photo.src}
                  alt=""
                  className={`strip-photo-img ${getFilterClass(
                    photo.filter
                  )}`}
                />
              </div>
            ))}

            <p className="photostrip-caption">
              RetroSnap •{" "}
              {new Date().toLocaleDateString("en-IN")}
            </p>

            <p className="quote">
              {randomQuote}
            </p>

          </div>

          <div className="result-controls">

            <button
              className="reshoot"
              onClick={handleReshoot}
            >
              Reshoot
            </button>

            <button
              className="download"
              onClick={handleDownload}
            >
              Download
            </button>

          </div>

        </div>
      )}
    </motion.div>
  );
};

export default PhotoStudio;