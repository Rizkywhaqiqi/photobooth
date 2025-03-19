import { useNavigate } from "react-router-dom";
import layouts from "../data/layouts";

function ChooseLayout({ setSelectedLayout }) {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold">Pilih Template, Lok!</h1>
      <p className="text-gray-600 mt-2">
        Maok foto kau gaye polaroid? Atau yang panjang macam cetakan ATM? Pilih satu pek!
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            className="p-4 border rounded-lg bg-white shadow hover:bg-gray-200 transition"
            onClick={() => {
              setSelectedLayout(layout);
              navigate("/take-photo");
            }}
          >
            {layout.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChooseLayout;
