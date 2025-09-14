import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Voting from "./pages/Voting"
import SignIn from "./pages/SignIn"
import AdminDashboard from "./pages/AdminDashboard"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </div>
  )
}