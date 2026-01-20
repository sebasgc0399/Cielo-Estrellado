// src/components/Login.js
import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase-config"; // Asegúrate de que la ruta sea correcta
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Lista de UID permitidos
  const allowedUIDs = [
    "G3Sr0P2LAORmFi5yiT8cxwd7n8I2", // Reemplaza con el UID de tu usuario
    "28RxuCs4dtWbRKgvWIgapaYmo2E2", // Reemplaza con el UID de tu novia
  ];

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Validar si el UID está permitido
      if (!allowedUIDs.includes(uid)) {
        throw new Error("No estás autorizado para iniciar sesión.");
      }

      navigate("/"); // Redirigir a la página principal después de iniciar sesión
    } catch (err) {
      setError("Error al iniciar sesión con correo electrónico. " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;

      // Validar si el UID está permitido
      if (!allowedUIDs.includes(uid)) {
        throw new Error("No estás autorizado para iniciar sesión.");
      }

      navigate("/"); // Redirigir a la página principal después de iniciar sesión
    } catch (err) {
      setError("Error al iniciar sesión con Google. " + err.message);
    }
  };

  const drawConstellations = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array(100)
      .fill()
      .map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        dx: Math.random() * 0.5 - 0.25,
        dy: Math.random() * 0.5 - 0.25,
      }));

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();

        star.x += star.dx;
        star.y += star.dy;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });

      stars.forEach((star, i) => {
        stars.slice(i + 1).forEach((otherStar) => {
          const distance = Math.hypot(star.x - otherStar.x, star.y - otherStar.y);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(otherStar.x, otherStar.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(drawStars);
    };

    drawStars();
  };

  useEffect(() => {
    drawConstellations();
  }, []);

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="canvas-bg" />
      <div className="login-box">
        <h2>Inicia Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Iniciar Sesión</button>
        </form>
        <button onClick={handleGoogleLogin} className="google-login">
          Iniciar Sesión con Google
        </button>
      </div>
    </div>
  );
};

export default Login;
