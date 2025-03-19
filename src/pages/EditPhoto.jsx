import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";

function EditPhoto() {
  const location = useLocation();
  const { photos, selectedLayout } = location.state || {};
  const canvasRef = useRef(null);
  const imgRefs = useRef([]);
  const captionRef = useRef(null);

  const [caption, setCaption] = useState("Tules yak sini!");
  const [fontSize, setFontSize] = useState(20);
  const [isSaved, setIsSaved] = useState(false);

  if (!photos || !selectedLayout) {
    return (
      <div className="text-center text-red-600 font-semibold p-6">
        <h2>Photo agik mane yang nak diedit ni!</h2>
        <p>Balik kehalaman sebelumnye lok, biar ada yang diedit!</p>
      </div>
    );
  }

  const layoutStyles = {
    "4-STRIP": "grid grid-rows-4 w-40 h-96 bg-white p-4 border border-gray-400",
    "3-STRIP": "grid grid-rows-3 w-40 h-72 bg-white p-4 border border-gray-400",
    "SQUARE": "w-48 h-56 bg-white p-4 border border-gray-400 flex flex-col items-center",
    "WIDE": "w-72 h-56 bg-white p-4 border border-gray-400 flex flex-col items-center",
    "2R": "w-48 h-64 bg-white p-4 border border-gray-400 flex flex-col items-center",
  };

  const savePhoto = async () => {
    const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "foto-keren.png";
    link.click();
    setIsSaved(true);
  };

  const sharePhoto = async () => {
    const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 2 });
    const imageUrl = canvas.toDataURL("image/png");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Lihat foto keren aku!",
          text: "Cek hasil jepretan aku dari Photobooth!",
          url: imageUrl,
        });
      } catch (error) {
        alert("Gagal membagikan foto! Coba simpan dulu lalu kirim manual.");
      }
    } else {
      alert("Browser ini gak support share langsung, simpan dulu ya!");
    }
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-semibold"></h1>
      <p className="text-gray-600 mt-2">Kasik tulesan kalau nda pun nda pape! Maok ati yaklaa~</p>

      <div className="flex flex-col items-center mt-4">
        <div ref={canvasRef} className={layoutStyles[selectedLayout] || "p-4 border border-gray-400"}>
          {photos.map((photo, index) => (
            <div key={index} className="w-full h-full bg-white p-1">
              <img
                ref={(el) => (imgRefs.current[index] = el)}
                src={photo}
                alt="Hasil Jepretan"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div
            ref={captionRef}
            className="text-center w-full text-black font-bold mt-4 bg-white p-2 border-t border-gray-400"
            style={{ fontSize: `${fontSize}px` }}
          >
            {caption}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="p-2 border rounded"
          placeholder="Tulis caption di sini..."
        />
        <input
          type="range"
          min="12"
          max="32"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
          onClick={savePhoto}
        >
          Simpan 
        </button>

        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
          onClick={sharePhoto}
          disabled={!isSaved}
        >
          Share 
        </button>

        <a
          href="https://saweria.co/otkhodylinz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all"
        >
          dukung pengembangan
        </a>
      </div>
    </div>
  );
}

export default EditPhoto;
