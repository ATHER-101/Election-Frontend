import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { FiFileText } from "react-icons/fi";

export default function Voting() {
  const [otp, setOtp] = useState("");
  const [positions, setPositions] = useState([]);
  const [selectedVotes, setSelectedVotes] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/voting/positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (data.success) {
        setPositions(data.data.positions);
        setCurrentIndex(0);
        setHasVoted(false);
      } else {
        setMessage(data.message || "Invalid OTP");
      }
    } catch {
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSelect = (positionId, candidateId) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }));
  };

  const handleNext = () => setCurrentIndex((prev) => prev + 1);
  const handlePrev = () => setCurrentIndex((prev) => prev - 1);

  const handleSubmitVotes = async () => {
    setLoading(true);
    setMessage("");
    try {
      const votesArray = Object.entries(selectedVotes)
        .filter(([_, candidateId]) => candidateId !== "NOTA")
        .map(([positionId, candidateId]) => ({ positionId, candidateId }));

      const res = await fetch(`${API_BASE_URL}/api/voting/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, votes: votesArray }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        setHasVoted(true);
        setTimeout(() => {
          setOtp("");
          setPositions([]);
          setSelectedVotes({});
          setCurrentIndex(0);
          setHasVoted(false);
          setMessage("");
        }, 3000);
      } else setMessage(data.message || "Failed to submit votes");
    } catch {
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  if (!positions.length && !hasVoted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 px-4 sm:px-6 lg:px-12 py-12 text-white">
        <h1 className="text-4xl md:text-5xl pb-5 mb-5 font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg text-center">
          🗳️ Voting Portal
        </h1>

        <div className="w-full max-w-md space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
          <p className="text-center text-gray-300 mb-2">Enter 6-digit OTP</p>
          <div className="flex justify-between gap-2">
            {[...Array(6)].map((_, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                value={otp[idx] || ""}
                onChange={(e) => {
                  if (!/^\d*$/.test(e.target.value)) return;
                  const newOtp = otp.split("");
                  newOtp[idx] = e.target.value;
                  setOtp(newOtp.join(""));
                  if (e.target.value && idx < 5) {
                    const next = document.getElementById(`otp-${idx + 1}`);
                    next?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otp.length === 6) handleVerifyOtp();
                  if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                    const prev = document.getElementById(`otp-${idx - 1}`);
                    prev?.focus();
                  }
                }}
                id={`otp-${idx}`}
                className="w-12 sm:w-14 h-12 sm:h-14 text-center text-lg rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.length < 6}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {message && <p className="text-red-400 text-sm mt-2 text-center break-words">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 px-4 sm:px-6 lg:px-12 py-12 text-white overflow-x-hidden relative">
      <h1 className="text-4xl md:text-5xl font-extrabold pb-5 mb-10 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg text-center z-20 relative">
        🗳️ Voting Portal
      </h1>

      <div className="relative w-full max-w-5xl h-[700px] flex justify-center items-center overflow-hidden">
        {positions.map((position, index) => {
          const offset = index - currentIndex;

          let translateX = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 50 - Math.abs(offset);

          if (offset < 0) {
            // previous slabs on left
            translateX = -50 + offset * 10;
            scale = 0.9;
            opacity = 0.4;
          } else if (offset > 0) {
            // upcoming slabs on right, always slightly visible
            translateX = 30 + offset * 10; // peek effect
            scale = 0.9;
            opacity = 0.4;
          }

          if (offset === 0) {
            translateX = 0;
            scale = 1;
            opacity = 1;
            zIndex = 100;
          }

          return (
            <div
              key={position.id}
              className="absolute top-0 w-full transition-all duration-500 ease-in-out"
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                zIndex,
                opacity,
                backdropFilter: "blur(25px)",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "2rem",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "1.5rem",
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-pink-400 text-center mb-6">{position.name}</h2>

              <div className="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {position.candidates.map((c) => (
                  <label
                    key={c.id}
                    className={`flex flex-col items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-white/10 transition
                      ${selectedVotes[position.id] === c.id ? "border-purple-500 bg-white/10" : "border-white/20"}`}
                    style={{ aspectRatio: "1 / 1", minHeight: "280px" }}
                  >
                    <img
                      src={c["photo-url"]}
                      alt={c.name}
                      className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white/30 mb-3"
                    />
                    <div className="flex items-center gap-2 mb-2 flex-wrap justify-center">
                      <p className="font-bold text-lg sm:text-2xl text-center">{c.name}</p>
                      {c["manifesto-url"] && (
                        <a
                          href={c["manifesto-url"]}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-pink-400 font-semibold hover:bg-white/20 transition"
                        >
                          <FiFileText />
                        </a>
                      )}
                    </div>
                    <input
                      type="radio"
                      name={position.id}
                      value={c.id}
                      checked={selectedVotes[position.id] === c.id}
                      onChange={() => handleVoteSelect(position.id, c.id)}
                      className="hidden"
                    />
                  </label>
                ))}

                <label
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-white/10 transition
                    ${selectedVotes[position.id] === "NOTA" ? "border-purple-500 bg-white/10" : "border-white/20"}`}
                  style={{ aspectRatio: "1 / 1", minHeight: "280px" }}
                >
                  <p className="font-bold text-4xl mb-2">NOTA</p>
                  <input
                    type="radio"
                    name={position.id}
                    value="NOTA"
                    checked={selectedVotes[position.id] === "NOTA"}
                    onChange={() => handleVoteSelect(position.id, "NOTA")}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-between mt-4 flex-wrap gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  Previous
                </button>

                {currentIndex < positions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!selectedVotes[position.id]}
                    className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitVotes}
                    disabled={!selectedVotes[position.id] || loading}
                    className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 ml-auto"
                  >
                    {loading ? "Submitting..." : "Cast Votes"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg text-center">
          <p className="text-green-400 font-bold text-xl break-words">
            ✅ You have successfully submitted your votes! Reloading...
          </p>
        </div>
      )}

      {message && !hasVoted && <p className="mt-4 text-center font-semibold text-red-400 break-words">{message}</p>}
    </div>
  );
}