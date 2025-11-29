importScripts("https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyB3b42LSiKPVx6KjCNoYy4SNFPgdAORN5g",
    authDomain: "delfos-84316.firebaseapp.com",
    projectId: "delfos-84316",
    storageBucket: "delfos-84316.appspot.com",
    messagingSenderId: "308101271742",
    appId: "1:308101271742:web:ee240676dcd05927cbceef",
});

const messaging = firebase.messaging();

// Notificación cuando la app está cerrada
messaging.onBackgroundMessage((payload) => {
    console.log("Mensaje en background:", payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "./img/favicon_192.png"
    });
});
