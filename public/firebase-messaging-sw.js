// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Inicializa Firebase dentro del Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyCNwuWaBItMg9WkZUOOwWNuFG6LexhVj90",
  authDomain: "masmelito-f209c.firebaseapp.com",
  projectId: "masmelito-f209c",
  storageBucket: "masmelito-f209c.firebasestorage.app",
  messagingSenderId: "18219710987",
  appId: "1:18219710987:web:3cf134fec551efb0e6250e",
});

// Inicializa Firebase Messaging
const messaging = firebase.messaging();

// Maneja mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("Mensaje recibido en segundo plano:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
