// Clase Tarea
class Tarea {
    constructor(id, descripcion) {
        this.id = id;
        this.descripcion = descripcion;
        this.estado = 'pendiente';
        this.fechaCreacion = new Date().toLocaleString();
    }

    cambiarEstado() {
        this.estado = this.estado === 'pendiente' ? 'completada' : 'pendiente';
    }
}

// Clase GestorTareas
class GestorTareas {
    constructor() {
        this.tareas = [];
    }

    agregarTarea(descripcion) {
        const id = Date.now();
        const nuevaTarea = new Tarea(id, descripcion);
        this.tareas.push(nuevaTarea);
        this.guardarEnLocalStorage();
    }

    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarEnLocalStorage();
    }

    cambiarEstadoTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) tarea.cambiarEstado();
        this.guardarEnLocalStorage();
    }

    guardarEnLocalStorage() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    cargarDesdeLocalStorage() {
        const datos = JSON.parse(localStorage.getItem('tareas')) || [];
        this.tareas = datos.map(t => new Tarea(t.id, t.descripcion));
    }
}

// Instancia
const gestor = new GestorTareas();
gestor.cargarDesdeLocalStorage();

// DOM
const formulario = document.getElementById('formulario');
const listaTareas = document.getElementById('lista-tareas');
const input = document.getElementById('tarea');

// keyup
input.addEventListener('keyup', () => {
    console.log("Usuario escribiendo tarea...");
});

// submit
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value.trim()) {
        gestor.agregarTarea(input.value);
        mostrarTareas();
        input.value = '';
    }
});

// render
function mostrarTareas() {

    listaTareas.innerHTML = '';

    gestor.tareas.forEach(tarea => {

        const li = document.createElement('li');

        // CONTENIDO
        const info = document.createElement('div');

        const span = document.createElement('span');
        span.innerHTML = `
            <strong>${tarea.descripcion}</strong><br>
            <small>${tarea.fechaCreacion}</small>
        `;

        const estado = document.createElement('span');
        estado.textContent = tarea.estado;
        estado.classList.add('estado', tarea.estado);

        info.appendChild(span);
        info.appendChild(estado);

        // ACCIONES
        const acciones = document.createElement('div');

        const btnCambiar = document.createElement('button');
        btnCambiar.textContent = 'Cambiar';
        btnCambiar.addEventListener('click', () => cambiarEstado(tarea.id));

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

        acciones.appendChild(btnCambiar);
        acciones.appendChild(btnEliminar);

        // HOVER
        li.addEventListener('mouseover', () => {
            li.style.backgroundColor = "#f9fafb";
        });

        li.addEventListener('mouseout', () => {
            li.style.backgroundColor = "white";
        });

        li.appendChild(info);
        li.appendChild(acciones);

        listaTareas.appendChild(li);
    });
}

// acciones
function cambiarEstado(id) {
    gestor.cambiarEstadoTarea(id);
    mostrarTareas();
}

function eliminarTarea(id) {
    gestor.eliminarTarea(id);
    mostrarTareas();
}

// asincronía
setTimeout(() => alert('Simulando retardo al agregar una tarea'), 2000);

setInterval(() => {
    console.log('Contador de tareas activo');
}, 5000);

// API
async function obtenerTareasAPI() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        const data = await response.json();
        console.log('Datos API:', data);
    } catch (error) {
        console.error('Error API:', error);
    }
}

obtenerTareasAPI();
mostrarTareas();
