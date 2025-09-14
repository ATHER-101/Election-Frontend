import { useState } from "react"
import { API_BASE_URL } from "../config"

export default function AdminDashboard() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [eligiblePositions, setEligiblePositions] = useState([])
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("adminToken")

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white px-6">
        <p className="p-6 text-red-500 text-lg font-semibold bg-white/10 rounded-xl backdrop-blur-xl border border-red-400/40">
          Unauthorized. Please sign in.
        </p>
      </div>
    )
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 px-6 pt-28 pb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold pb-5 mb-5 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg text-center">
        🗳️ Admin Dashboard
      </h1>
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_25px_rgba(236,72,153,0.25)] rounded-3xl p-8">

        <form onSubmit={handleRegisterVoter} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Voter Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 outline-none"
              placeholder="student@iitdh.ac.in"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Voter"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-200">
            <p className="font-semibold">{message}</p>
            {eligiblePositions.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-green-400">
                {eligiblePositions.map((pos) => (
                  <li key={pos}>{pos}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}