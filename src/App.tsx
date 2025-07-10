import { HashRouter, Route, Routes } from "react-router-dom";
import JustDrawing from "./JustDrawing/JustDrawing";
import LimitedInk from "./LimitedInk/LimitedInk";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<JustDrawing />} />
        <Route path="/justdrawing" element={<JustDrawing />} />
        <Route path="/limitedink" element={<LimitedInk />} />
      </Routes>
    </HashRouter>
  )
}

export default App;
