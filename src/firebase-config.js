// firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging"; // Importar funciones de Messaging

const firebaseConfig = {
  apiKey: "AIzaSyCNwuWaBItMg9WkZUOOwWNuFG6LexhVj90",
  authDomain: "masmelito-f209c.firebaseapp.com",
  projectId: "masmelito-f209c",
  storageBucket: "masmelito-f209c.firebasestorage.app",
  messagingSenderId: "18219710987",
  appId: "1:18219710987:web:3cf134fec551efb0e6250e",
  measurementId: "G-Z1BGBC52DF"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Instancias necesarias
export const auth = getAuth(app);
export const messaging = getMessaging(app);

// Función para registrar el Service Worker
export const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service Worker registrado con éxito:", registration);
    return registration;
  } catch (error) {
    console.error("Error al registrar el Service Worker:", error);
    throw error;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BIgx5TZXXZKWtIQXmfEoFS1A--9LZtBGOgghD2b_OA3jEOdMDmPwSAaZHtcUt6rqoWm0KcKh1yUAInvQM8jfAjo", // Asegúrate de que sea la clave pública
      });
      console.log("Token FCM obtenido:", token);
      return token;
    } else {
      console.error("Permiso para notificaciones denegado.");
    }
  } catch (error) {
    console.error("Error al obtener el token FCM:", error);
  }
};

// Escucha mensajes en primer plano
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Mensaje en primer plano recibido:", payload);
      resolve(payload);
    });
  });

export default app;
