// ---------- FIRESTORE ----------
import { 
  collection, addDoc, deleteDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ---------- MESSAGING ----------
import { 
  getToken, onMessage 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging.js";

// Verificar Firebase
if (!window.db || !window.messaging) {
  console.error("Firebase no está inicializado");
}


// ------------------------------------------------
// 🔔 FUNCIÓN PARA NOTIFICACIONES NATIVAS
// ------------------------------------------------
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


// Colección
const itemsRef = collection(window.db, "items");


// ------------------------------------------------
// 🔥 CRUD: LISTAR EN TIEMPO REAL
// ------------------------------------------------
onSnapshot(itemsRef, (snapshot) => {
  const lista = document.getElementById("lista");
  if (!lista) return;
  lista.innerHTML = "";

  snapshot.forEach(docu => {
    const item = docu.data();

    const li = document.createElement("li");
    li.style = "font-size:18px; margin:6px 0;";
    li.innerHTML = `
      <strong>${item.numero}</strong> - ${item.nombre}<br>
      <small>${item.categoria} | Nivel: ${item.nivel}</small><br>
      ${item.descripcion}
      <button data-id="${docu.id}" class="btn-eliminar">❌</button>
    `;
    lista.appendChild(li);
  });

  // eliminar
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("Eliminar registro?")) return;
      await deleteDoc(doc(window.db, "items", btn.dataset.id));
    };
  });
});


// ------------------------------------------------
// 🔥 CRUD: CREAR
// ------------------------------------------------
window.crear = async () => {
  const numero = numero.value.trim();
  const nombre = nombre.value.trim();
  const categoria = categoria.value.trim();
  const nivel = nivel.value.trim();
  const descripcion = descripcion.value.trim();

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

  showNativeNotification("Registro creado", {
    body: `${nombre} agregado`,
    icon: "./img/favicon_192.png"
  });

  numero.value = nombre.value = categoria.value = nivel.value = descripcion.value = "";
};


// botón agregar
btnAgregar.onclick = () => window.crear();


// ------------------------------------------------
// 🔥 NOTIFICACIONES FCM
// ------------------------------------------------
async function solicitarPermiso() {
  const permiso = await Notification.requestPermission();
  if (permiso !== "granted") {
      alert("Debes permitir notificaciones");
      return;
  }

  const token = await getToken(window.messaging, {
    vapidKey: "BPdlJHTy6fXvmE7nm0j-5l9oEYOz6LyHmLkCkqM_3woXLozwTeVRsYoVezV5CJ6baYkWzmp1EYB3VuSOMqgkpmg"
  });

  console.log("TOKEN FCM:", token);

  showNativeNotification("Permisos activados", {
    body: "Tu dispositivo ahora recibe notificaciones",
    icon: "./img/favicon_192.png"
  });
}

// activar solo si el usuario da clic real
document.addEventListener("click", solicitarPermiso, { once: true });


// Mensajes foreground
onMessage(window.messaging, (payload) => {
  showNativeNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "./img/favicon_192.png"
  });
});


// ------------------------------------------------
// SMOOTH SCROLL
// ------------------------------------------------
$(document).ready(function(){
  $("#menu a").click(function(e){
      e.preventDefault();
      $("html,body").animate({
          scrollTop: $($(this).attr('href')).offset().top
      });
  });
});
