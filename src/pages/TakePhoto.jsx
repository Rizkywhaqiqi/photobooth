import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

function TakePhoto({ selectedLayout }) {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [photos, setPhotos] = useState(Array(selectedLayout?.rows * selectedLayout?.cols).fill(null));
  const [currentSlot, setCurrentSlot] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [autoCapture, setAutoCapture] = useState(false);
  const [flash, setFlash] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [filter, setFilter] = useState("none");

  useEffect(() => {
    if (!selectedLayout) {
      console.error("Tak ada layout dipilih!");
      navigate("/choose-layout");
    }
  }, [selectedLayout, navigate]);

  useEffect(() => {
    let timer;
    if (autoCapture && currentSlot < photos.length) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            capture();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [autoCapture, currentSlot]);

  const capture = async () => {
    if (webcamRef.current && currentSlot < photos.length) {
      setFlash(true);
      setTimeout(() => setFlash(false), 200);

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const filteredImage = await applyFilter(imageSrc, filter); // Terapkan filter setelah tangkapan
      const newPhotos = [...photos];
      newPhotos[currentSlot] = filteredImage;
      setPhotos(newPhotos);
      setCurrentSlot(currentSlot + 1);

      if (currentSlot + 1 >= photos.length) {
        setAutoCapture(false);
        setCountdown(null);
      }
    }
  };

  const retake = () => {
    setPhotos(Array(selectedLayout.rows * selectedLayout.cols).fill(null));
    setCurrentSlot(0);
    setAutoCapture(false);
    setCountdown(null);
  };

  const applyFilter = (imageSrc, filter) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageSrc;
      img.crossOrigin = "anonymous";

      img.onload = () => {
  
