import { useEffect } from "react";
import "./ShootingStars.css";

const ShootingStars = () => {
  useEffect(() => {
    const sky = document.querySelector(".sky");

    const createShootingStar = () => {
      const shootingStar = document.createElement("div");
      shootingStar.classList.add("shooting-star");

      // Posición inicial aleatoria
      shootingStar.style.left = `${Math.random() * 100}vw`;
      shootingStar.style.top = `${Math.random() * 50}vh`; // Aparecen en la mitad superior del cielo

      // Tamaño aleatorio para variedad
      const size = Math.random() * 2 + 1; // Entre 1px y 3px
      shootingStar.style.width = `${size}px`;
      shootingStar.style.height = `${size}px`;

      // Dirección aleatoria (ángulo de movimiento)
      const angle = Math.random() * 45 + 30; // Entre 30° y 75° para un ángulo más natural
      shootingStar.style.setProperty("--angle", `${angle}deg`);

      // Duración aleatoria (velocidad)
      const duration = Math.random() * 2 + 1; // Entre 1s y 3s
      shootingStar.style.animationDuration = `${duration}s`;

      sky.appendChild(shootingStar);

      // Remover la estrella fugaz después de su animación
      setTimeout(() => {
        shootingStar.remove();
      }, duration * 1000);
    };

    const startDynamicStars = () => {
      setTimeout(() => {
        createShootingStar();
        startDynamicStars(); // Llama recursivamente con un nuevo delay
      }, Math.random() * 2000 + 500); // Entre 0.5s y 2.5s para mayor dinamismo
    };

    startDynamicStars(); // Comienza el proceso dinámico al montar el componente

    return () => {
      const allStars = document.querySelectorAll(".shooting-star");
      allStars.forEach((star) => star.remove());
    };
  }, []);

  return null;
};

export default ShootingStars;
