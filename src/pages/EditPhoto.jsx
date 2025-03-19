import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

function EditPhoto() {
  const location = useLocation();
  const { photos, selectedLayout, filter } = location.state || {}; // Ambil filter dari TakePhoto
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
      if (img) img.style.filter = filter; // Terapkan filter dari TakePhoto
    });
  }, [filter]);

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
    const container = canvasRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set ukuran canvas sesuai dengan preview
    const scale = window.devicePixelRatio || 2;
    canvas.width = container.clientWidth * scale;
    canvas.height = container.clientHeight * scale;
    ctx.scale(scale, scale);

    // Background putih agar tidak transparan
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

    let yOffset = 20; // ✅ Tambahkan padding atas agar bingkai tidak terpotong
    const gap = 10; // Jarak antar foto

    for (let i = 0; i < imgRefs.current.length; i++) {
      const img = imgRefs.current[i];
      if (img) {
        await new Promise((resolve) => {
          const imgElement = new Image();
          imgElement.src = img.src;
          imgElement.crossOrigin = "anonymous";
          imgElement.style.filter = filter;

          imgElement.onload = () => {
            requestAnimationFrame(() => {
              ctx.filter = filter; // Terapkan filter langsung ke canvas
              const imgWidth = canvas.width / scale - 40;
              const imgHeight = imgElement.height * (imgWidth / imgElement.width);
              ctx.drawImage(imgElement, 20, yOffset, imgWidth, imgHeight);
              yOffset += imgHeight + gap;
              resolve();
            });
          };
        });
      }
    }

    // Tambahkan teks caption dengan margin tambahan di bawah
    ctx.filter = "none"; // Pastikan teks tidak kena filter
    ctx.fillStyle = fontColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.fillText(caption, canvas.width / 1.5 , yOffset + 40); // ✅ Tambahkan padding bawah agar tidak terlalu dekat

    // Simpan gambar sebagai PNG
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "foto-keren.png";
      link.click();
      setIsSaved(true);
    }, "image/png");
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
                style={{ filter: filter }}
              />
            </div>
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
        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="p-2 border rounded" placeholder="Tulis caption di sini..." />
        <input type="range" min="12" max="32" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="p-2 border rounded" />
        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="p-2 border rounded">
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
        <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="p-2 border rounded" />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all" onClick={savePhoto}>
          Simpan 📥
        </button>
      </div>
    </div>
  );
}

export default EditPhoto;
