// ---------- FIRESTORE (CRUD) ----------
import { 
  collection, addDoc, deleteDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ---------- MESSAGING (NOTIFICACIONES) ----------
import { 
  getToken, onMessage 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging.js";

// Asegurarse que Firebase está inicializado
if (typeof window.db === "undefined" || typeof window.messaging === "undefined") {
  console.error("Firebase no está inicializado. Revisa index.html");
}

// referencia a Firestore
const itemsRef = collection(window.db, "items");

// ---------- CRUD: Escuchar cambios en tiempo real ----------
onSnapshot(itemsRef, (snapshot) => {
  const lista = document.getElementById("lista");
  if (!lista) return;
  lista.innerHTML = "";

  snapshot.forEach(docu => {
    const item = docu.data();

    const numero = item.numero ?? "";
    const nombre = item.nombre ?? "";
    const categoria = item.categoria ?? "";
    const nivel = item.nivel ?? "";
    const descripcion = item.descripcion ?? "";

    const li = document.createElement("li");
    li.style = "font-size:18px; margin:6px 0; list-style:none;";
    li.innerHTML = `
      <div style="display:flex; gap:12px; align-items:center; justify-content:space-between; width:100%;">
        <div>
          <strong>${numero}</strong> - ${nombre} <br>
          <small>${categoria} | Nivel: ${nivel}</small><br>
          <span>${descripcion}</span>
        </div>
        <div>
          <button data-id="${docu.id}" class="btn-eliminar">❌</button>
        </div>
      </div>
    `;
    lista.appendChild(li);
  });

  // botones de eliminar
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      if (!confirm("Eliminar registro?")) return;
      try {
        await deleteDoc(doc(window.db, "items", id));
      } catch (err) {
        console.error("Error eliminando:", err);
        alert("Error al eliminar. Revisa consola.");
      }
    });
  });
});

// ---------- CRUD: función crear ----------
window.crear = async function () {
  const numero = document.getElementById("numero").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const nivel = document.getElementById("nivel").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  if (!numero || !nombre || !categoria || !nivel || !descripcion) {
    alert("Todos los campos son obligatorios");
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

    document.getElementById("numero").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("nivel").value = "";
    document.getElementById("descripcion").value = "";
  } catch (err) {
    console.error("Error agregando:", err);
    alert("Error al agregar. Revisa la consola.");
  }
};

// botón agregar
const btn = document.getElementById("btnAgregar");
if (btn) {
  btn.addEventListener("click", () => window.crear());
}

// ---------- NOTIFICACIONES PUSH ----------

async function solicitarPermiso() {
  console.log("Solicitando permiso para notificaciones...");

  const permiso = await Notification.requestPermission();
  if (permiso !== "granted") {
      alert("No se otorgó permiso para notificaciones.");
      return;
  }

  const token = await getToken(window.messaging, {
      vapidKey: "BPdlJHTy6fXvmE7nm0j-5l9oEYOz6LyHmLkCkqM_3woXLozwTeVRsYoVezV5CJ6baYkWzmp1EYB3VuSOMqgkpmg"
  });

  console.log("TOKEN FCM:", token);
  alert("Token generado (revísalo en consola)");

  // Para guardar el token en Firestore descomenta:
  // await addDoc(collection(window.db, "tokens"), { token });
}

// pedir permiso al cargar
solicitarPermiso();

// cuando la app está abierta y llega un mensaje
onMessage(window.messaging, (payload) => {
  console.log("Notificación en foreground:", payload);

  new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: "./img/favicon_192.png"
  });
});

// ---------- SMOOTH SCROLL ----------
$(document).ready(function(){
  $("#menu a").click(function(e){
      e.preventDefault();
      $("html,body").animate({
          scrollTop: $($(this).attr('href')).offset().top
      });
      return false;
  });
});
