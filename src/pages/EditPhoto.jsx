import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";

function EditPhoto() {
  const location = useLocation();
  const { photos, selectedLayout, filter } = location.state || {};
  const canvasRef = useRef(null);
  const imgRefs = useRef([]);
  const captionRef = useRef(null);

  const [caption, setCaption] = useState("Tules yak sini!");
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontColor, setFontColor] = useState("#000000");
  const [isSaved, setIsSaved] = useState(false);

  if (!photos || !selectedLayout) {
    return (
      <div className="text-center text-red-600 font-semibold p-6">
        <h2>Photo agik mane yang nak diedit ni!</h2>
        <p>Balik ke halaman sebelumnye lok, biar ada yang diedit!</p>
      </div>
    );
  }

  useEffect(() => {
    imgRefs.current.forEach((img) => {
      if (img) img.style.filter = filter;
    });
  }, [filter]);

  const savePhoto = async () => {
    const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 3 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "foto-keren.png";
    link.click();
    setIsSaved(true);
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-semibold">Edit Foto</h1>
      <p className="text-gray-600 mt-2">Kasik tulesan kalau nda pun nda pape! Maok ati yaklaa~</p>

      {/* Frame Foto */}
      <div className="flex flex-col items-center mt-4">
        <div ref={canvasRef} className="p-4 border border-gray-400 bg-white">
          {photos.map((photo, index) => (
            <img
              key={index}
              ref={(el) => (imgRefs.current[index] = el)}
              src={photo}
              alt="Hasil Jepretan"
              className="w-full object-cover"
              style={{ filter: filter }}
            />
          ))}
          <div
            ref={captionRef}
            className="text-center w-full font-bold mt-4 bg-white p-2 border-t border-gray-400"
            style={{ fontSize: `${fontSize}px`, fontFamily, color: fontColor }}
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
          Simpan 📥
        </button>
      </div>
    </div>
  );
}

export default EditPhoto;
