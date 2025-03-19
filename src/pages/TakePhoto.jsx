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

      const filteredImage = await applyFilter(imageSrc, filter);
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
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-semibold">Ambil Gambar</h1>
      <p className="text-gray-600 mt-2">Siap-siap bergaya 📸</p>

      {/* Pilihan Filter */}
      <div className="mt-4 flex justify-center gap-4">
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="none">Tanpa Efek</option>
          <option value="grayscale(100%)">Hitam Putih</option>
          <option value="sepia(100%)">Jadul</option>
          <option value="contrast(200%)">Kontras Tinggi</option>
          <option value="blur(3px)">Blur</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center mt-6 gap-6">
        {/* Kamera */}
        <div className="relative border border-gray-300 rounded-lg shadow-md overflow-hidden">
          {flash && <div className="absolute inset-0 bg-white opacity-80 transition-opacity duration-200"></div>}
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            className="w-64 h-80 object-cover"
            videoConstraints={{ facingMode: isFrontCamera ? "user" : "environment" }}
            style={{ filter: filter }} // Terapkan filter di webcam preview
          />
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold animate-pulse">
              {countdown}
            </div>
          )}
        </div>

        {/* Preview Layout */}
        <div className="p-4 bg-gray-100 rounded-md shadow-md border border-gray-300">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${selectedLayout.cols}, 1fr)`,
              gridTemplateRows: `repeat(${selectedLayout.rows}, 1fr)`,
            }}
          >
            {photos.map((photo, index) => (
              <div
                key={index}
                className="w-20 h-20 md:w-24 md:h-24 border border-gray-300 flex items-center justify-center bg-white shadow-sm"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={`Captured ${index}`}
                    className="w-full h-full object-cover"
                    style={{ filter: filter }} // Terapkan filter di preview
                  />
                ) : (
                  "📷"
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
          onClick={capture}
          disabled={currentSlot >= photos.length || autoCapture}
        >
          Ambil Sekali 📸
        </button>
        <button
          className="px-6 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition-all"
          onClick={() => setAutoCapture(true)}
          disabled={currentSlot >= photos.length}
        >
          Auto Capture ⏳
        </button>
        <button
          className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
          onClick={retake}
        >
          Ulang 🔄
        </button>
        <button
          className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all"
          onClick={() => setIsFrontCamera(!isFrontCamera)}
        >
          Ganti Kamera 🔄
        </button>
      </div>

      {/* Tombol Lanjut */}
      <button
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all disabled:opacity-50"
        onClick={() => navigate("/edit", { state: { photos, selectedLayout } })}
        disabled={photos.includes(null)}
      >
        Lanjut ✏️
      </button>
    </div>
  );
}

export default TakePhoto;
