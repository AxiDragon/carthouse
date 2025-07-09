import { HashRouter, Route, Routes } from "react-router-dom";
import JustDrawing from "./JustDrawing/JustDrawing";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<JustDrawing />} />
        <Route path="/justdrawing" element={<JustDrawing />} />
      </Routes>
    </HashRouter>
  )
}

export default App;
