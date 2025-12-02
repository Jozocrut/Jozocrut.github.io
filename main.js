// ----------------------------------------------
// IMPORTS FIRESTORE + MESSAGING
// ----------------------------------------------
import {
    collection, addDoc, deleteDoc, doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
    getMessaging, getToken, onMessage
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging.js";


// ----------------------------------------------
// VERIFICAR QUE FIREBASE ESTÉ INICIALIZADO
// ----------------------------------------------
if (!window.db) {
    console.error("Firestore no está inicializado. Revisa index.html");
}
if (!window.messaging) {
    // Si no existe, lo creamos aquí
    window.messaging = getMessaging();
}


// ----------------------------------------------
// COLECCIÓN FIRESTORE
// ----------------------------------------------
const itemsRef = collection(window.db, "items");


// ----------------------------------------------
// FUNCIÓN GENERAL DE NOTIFICACIONES
// ----------------------------------------------
const showNativeNotification = (title, options = {}) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification(title, options);
        return;
    }

    if (Notification.permission === "default") {
        Notification.requestPermission().then(p => {
            if (p === "granted") new Notification(title, options);
        });
    }
};


// ----------------------------------------------
// CRUD - ESCUCHAR CAMBIOS EN TIEMPO REAL
// ----------------------------------------------
onSnapshot(itemsRef, (snapshot) => {
    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";

    snapshot.forEach(docu => {
        const d = docu.data();

        const li = document.createElement("li");
        li.style = "font-size:18px; margin:6px 0; list-style:none;";
        li.innerHTML = `
            <div style="display:flex; gap:12px; align-items:center; justify-content:space-between; width:100%;">
                <div>
                    <strong>${d.numero}</strong> - ${d.nombre} <br>
                    <small>${d.categoria} | Nivel: ${d.nivel}</small><br>
                    <span>${d.descripcion}</span>
                </div>
                <button data-id="${docu.id}" class="btn-eliminar">❌</button>
            </div>
        `;
        lista.appendChild(li);
    });

    // botones eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.target.getAttribute("data-id");
            if (!confirm("¿Eliminar registro?")) return;

            await deleteDoc(doc(window.db, "items", id));
            showNativeNotification("Registro eliminado", {
                body: "El item fue eliminado correctamente.",
                icon: "./img/favicon_192.png"
            });
        };
    });
});


// ----------------------------------------------
// CRUD - AGREGAR
// ----------------------------------------------
window.crear = async function () {

    // ⛔ Padrino, AQUÍ estaba tu error: NUNCA reutilices nombres de variables.
    const numeroVal = document.getElementById("numero").value.trim();
    const nombreVal = document.getElementById("nombre").value.trim();
    const categoriaVal = document.getElementById("categoria").value.trim();
    const nivelVal = document.getElementById("nivel").value.trim();
    const descripcionVal = document.getElementById("descripcion").value.trim();

    if (!numeroVal || !nombreVal || !categoriaVal || !nivelVal || !descripcionVal) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    await addDoc(itemsRef, {
        numero: Number(numeroVal),
        nombre: nombreVal,
        categoria: categoriaVal,
        nivel: Number(nivelVal),
        descripcion: descripcionVal
    });

    // limpiar campos
    document.getElementById("numero").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("nivel").value = "";
    document.getElementById("descripcion").value = "";

    showNativeNotification("Registro agregado", {
        body: `${nombreVal} fue agregado correctamente.`,
        icon: "./img/favicon_192.png"
    });
};


// ----------------------------------------------
// BOTÓN AGREGAR
// ----------------------------------------------
document.getElementById("btnAgregar").onclick = () => window.crear();


// ----------------------------------------------
// PERMISOS DE NOTIFICACIONES
// ----------------------------------------------
async function solicitarPermiso() {
    const permiso = await Notification.requestPermission();
    if (permiso !== "granted") {
        alert("No se otorgó permiso para notificaciones.");
        return;
    }

    const token = await getToken(window.messaging, {
        vapidKey: "BPdlJHTy6fXvmE7nm0j-5l9oEYOz6LyHmLkCkqM_3woXLozwTeVRsYoVezV5CJ6baYkWzmp1EYB3VuSOMqgkpmg"
    });

    console.log("TOKEN FCM:", token);

    showNativeNotification("Notificaciones activadas", {
        body: "Tu dispositivo ya puede recibir mensajes.",
        icon: "./img/favicon_192.png"
    });
}

// pedir permiso al hacer clic en cualquier parte (solo 1 vez)
window.addEventListener("click", solicitarPermiso, { once: true });


// ----------------------------------------------
// FCM - MENSAJES EN FOREGROUND
// ----------------------------------------------
onMessage(window.messaging, (payload) => {
    showNativeNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "./img/favicon_192.png"
    });
});


// ----------------------------------------------
// SMOOTH SCROLL
// ----------------------------------------------
$("#menu a").click(function (e) {
    e.preventDefault();
    $("html, body").animate({
        scrollTop: $($(this).attr("href")).offset().top
    });
});
