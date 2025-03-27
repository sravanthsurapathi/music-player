import React from "react";
import "../styles/UserPage.css";

const MusicList = ({ musicTracks, onSelectTrack, onAddToLibrary }) => {
  return (
    <div className="music-list">
      <ul>
        {musicTracks.map((track) => (
          <li
            key={track.id}
            className="music-list-item"
          >
            <div onClick={() => onSelectTrack(track)} className="track-info">
              {track.title}
              <strong style={{ float: "right" }}>{track.artist}</strong>
            </div>
            {onAddToLibrary && (
              <button
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation(); // prevent selecting the track when clicking the button
                  onAddToLibrary(track.id);
                }}
              >
                ➕ Add to Library
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicList;
