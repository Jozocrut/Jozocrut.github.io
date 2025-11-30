// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyB3b42LSiKPVx6KjCNoYy4SNFPgdAORN5g",
    authDomain: "delfos-84316.firebaseapp.com",
    projectId: "delfos-84316",
    storageBucket: "delfos-84316.appspot.com",
    messagingSenderId: "308101271742",
    appId: "1:308101271742:web:ee240676dcd05927cbceef"
});

messaging.onBackgroundMessage((payload) => {
    console.log("Mensaje recibido en background:", payload);

    const notif = payload.notification || payload.data || {};

    const title = notif.title || "Sin título";
    const body  = notif.body  || "Sin mensaje";

    self.registration.showNotification(title, {
        body: body,
        icon: "./img/favicon_192.png"
    });
});


