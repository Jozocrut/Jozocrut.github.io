// -------------------------------------------------------------
//               IMPORTS FIRESTORE Y MESSAGING
// -------------------------------------------------------------
import {
    collection, addDoc, deleteDoc, doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
    getToken, onMessage
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging.js";


// -------------------------------------------------------------
//                        VALIDACIÓN
// -------------------------------------------------------------
if (!window.db) {
    console.error("Firestore (db) no está inicializado.");
}
if (!window.messaging) {
    console.warn("Messaging no inicializado (no usas FCM en este index).");
}


// -------------------------------------------------------------
//                  REFERENCIA A LA COLECCIÓN
// -------------------------------------------------------------
const itemsRef = collection(window.db, "items");


// -------------------------------------------------------------
//            FUNCIÓN NATIVA PARA NOTIFICACIONES
// -------------------------------------------------------------
const showNativeNotification = (title, options) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
        Notification.requestPermission().then(p => {
            if (p === "granted") new Notification(title, options);
        });
    } else if (Notification.permission === "granted") {
        new Notification(title, options);
    }
};


// -------------------------------------------------------------
//                   CRUD — LISTADO EN TIEMPO REAL
// -------------------------------------------------------------
onSnapshot(itemsRef, (snapshot) => {
    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";

    snapshot.forEach(docRef => {
        const item = docRef.data();

        const li = document.createElement("li");
        li.style = "font-size:18px; margin:6px 0; list-style:none;";
        li.innerHTML = `
            <div style="display:flex; gap:12px; justify-content:space-between;">
                <div>
                    <strong>${item.numero}</strong> - ${item.nombre}<br>
                    <small>${item.categoria} | Nivel: ${item.nivel}</small><br>
                    <span>${item.descripcion}</span>
                </div>

                <button 
                    class="btn-eliminar"
                    data-id="${docRef.id}"
                    style="cursor:pointer; font-size:20px;"
                >❌</button>
            </div>
        `;

        lista.appendChild(li);
    });

    // Botones eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", async e => {
            const id = e.target.getAttribute("data-id");
            if (!confirm("¿Eliminar registro?")) return;

            await deleteDoc(doc(window.db, "items", id));
        }, { passive: true });
    });
});


// -------------------------------------------------------------
//                    CRUD — AGREGAR ITEM
// -------------------------------------------------------------
window.crear = async function () {
    const numero = document.getElementById("numero").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const nivel = document.getElementById("nivel").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!numero || !nombre || !categoria || !nivel || !descripcion) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    await addDoc(itemsRef, {
        numero: Number(numero),
        nombre,
        categoria,
        nivel: Number(nivel),
        descripcion
    });

    // Notificación al agregar
    showNativeNotification("Registro agregado", {
        body: `${nombre} fue agregado correctamente.`,
        icon: "./img/favicon_192.png"
    });

    // limpiar campos
    document.getElementById("numero").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("nivel").value = "";
    document.getElementById("descripcion").value = "";
};


// Botón agregar
document.getElementById("btnAgregar")?.addEventListener("click", () => {
    window.crear();
}, { passive: true });


// -------------------------------------------------------------
//            NOTIFICACIONES FCM EN FOREGROUND
// -------------------------------------------------------------
if (window.messaging) {
    onMessage(window.messaging, payload => {
        showNativeNotification(payload.notification.title, {
            body: payload.notification.body,
            icon: "./img/favicon_192.png"
        });
    });
}


// -------------------------------------------------------------
//                       SMOOTH SCROLL
// -------------------------------------------------------------
$("#menu a").on("click", function (e) {
    e.preventDefault();

    const destino = $($(this).attr("href"));
    if (!destino.length) return;

    window.scrollTo({
        top: destino.offset().top,
        behavior: "smooth"
    });
});
