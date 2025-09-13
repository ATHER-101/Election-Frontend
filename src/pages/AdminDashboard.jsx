import { useState } from "react"
import { API_BASE_URL } from "../config"

export default function AdminDashboard() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [eligiblePositions, setEligiblePositions] = useState([])
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("adminToken")

  if (!token) {
    return <p className="p-6 text-red-600">Unauthorized. Please sign in.</p>
  }

  const handleRegisterVoter = async (e) => {
    e.preventDefault()
    setMessage("")
    setEligiblePositions([])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/register-voter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to register voter")
      }

      setMessage(data.message)
      setEligiblePositions(data.eligiblePositions || [])
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Admin Dashboard
      </h1>

      <form onSubmit={handleRegisterVoter} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Voter Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="student@iitdh.ac.in"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register Voter"}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 rounded bg-gray-100 text-gray-700">
          {message}
          {eligiblePositions.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm text-green-700">
              {eligiblePositions.map((pos) => (
                <li key={pos}>{pos}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}