import { useNavigate } from "react-router-dom";

function Greeting() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-500 to-purple-700 text-white">
      <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg text-center">
        putolok!
      </h1>
      <p className="text-lg text-gray-200 max-w-md text-center">
        Nak nampak ganteng/cantik, Jangan harap! 🤣  
        Tapi paleng nda udah begaye.
      </p>
      <button
        className="mt-6 px-8 py-3 bg-white text-purple-600 font-bold text-lg rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        onClick={() => navigate("/choose-layout")}
      >
        Gaskeun, Lok! 🚀
      </button>
    </div>
  );
}

export default Greeting;
