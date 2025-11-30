importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Tu config de Firebase
firebase.initializeApp({
    apiKey: "AIzaSyB3b42LSiKPVx6KjCNoYy4SNFPgdAORN5g",
    authDomain: "delfos-84316.firebaseapp.com",
    projectId: "delfos-84316",
    storageBucket: "delfos-84316.appspot.com",
    messagingSenderId: "308101271742",
    appId: "1:308101271742:web:ee240676dcd05927cbceef"
});

// Inicializar FCM
const messaging = firebase.messaging();

// Notificación cuando la app está cerrada
messaging.onBackgroundMessage((payload) => {
    console.log("Mensaje en background:", payload);

    const title = payload.notification?.title || "Notificación";
    const body  = payload.notification?.body  || "Tienes un mensaje nuevo";

    self.registration.showNotification(title, {
        body: body,
        icon: "./img/favicon_192.png"
    });
});
