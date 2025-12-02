// ------------------------------------------------------------
// 🔥 FIRESTORE (CRUD)
// ------------------------------------------------------------
import {
    collection, addDoc, deleteDoc, doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Verifica que Firestore existe
if (!window.db) {
    console.error("Firestore no inicializado. Revisa index.html");
}

// Referencia a la colección
const itemsRef = collection(window.db, "items");


// ------------------------------------------------------------
// 🔔 NOTIFICACIONES NATIVAS
// ------------------------------------------------------------
const showNativeNotification = (title, options = {}) => {
    if (!("Notification" in window)) {
        console.warn("Este navegador no soporta notificaciones.");
        return;
    }

    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") new Notification(title, options);
        });
    } else if (Notification.permission === "granted") {
        new Notification(title, options);
    }
};


// ------------------------------------------------------------
// 🟢 ESCUCHAR EN TIEMPO REAL
// ------------------------------------------------------------
onSnapshot(itemsRef, (snapshot) => {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    snapshot.forEach(docSnap => {
        const item = docSnap.data();

        const li = document.createElement("li");
        li.style = "font-size:18px; margin:6px 0; list-style:none;";
        li.innerHTML = `
            <div style="display:flex; gap:12px; align-items:center; justify-content:space-between;">
                <div>
                    <strong>${item.numero}</strong> - ${item.nombre} <br>
                    <small>${item.categoria} | Nivel: ${item.nivel}</small><br>
                    <span>${item.descripcion}</span>
                </div>
                <button class="btn-eliminar" data-id="${docSnap.id}">❌</button>
            </div>
        `;
        lista.appendChild(li);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            if (!confirm("¿Eliminar registro?")) return;

            await deleteDoc(doc(window.db, "items", id));

            showNativeNotification("Registro eliminado", {
                body: "El elemento fue eliminado correctamente.",
                icon: "./img/favicon_192.png"
            });
        });
    });
});


// ------------------------------------------------------------
// 🟡 CREAR DOCUMENTO
// ------------------------------------------------------------
window.crear = async () => {
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

    // Borrar campos
    document.getElementById("numero").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("nivel").value = "";
    document.getElementById("descripcion").value = "";

    showNativeNotification("Registro agregado ✔", {
        body: `${nombre} fue agregado correctamente.`,
        icon: "./img/favicon_192.png"
    });
};


// ------------------------------------------------------------
// 🟠 BOTÓN AGREGAR
// ------------------------------------------------------------
document.getElementById("btnAgregar").addEventListener("click", window.crear);


// ------------------------------------------------------------
// 🔵 SMOOTH SCROLL OPTIMIZADO (PASSIVE)
// ------------------------------------------------------------
$(document).ready(() => {
    $("#menu a").on("click", function (e) {
        e.preventDefault();
        const destino = $(this).attr("href");

        window.scrollTo({
            top: $(destino).offset().top,
            behavior: "smooth"
        });
    });
});
