import React, { useState } from "react";
import "./InteractiveStar.css";

const InteractiveStar = ({ x, y, title, message, imageUrl, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`interactive-star ${hovered ? "hovered" : ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        background: imageUrl
          ? `url(${imageUrl}) no-repeat center/cover`
          : "yellow", // Color por defecto si no hay imagen
      }}
      onClick={() => onClick({ title, message, imageUrl })}
      onMouseEnter={() => setHovered(true)} // Cambia estado al pasar el ratón
      onMouseLeave={() => setHovered(false)} // Vuelve al estado normal
    />
  );
};

export default InteractiveStar;
