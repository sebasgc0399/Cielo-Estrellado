import React, { useEffect, useRef } from "react";
import "./BackgroundStars.css";

const BackgroundStars = () => {
  const skyRef = useRef(null);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null); // Para rastrear el frame de animación

  useEffect(() => {
    const createBackgroundStars = () => {
      const sky = skyRef.current;
      if (!sky) return;

      // Eliminar estrellas existentes antes de agregar nuevas (para evitar duplicados)
      while (sky.firstChild) {
        sky.removeChild(sky.firstChild);
      }

      // Crear nuevas estrellas
      for (let i = 0; i < 150; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;

        // Tamaños aleatorios para las estrellas
        const size = Math.random() * 2 + 1; // Entre 1px y 3px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`; // Variar parpadeo

        // Agregar profundidad como dataset
        star.dataset.depth = Math.random() * 10; // Profundidad entre 0 y 10

        sky.appendChild(star);
      }
    };

    const handleMouseMove = (event) => {
      if (!skyRef.current) return;

      const rect = skyRef.current.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1; // Normalizar entre -1 y 1
      const mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

      targetPosition.current = { x: mouseX, y: mouseY };
    };

    const handleDeviceOrientation = (event) => {
      const beta = event.beta; // Inclinación hacia adelante/atrás
      const gamma = event.gamma; // Inclinación hacia izquierda/derecha

      // Normalizar valores entre -1 y 1
      const gyroX = gamma / 90;
      const gyroY = beta / 180;

      targetPosition.current = { x: gyroX, y: gyroY };
    };

    const updateStarPositions = () => {
      if (!skyRef.current) {
        // Intentar nuevamente si el contenedor no está disponible
        animationFrameId.current = requestAnimationFrame(updateStarPositions);
        return;
      }

      const stars = skyRef.current.querySelectorAll(".star");

      // Interpolación suave para las posiciones
      currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * 0.1;
      currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * 0.1;

      stars.forEach((star) => {
        const depth = parseFloat(star.dataset.depth) || 1; // Obtener profundidad
        const xOffset = currentPosition.current.x * depth * 5; // Multiplicar por profundidad
        const yOffset = currentPosition.current.y * depth * 5;

        star.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });

      // Continuar la animación
      animationFrameId.current = requestAnimationFrame(updateStarPositions);
    };

    // Crear las estrellas al montar el componente
    createBackgroundStars();

    // Agregar eventos para la interactividad
    window.addEventListener("mousemove", handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    }

    // Iniciar la animación
    updateStarPositions();

    // Limpiar eventos y animación al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current); // Detener la animación
      }
    };
  }, []);

  return <div className="sky" ref={skyRef}></div>;
};

export default BackgroundStars;
