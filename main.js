// main.js (módulo)

// ---------- IMPORTS FIRESTORE ----------
import { collection, addDoc, deleteDoc, doc, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ---------- VERIFICACIÓN DE FIREBASE ----------
if (typeof window.db === "undefined") {
  console.warn("Firestore no inicializado (window.db undefined). El CRUD no funcionará hasta inicializar Firebase en index.html.");
}

// ---------- UTIL: mostrar notificación nativa ----------
const showNativeNotification = (title, options = {}) => {
  if (!("Notification" in window)) {
    console.warn("Este navegador no soporta notificaciones de escritorio.");
    return;
  }

  if (Notification.permission === "default") {
    // No pedir permiso desde aquí (la UI tiene un botón). Solo por seguridad dejamos esta llamada como fallback.
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, options);
      }
    }).catch(err => console.error("Error pidiendo permiso notificaciones:", err));
    return;
  }

  if (Notification.permission === "granted") {
    try {
      new Notification(title, options);
    } catch (err) {
      console.error("No se pudo crear notificación:", err);
    }
  }
  // si 'denied' -> no hacemos nada
};


// ---------- CRUD: referencia (sólo si db existe) ----------
let itemsRef = null;
if (typeof window.db !== "undefined") {
  itemsRef = collection(window.db, "items");
}


// ---------- ESCUCHAR CAMBIOS EN TIEMPO REAL (si itemsRef existe) ----------
if (itemsRef) {
  onSnapshot(itemsRef, (snapshot) => {
    const lista = document.getElementById("lista");
    if (!lista) return;
    lista.innerHTML = "";

    snapshot.forEach(docu => {
      const item = docu.data() ?? {};

      const li = document.createElement("li");
      li.style = "font-size:18px; margin:6px 0; list-style:none;";
      li.innerHTML = `
        <div style="display:flex; gap:12px; align-items:center; justify-content:space-between; width:100%;">
          <div>
            <strong>${item.numero ?? ""}</strong> - ${item.nombre ?? ""} <br>
            <small>${item.categoria ?? ""} | Nivel: ${item.nivel ?? ""}</small><br>
            <span>${item.descripcion ?? ""}</span>
          </div>
          <div>
            <button data-id="${docu.id}" class="btn-eliminar">❌</button>
          </div>
        </div>
      `;
      lista.appendChild(li);
    });

    // manejar eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        if (!confirm("Eliminar registro?")) return;
        try {
          await deleteDoc(doc(window.db, "items", id));
          showNativeNotification("Registro eliminado", { body: "Elemento eliminado correctamente." });
        } catch (err) {
          console.error("Error eliminando:", err);
          alert("Error al eliminar. Revisa consola.");
        }
      }, { passive: true }); // listener no bloqueante (mejora warnings)
    });
  }, (err) => {
    console.error("Error onSnapshot itemsRef:", err);
  });
}


// ---------- FUNCIÓN CREAR (expuesta globalmente) ----------
window.crear = async function () {
  // leer campos del DOM al momento de ejecutar (evita reference errors)
  const numeroInput = document.getElementById("numero");
  const nombreInput = document.getElementById("nombre");
  const categoriaInput = document.getElementById("categoria");
  const nivelInput = document.getElementById("nivel");
  const descripcionInput = document.getElementById("descripcion");

  if (!numeroInput || !nombreInput || !categoriaInput || !nivelInput || !descripcionInput) {
    alert("No se encontraron los campos del formulario.");
    return;
  }

  const numero = numeroInput.value.trim();
  const nombre = nombreInput.value.trim();
  const categoria = categoriaInput.value.trim();
  const nivel = nivelInput.value.trim();
  const descripcion = descripcionInput.value.trim();

  if (!numero || !nombre || !categoria || !nivel || !descripcion) {
    alert("Todos los campos son obligatorios");
    return;
  }

  if (!itemsRef) {
    alert("Firestore no inicializado. No se puede agregar el registro.");
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

    // mostrar notificación nativa (si está permitido)
    showNativeNotification("Registro agregado", {
      body: `${nombre} fue agregado correctamente.`,
      icon: "./img/favicon_192.png"
    });

    // limpiar campos
    numeroInput.value = "";
    nombreInput.value = "";
    categoriaInput.value = "";
    nivelInput.value = "";
    descripcionInput.value = "";

  } catch (err) {
    console.error("Error agregando:", err);
    alert("Error al agregar. Revisa la consola.");
  }
};


// ---------- BOTÓN AGREGAR: vincular después de declarar window.crear ----------
const btn = document.getElementById("btnAgregar");
if (btn) {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.crear();
  }, { passive: true });
}


// ---------- NOTIFICACIONES: pedir permiso mediante botón visible ----------
const btnNoti = document.getElementById("btnNotificaciones");
async function solicitarPermiso() {
  if (!("Notification" in window)) {
    alert("Tu navegador no soporta notificaciones de escritorio.");
    return;
  }

  try {
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      showNativeNotification("Notificaciones activadas", {
        body: "Recibirás notificaciones nativas de la aplicación.",
        icon: "./img/favicon_192.png"
      });
      btnNoti.style.display = "none"; // opcional: ocultar el botón tras activación
    } else if (permiso === "denied") {
      alert("Has bloqueado las notificaciones. Puedes cambiarlas en la configuración del sitio.");
    } else {
      // 'default'
      alert("Permiso no concedido. Intenta de nuevo si deseas activarlas.");
    }
  } catch (err) {
    console.error("Error solicitando permiso notificaciones:", err);
    alert("Error al solicitar permiso. Revisa consola.");
  }
}

if (btnNoti) {
  btnNoti.addEventListener("click",
    solicitarPermiso());
}


// ---------- SMOOTH SCROLL (jQuery) ----------
$(document).ready(function(){
  $("#menu a").click(function(e){
      e.preventDefault();
      $("html,body").animate({
          scrollTop: $($(this).attr('href')).offset().top
      }, 600);
      return false;
  });
});

