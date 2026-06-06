// 1. Import Firebase SDK untuk Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// 2. Inisialisasi Firebase di dalam Service Worker
// Gunakan data konfigurasi (firebaseConfig) yang Anda dapatkan dari Firebase Console
firebase.initializeApp({
  apiKey: "AIzaSyB7hFBIrWeYXfBYKzF90iayS96Gw4JrIbI",
  authDomain: "toko-barokah-ec660.firebaseapp.com",
  projectId: "toko-barokah-ec660",
  storageBucket: "toko-barokah-ec660.firebasestorage.app",
  messagingSenderId: "888272773041",
  appId: "1:888272773041:web:f483368e87690ac31d6790"
});

// 3. Ambil objek messaging Firebase
const messaging = firebase.messaging();

// 4. Logika untuk menangani notifikasi saat aplikasi web sedang ditutup (Background)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Menerima pesan di latar belakang: ', payload);

  // Ambil data notifikasi dari payload kiriman Google Apps Script
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.webpush?.notification?.icon || '/iconApps512.png',
    badge: '/iconAppsMonokrom.png', // Ikon kecil monokrom di bar status atas HP Android
    data: payload.data // Menyimpan data tambahan jika ada (seperti nomor resi)
  };

  // Tampilkan notifikasi ke layar HP/Perangkat user
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 5. Logika ketika notifikasi diklik oleh user/admin
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Ambil data halaman tujuan dari payload FCM
  const dataPayload = event.notification.data;
  const targetPage = dataPayload?.target_page || "halaman_utama";
  const resi = dataPayload?.resi || "";

  // Cari tahu apakah aplikasi web kita sedang terbuka di browser HP
  const urlTujuan = new URL(self.location.origin + '/index.html').href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. Jika aplikasi web SUDAH terbuka di salah satu tab
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url.includes('/index.html') && 'focus' in client) {
          client.focus();
          // Kirim pesan ke JavaScript Frontend SPA untuk berpindah halaman secara halus
          return client.postMessage({
            action: 'navigasi_spa',
            page: targetPage,
            resi: resi
          });
        }
      }

      // 2. Jika aplikasi web BELUM terbuka sama sekali, buka tab baru dengan parameter URL
      if (clients.openWindow) {
        return clients.openWindow(`/index.html?p=notif&target=${targetPage}&resi=${resi}`);
      }
    })
  );
});