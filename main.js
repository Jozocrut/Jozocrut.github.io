// FIRESTORE
import { 
    collection, addDoc, deleteDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Asegurar que db existe
if (!window.db) {
    console.error("Firestore no inicializado.");
}

// Referencia
const itemsRef = collection(window.db, "items");

// -------------------------------------
// NOTIFICACIONES NATIVAS
// -------------------------------------
const showNativeNotification = (title, options = {}) => {
    if (!("Notification" in window)) {
        console.warn("Este navegador no soporta notificaciones.");
        return;
    }

    if (Notification.permission === "granted") {
        new Notification(title, options);
    } else if (Notification.permission === "default") {
        Notification.requestPermission().then((perm) => {
            if (perm === "granted") new Notification(title, options);
        });
    }
};

// -------------------------------------
// LISTAR EN TIEMPO REAL
// -------------------------------------
onSnapshot(itemsRef, (snapshot) => {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    snapshot.forEach(docu => {
        const item = docu.data();

        const li = document.createElement("li");
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${item.numero}</strong> - ${item.nombre}<br>
                    <small>${item.categoria} | Nivel: ${item.nivel}</small><br>
                    <span>${item.descripcion}</span>
                </div>
                <button class="btn-eliminar" data-id="${docu.id}">❌</button>
            </div>
        `;

        lista.appendChild(li);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.target.dataset.id;
            if (confirm("¿Eliminar?")) {
                await deleteDoc(doc(window.db, "items", id));
                showNativeNotification("Registro eliminado", {
                    body: "Se eliminó correctamente"
                });
            }
        };
    });
});

// -------------------------------------
// AGREGAR
// -------------------------------------
window.crear = async () => {
    const numero = document.getElementById("numero").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const nivel = document.getElementById("nivel").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!numero || !nombre || !categoria || !nivel || !descripcion) {
        alert("Todos los campos son obligatorios");
        return;
    }

    await addDoc(itemsRef, {
        numero: Number(numero),
        nombre,
        categoria,
        nivel: Number(nivel),
        descripcion
    });

    showNativeNotification("Registro agregado", {
        body: `${nombre} fue agregado correctamente`,
        icon: "./img/favicon_192.png"
    });

    document.getElementById("numero").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("nivel").value = "";
    document.getElementById("descripcion").value = "";
};

// Botón agregar
document.getElementById("btnAgregar").onclick = window.crear;

// SMOOTH SCROLL
$("#menu a").on("click", function(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top });
});
