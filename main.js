// ----------------------------------------------------
// FIRESTORE IMPORTS
// ----------------------------------------------------
import { 
    collection, addDoc, deleteDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ----------------------------------------------------
// CONFIGURACIÓN FIRESTORE
// ----------------------------------------------------
if (!window.db) {
    console.error("Firestore no está inicializado. Revisa index.html");
}

// referencia a la colección
const itemsRef = collection(window.db, "items");


// ----------------------------------------------------
// 🔔 FUNCIÓN NATIVA PARA MOSTRAR NOTIFICACIONES
// ----------------------------------------------------
const showNativeNotification = (title, options) => {

    if (!("Notification" in window)) {
        console.warn("Este navegador no soporta notificaciones.");
        return;
    }

    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, options);
            }
        });
    } 
    else if (Notification.permission === "granted") {
        new Notification(title, options);
    }
    // Si es "denied", no hacemos nada
};


// ----------------------------------------------------
// CRUD: ESCUCHAR CAMBIOS EN TIEMPO REAL
// ----------------------------------------------------
onSnapshot(itemsRef, (snapshot) => {
    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";

    snapshot.forEach(docu => {
        const item = docu.data();

        const li = document.createElement("li");
        li.style = "font-size:18px; margin:6px 0; list-style:none;";
        li.innerHTML = `
            <div style="display:flex; gap:12px; align-items:center; justify-content:space-between; width:100%;">
                <div>
                    <strong>${item.numero}</strong> - ${item.nombre} <br>
                    <small>${item.categoria} | Nivel: ${item.nivel}</small><br>
                    <span>${item.descripcion}</span>
                </div>
                <div>
                    <button data-id="${docu.id}" class="btn-eliminar">❌</button>
                </div>
            </div>
        `;
        lista.appendChild(li);
    });

    // EVENTO DE ELIMINAR
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.target.getAttribute("data-id");
            if (!confirm("¿Eliminar registro?")) return;

            try {
                await deleteDoc(doc(window.db, "items", id));

                // 🔔 Notificación nativa
                showNativeNotification("Registro eliminado", {
                    body: "El elemento fue borrado correctamente.",
                    icon: "./img/favicon_192.png"
                });

            } catch (err) {
                console.error("Error eliminando:", err);
                alert("Error al eliminar.");
            }
        };
    });
});


// ----------------------------------------------------
// CRUD: CREAR DOCUMENTO
// ----------------------------------------------------
window.crear = async function () {

    const numeroInput = document.getElementById("numero");
    const nombreInput = document.getElementById("nombre");
    const categoriaInput = document.getElementById("categoria");
    const nivelInput = document.getElementById("nivel");
    const descripcionInput = document.getElementById("descripcion");

    const numero = numeroInput.value.trim();
    const nombre = nombreInput.value.trim();
    const categoria = categoriaInput.value.trim();
    const nivel = nivelInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (!numero || !nombre || !categoria || !nivel || !descripcion) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        await addDoc(itemsRef, {
            numero: Number(numero),
            nombre,
            categoria,
            nivel: Number(nivel),
            descripcion
        });

        // 🔔 Notificación nativa
        showNativeNotification("Registro agregado", {
            body: `${nombre} fue guardado correctamente.`,
            icon: "./img/favicon_192.png"
        });

        // limpiar
        numeroInput.value = "";
        nombreInput.value = "";
        categoriaInput.value = "";
        nivelInput.value = "";
        descripcionInput.value = "";

    } catch (err) {
        console.error("Error agregando:", err);
        alert("No se pudo agregar el registro.");
    }
};


// ----------------------------------------------------
// BOTÓN AGREGAR
// ----------------------------------------------------
const btn = document.getElementById("btnAgregar");
if (btn) {
    btn.onclick = () => window.crear();
}


// ----------------------------------------------------
// SMOOTH SCROLL (LO MANTENEMOS PERO MÁS LIMPIO)
// ----------------------------------------------------
$(document).ready(() => {
    $("#menu a").on("click", function (e) {
        e.preventDefault();

        const destino = $(this).attr("href");
        $("html, body").animate({
            scrollTop: $(destino).offset().top
        }, 500);
    });
});
