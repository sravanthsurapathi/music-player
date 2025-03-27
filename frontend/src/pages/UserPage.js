import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "../styles/UserPage.css";
import Navbar from "../components/Navbar";

const UserPage = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await api.get("/user/music");
        setTracks(res.data);
      } catch (error) {
        console.error("Error loading tracks:", error);
      }
    };
    fetchTracks();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  useEffect(() => {
    if (currentTrack) {
      const audio = audioRef.current;
      audio.src = currentTrack.s3_url;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Playback error:", err));
    }
  }, [currentTrack]);

  useEffect(() => {
    const handleEnded = () => {
      const index = tracks.findIndex((t) => t.id === currentTrack?.id);
      const nextTrack = tracks[index + 1];
      setCurrentTrack(nextTrack || null);
      setIsPlaying(false);
    };

    const audio = audioRef.current;
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentTrack, tracks]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Play error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleAddToLibrary = async (musicId) => {
    try {
      await api.post("/library", { music_id: musicId });
      alert("Added to your library!");
    } catch (error) {
      console.error("Error adding to library:", error);
      alert("Failed to add to library.");
    }
  };

  return (
    <div className="user-page">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="library-section">
          <h1 className="library-title">🎵 Music Library</h1>
          <div className="music-grid">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="music-card"
                onClick={() => {
                  setCurrentTrack(track);
                  setProgress(0);
                }}
              >
                <h3>{track.title}</h3>
                <p>{track.artist}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="player-section">
          <h2 className="now-playing-title">
            Now Playing:{" "}
            {currentTrack
              ? `${currentTrack.title} by ${currentTrack.artist}`
              : "Nothing selected"}
          </h2>

          {currentTrack && (
            <>
              <p className="track-artist">{currentTrack.artist}</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="controls">
                <button onClick={togglePlayPause}>
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  onClick={() => handleAddToLibrary(currentTrack.id)}
                  style={{ marginLeft: "10px", backgroundColor: "#007bff", color: "#fff" }}
                >
                  ➕ Add to Library
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
