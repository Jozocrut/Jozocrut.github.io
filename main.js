// main.js (módulo — importa Firestore desde v12)
import { 
  collection, addDoc, deleteDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Asegurarse que window.db existe
if (typeof window.db === "undefined") {
  console.error("La variable global db no está definida. Revisa que Firebase se inicialice ANTES de main.js");
}

// referencia a la colección "items"
const itemsRef = collection(window.db, "items");

// Escuchar en tiempo real (muestra al instante)
onSnapshot(itemsRef, (snapshot) => {
  const lista = document.getElementById("lista");
  if (!lista) return;
  lista.innerHTML = "";

  snapshot.forEach(docu => {
    const item = docu.data();
    // seguridad: comprueba campos
    const numero = item.numero ?? "";
    const nombre = item.nombre ?? "";
    const categoria = item.categoria ?? "";
    const nivel = item.nivel ?? "";
    const descripcion = item.descripcion ?? "";

    // linea con botón eliminar
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

  // attach event listeners a botones eliminar
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

// función crear: expuesta en window para compatibilidad
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

    // limpiar inputs
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

// alternativa: asociar botón por id (no obligatorio)
const btn = document.getElementById("btnAgregar");
if (btn) {
  btn.addEventListener("click", () => window.crear());
}

// Mantener tu smooth scroll original (jQuery)
$(document).ready(function(){
  $("#menu a").click(function(e){
      e.preventDefault();
      $("html,body").animate({
          scrollTop: $($(this).attr('href')).offset().top
      });
      return false;
  });
});
