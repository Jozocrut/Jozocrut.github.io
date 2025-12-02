import { 
  collection, addDoc, deleteDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ⭐ Función de notificación nativa
const showNativeNotification = (title, options) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, options);
            }
        });
    } else if (Notification.permission === "granted") {
        new Notification(title, options);
    }
};

// referencia
const itemsRef = collection(window.db, "items");

// LISTAR en tiempo real
onSnapshot(itemsRef, (snapshot) => {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    snapshot.forEach(docu => {
        const item = docu.data();

        const li = document.createElement("li");
        li.style = "font-size:18px; margin:6px 0; list-style:none;";
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <div>
                    <strong>${item.numero}</strong> - ${item.nombre}<br>
                    <small>${item.categoria} | Nivel: ${item.nivel}</small><br>
                    <span>${item.descripcion}</span>
                </div>

                <button data-id="${docu.id}" class="btn-eliminar">❌</button>
            </div>
        `;
        lista.appendChild(li);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            if (!confirm("¿Eliminar?")) return;
            await deleteDoc(doc(window.db, "items", id));
        });
    });
});

// CREAR
window.crear = async function () {
    const numero = numeroInput.value.trim();
    const nombre = nombreInput.value.trim();
    const categoria = categoriaInput.value.trim();
    const nivel = nivelInput.value.trim();
    const descripcion = descripcionInput.value.trim();

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

    // ⭐ Notificación
    showNativeNotification("Nuevo contenido agregado", {
        body: `Se agregó: ${nombre}`,
        icon: "./img/favicon_192.png"
    });

    numeroInput.value = "";
    nombreInput.value = "";
    categoriaInput.value = "";
    nivelInput.value = "";
    descripcionInput.value = "";
};

// Inputs
const numeroInput = document.getElementById("numero");
const nombreInput = document.getElementById("nombre");
const categoriaInput = document.getElementById("categoria");
const nivelInput = document.getElementById("nivel");
const descripcionInput = document.getElementById("descripcion");

// botón
document.getElementById("btnAgregar").addEventListener("click", () => window.crear());

// pedir permiso
window.addEventListener("click", () => Notification.requestPermission(), { once: true });


// -------------------------------
// SMOOTH SCROLL SIN JQUERY (no warnings)
// -------------------------------
document.querySelectorAll("#menu a").forEach(enlace => {
  enlace.addEventListener("click", (e) => {
    e.preventDefault();
    const destino = document.querySelector(enlace.getAttribute("href"));
    if (!destino) return;

    window.scrollTo({
      top: destino.offsetTop,
      behavior: "smooth"
    });
  }, { passive: true }); // <- ADIÓS WARNING
});

});

