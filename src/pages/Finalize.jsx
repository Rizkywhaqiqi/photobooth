import { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

function Finalize() {
  const location = useLocation();
  const navigate = useNavigate();
  const { photos, captions, font, color, selectedLayout } = location.state || {};
  const captureRef = useRef(null);

  if (!photos || !captions || !selectedLayout) {
    return (
      <div className="text-center text-red-600 font-semibold p-6">
        <h2>Error: No Photos Found</h2>
        <p>Please go back and take photos first.</p>
      </div>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "photobooth.png";
      link.click();
    }
  };

  return (
    <div className="text-center text-gray-900 p-6">
      <h1 className="text-2xl font-semibold">Your Final Photo</h1>
      <p className="text-gray-600 mt-2">Download or share your photobooth picture.</p>

      {/* Preview Final */}
      <div ref={captureRef} className="mt-6 p-4 bg-gray-100 rounded-md shadow-md inline-block">
        <div className={`grid gap-2 justify-center grid-cols-${selectedLayout.cols}`}>
          {photos.map((photo, index) => (
            <div key={index} className="relative bg-white p-2 shadow-md rounded-lg border border-gray-300">
              <img src={photo} alt={`Final ${index}`} className="w-full h-auto rounded-md" />
              {index >= (photos.length - selectedLayout.cols) && (
                <p className="absolute bottom-0 left-0 right-0 text-center font-semibold" style={{ fontFamily: font, color: color }}>
                  {captions[index]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Download & Share */}
      <div className="mt-6 flex justify-center gap-4">
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
          onClick={handleDownload}
        >
          Download
        </button>
        <button 
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
          onClick={() => alert("Sharing feature coming soon!")}
        >
          Share
        </button>
      </div>

      <button 
        className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
        onClick={() => navigate("/")}
      >
        Start Over
      </button>
    </div>
  );
}

export default Finalize;
