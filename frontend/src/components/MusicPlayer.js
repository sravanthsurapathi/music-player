import React, { useState, useEffect, useRef } from "react";

const MusicPlayer = ({ currentTrack, onTrackEnd, audioRef, setIsPlaying }) => {
  const [isLocalPlaying, setLocalPlaying] = useState(false);
  const internalRef = useRef(null); // fallback if no external ref
  const playerRef = audioRef || internalRef;

  // Handle track change
  useEffect(() => {
    if (currentTrack && playerRef.current) {
      playerRef.current.src = currentTrack.s3_url;
      playerRef.current.load();

      const playPromise = playerRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setLocalPlaying(true);
            setIsPlaying && setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Auto-play failed:", error);
          });
      }
    }
  }, [currentTrack]);

  // Track ended event
  useEffect(() => {
    const audio = playerRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setLocalPlaying(false);
      setIsPlaying && setIsPlaying(false);
      onTrackEnd && onTrackEnd();
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onTrackEnd]);

  // Play / Pause toggle
  const togglePlayPause = () => {
    if (!currentTrack || !playerRef.current) return;

    if (isLocalPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play().catch((err) => console.error("Play failed:", err));
    }

    setLocalPlaying(!isLocalPlaying);
    setIsPlaying && setIsPlaying(!isLocalPlaying);
  };

  return (
    <div className="music-player">
      <audio ref={playerRef} hidden />
      <h2 style={{ marginTop: "20px", color: "#333" }}>
        {/* Now Playing: {currentTrack ? `${currentTrack.title} by ${currentTrack.artist}` : "Nothing selected"} */}
      </h2>
      <button
        style={{
          marginTop: "10px",
          backgroundColor: "#4db8ff",
          color: "white",
          padding: "8px 16px",
          border: "none",
          fontSize: "14px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
        onClick={togglePlayPause}
        disabled={!currentTrack}
      >
        {isLocalPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default MusicPlayer;
