// Import script Firebase SDK yang dibutuhkan
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js');

// Inisialisasi Firebase di dalam Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyB7hFBIrWeYXfBYKzF90iayS96Gw4JrIbI",
  authDomain: "toko-barokah-ec660.firebaseapp.com",
  projectId: "toko-barokah-ec660",
  storageBucket: "toko-barokah-ec660.firebasestorage.app",
  messagingSenderId: "888272773041",
  appId: "1:888272773041:web:f483368e87690ac31d6790"
});

const messaging = firebase.messaging();

// Menangani notifikasi saat aplikasi berada di latar belakang
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Menerima pesan latar belakang: ', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/iconAppsMonokrom.png' // Sesuaikan dengan ikon aplikasi Tokbar Anda
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});