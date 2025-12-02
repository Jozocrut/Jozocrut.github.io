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

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const n = payload.notification || { title: "Sin título", body: "Sin mensaje" };

    self.registration.showNotification(n.title, {
        body: n.body,
        icon: "./img/favicon_192.png"
    });
});
