import React, { useEffect, useState } from "react"

export default function Home() {
  // ⚡ Replace with actual election schedule
  const electionStart = new Date("2025-09-14T09:00:00")
  const electionEnd = new Date("2025-09-14T14:00:00")
  const resultsTime = new Date("2025-09-21T10:00:00")

  const [now, setNow] = useState(new Date())
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let target
    if (now < electionStart) {
      target = electionStart
    } else if (now >= electionStart && now <= electionEnd) {
      target = electionEnd
    } else {
      target = resultsTime
    }

    const diff = Math.max(0, target - now)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeLeft({ hours, minutes, seconds })
  }, [now])

  const getPhase = () => {
    if (now < electionStart) return "Election starts in"
    if (now >= electionStart && now <= electionEnd) return "Election ends in"
    return "Results will be declared in"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white px-6 pt-28 pb-12">
      {/* Hero Section */}
      <div className="max-w-6xl text-center p-10 mb-12">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          🗳️ Institute Elections 2025
        </h1>
        <p className="text-2xl md:text-4xl font-semibold text-gray-300">
          Your voice. <span className="text-pink-400"> Your Power.</span> <span className="text-purple-400"> Your future.</span> ✨
        </p>
      </div>

      {/* Countdown */}
      <div className="max-w-xl w-full text-center bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_25px_rgba(168,85,247,0.25)] rounded-3xl p-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-pink-400 tracking-wide">
          {getPhase()}
        </h2>

        <div className="flex justify-center gap-6 text-3xl md:text-5xl font-extrabold">
          <div className="flex flex-col items-center">
            <span>{timeLeft.hours ?? "--"}</span>
            <span className="text-sm md:text-lg font-medium text-gray-300 mt-2">
              Hours
            </span>
          </div>
          <span>:</span>
          <div className="flex flex-col items-center">
            <span>{timeLeft.minutes ?? "--"}</span>
            <span className="text-sm md:text-lg font-medium text-gray-300 mt-2">
              Minutes
            </span>
          </div>
          <span>:</span>
          <div className="flex flex-col items-center">
            <span>{timeLeft.seconds ?? "--"}</span>
            <span className="text-sm md:text-lg font-medium text-gray-300 mt-2">
              Seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}