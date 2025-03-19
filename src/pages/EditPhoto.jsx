import { useState, useRef } from "react";
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
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontColor, setFontColor] = useState("#000000");
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
    "4-strip": "grid grid-rows-4 w-40 h-96 bg-white p-4 border border-gray-400",
    "3-strip": "grid grid-rows-3 w-40 h-72 bg-white p-4 border border-gray-400",
    "3-strip-landscape": "grid grid-cols-3 w-72 h-40 bg-white p-4 border border-gray-400",
    "square": "w-48 h-48 bg-white p-4 border border-gray-400 flex flex-col items-center",
    "wide": "w-72 h-56 bg-white p-4 border border-gray-400 flex flex-col items-center",
    "mini": "w-32 h-40 bg-white p-4 border border-gray-400 flex flex-col items-center",
    "2r": "w-48 h-64 bg-white p-4 border border-gray-400 flex flex-col items-center",
    "7x10": "w-56 h-80 bg-white p-4 border border-gray-400 flex flex-col items-center",
  };

  const savePhoto = async () => {
    const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 2 });
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
            className="text-center w-full font-bold mt-4 bg-white p-2 border-t border-gray-400"
            style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily, color: fontColor }}
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
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
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
      </div>
    </div>
  );
}

export default EditPhoto;
