import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Greeting from "./pages/Greeting";
import ChooseLayout from "./pages/ChooseLayout";
import TakePhoto from "./pages/TakePhoto";
import EditPhoto from "./pages/EditPhoto";

function App() {
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [font, setFont] = useState("Arial");
  const [color, setColor] = useState("#000000");

  const handleSave = ({ photos, captions, font, color }) => {
    setPhotos(photos);
    setCaptions(captions);
    setFont(font);
    setColor(color);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Greeting />} />
          <Route path="/choose-layout" element={<ChooseLayout setSelectedLayout={setSelectedLayout} />} />
          <Route path="/take-photo" element={<TakePhoto selectedLayout={selectedLayout} setPhotos={setPhotos} />} />
          <Route path="/edit" element={<EditPhoto onSave={handleSave} photos={photos} selectedLayout={selectedLayout} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
