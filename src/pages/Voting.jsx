// src/pages/Voting.jsx
import React, { useState } from "react"
import { API_BASE_URL } from "../config"

export default function Voting() {
  const [otp, setOtp] = useState("")
  const [positions, setPositions] = useState([])
  const [selectedVotes, setSelectedVotes] = useState({})
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVerifyOtp = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch(`${API_BASE_URL}/api/voting/positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      })
      const data = await res.json()
      if (data.success) {
        setPositions(data.data.positions)
        setHasVoted(false)
      } else {
        setMessage(data.message || "Invalid OTP")
      }
    } catch (err) {
      setMessage("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  const handleVoteSelect = (positionId, candidateId) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }))
  }

  const handleSubmitVotes = async () => {
    setLoading(true)
    setMessage("")
    try {
      const votesArray = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
        positionId,
        candidateId,
      }))

      const res = await fetch(`${API_BASE_URL}/api/voting/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, votes: votesArray }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        setHasVoted(true)
      } else {
        setMessage(data.message || "Failed to submit votes")
      }
    } catch (err) {
      setMessage("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Voting Portal</h2>

      {!positions.length && !hasVoted && (
        <div className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      {positions.length > 0 && !hasVoted && (
        <div className="w-full max-w-2xl mt-6 space-y-6">
          {positions.map((pos) => (
            <div key={pos.id} className="border rounded-lg p-4 shadow">
              <h3 className="text-xl font-semibold mb-2">{pos.name}</h3>
              <div className="space-y-3">
                {pos.candidates.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center space-x-3 border p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={pos.id}
                      value={c.id}
                      checked={selectedVotes[pos.id] === c.id}
                      onChange={() => handleVoteSelect(pos.id, c.id)}
                    />
                    <img
                      src={c["photo-url"]}
                      alt={c.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-medium">{c.name}</p>
                      {c["manifesto-url"] && (
                        <a
                          href={c["manifesto-url"]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 text-sm underline"
                        >
                          View Manifesto
                        </a>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmitVotes}
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Submit Votes"}
          </button>
        </div>
      )}

      {hasVoted && (
        <p className="mt-6 text-green-700 font-semibold">
          ✅ You have successfully submitted your votes!
        </p>
      )}

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  )
}