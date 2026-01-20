import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./components/LoginTemp";
import ProtectedRoute from "./components/ProtectedRoute";
import MainApp from "./components/MainApp";
import { subscribeToTopic } from "./api";
import {requestNotificationPermission,onMessageListener,registerServiceWorker} from "./firebase-config";
import "./App.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setIsLoading(false);
    });

    const setupNotifications = async () => {
      try {
        // Registra el Service Worker
        await registerServiceWorker();
    
        // Solicita permisos y obtiene el token FCM
        const token = await requestNotificationPermission();
        if (token) {
          console.log("Token FCM registrado:", token);
          await subscribeToTopic(token, "dailyReminder");
        }
      } catch (error) {
        console.error("Error al configurar notificaciones:", error);
      }
    };
    
  
    setupNotifications();

    // Escucha mensajes en primer plano
    onMessageListener()
      .then((payload) => {
        console.log("Mensaje recibido en primer plano:", payload);
        alert(`${payload.notification.title}: ${payload.notification.body}`); // Muestra una alerta simple como ejemplo
      })
      .catch((err) => console.error("Error en el listener de mensajes:", err));

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={currentUser}>
              <MainApp currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
