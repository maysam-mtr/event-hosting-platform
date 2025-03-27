import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CreateMap from "./pages/CreateMap"
import UpdateMap from "./pages/UpdateMap"
import LatestMaps from "./pages/LatestMaps"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateMap />} />
      <Route path="/update/:id" element={<UpdateMap />} />
      <Route path="/latest" element={<LatestMaps />} />
    </Routes>
  )
}

export default App

