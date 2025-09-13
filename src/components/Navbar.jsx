import { Link, NavLink } from "react-router-dom"

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">ElectionApp</Link>
      <div className="flex space-x-4">
        <NavLink to="/" className={linkClass}>Home</NavLink>
        <NavLink to="/voting" className={linkClass}>Voting</NavLink>
        <NavLink to="/signin" className={linkClass}>Sign In</NavLink>
      </div>
    </nav>
  )
}