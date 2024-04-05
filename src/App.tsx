import Pokenet from "./pokenet";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Pokenet" />} />
          <Route path="/Pokenet/*" element={<Pokenet />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
export default App;