importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfig = Object.fromEntries(urlParams);
});

// Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: proccess.env.VITE_FIREBASE_API_KEY,
//   authDomain: proccess.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: proccess.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: proccess.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: proccess.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
//   appId: proccess.env.VITE_FIREBASE_APP_ID,
//   measurementId: proccess.env.VITE_FIREBASE_MEMSUREMENT_ID,
// };

const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

firebase.initializeApp(self.firebaseConfig || defaultConfig);

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