// Scripts for firebase and firebase messaging
const firebase = require("firebase");
require("dotenv").config();
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: proccess.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: proccess.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: proccess.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: proccess.env.VITE_FIREBASE_APP_ID,
  measurementId: proccess.env.VITE_FIREBASE_MEMSUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});