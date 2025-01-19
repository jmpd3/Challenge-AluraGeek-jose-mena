async function getProductos() {
    const response = await fetch('http://localhost:8080/productos');
    const productos = await response.json();
    const lista = document.querySelector('.prod__lista');

    lista.innerHTML = ''; // Limpiar la lista antes de renderizar
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('prod__item');
        div.id = producto.id;
        div.innerHTML = `
            <img class="prod__item__imagen" src="${producto.url}" alt="${producto.nombre}">
            <h3 class="prod__item__nombre">${reducirNombre(producto.nombre)}</h3>
            <div class="prod__item__info">
                <p class="prod__item__precio"><strong>$${producto.precio}</strong></p>
                <img class="prod__item__eliminar" src="assets/eliminar.png" onclick="eliminarProducto(${producto.id})">
                
            </div>
        `;
        lista.appendChild(div);
    });
    if (productos.length === 0) {
        const mensaje = document.createElement('div');
        mensaje.classList.add('prod__mensaje');
        mensaje.textContent = 'No hay productos disponibles.';
        lista.appendChild(mensaje);
    }
}

// Crear producto
async function crearProducto(producto) {
    const response = await fetch('http://localhost:8080/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    });
    const responseactualizar = await fetch('http://localhost:8080/lastId', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{"id":'+(producto.id+1)+'}'
    }); 
    if (response.ok) {
        alert('Producto creado exitosamente.');
        getProductos(); // Actualizar la lista
    } else {
        alert('Error al crear producto.');
    }
}

async function eliminarProducto(id) {

    const response = await fetch(`http://localhost:8080/productos/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        alert('Producto eliminado exitosamente.');
        getProductos(); // Actualizar la lista
    } else {
        alert('Error al eliminar producto.');
    }
}

// Actualizar producto
async function actualizarProducto(id, productoActualizado) {
    const response = await fetch(`http://localhost:8080/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado)
    });
    if (response.ok) {
        alert('Producto actualizado exitosamente.');
        getProductos(); // Actualizar la lista
    } else {
        alert('Error al actualizar producto.');
    }
}


// Reducir nombre (ya implementado)
function reducirNombre(nombre) {
    return nombre.length > 22 ? nombre.slice(0, 19) + '...' : nombre;
}

// Inicializar lista de productos
getProductos();

function limpiarForm(event)
{
event.preventDefault();
document.querySelector(".agregar__producto__nombre").value = "";
document.querySelector(".agregar__producto__precio").value = "";
document.querySelector(".agregar__producto__imagen").value = "";
document.querySelector('.agregar__producto__nombre').classList.remove('error');
document.querySelector('.agregar__producto__precio').classList.remove('error'); 
document.querySelector('.agregar__producto__imagen').classList.remove('error');

}

function validarFormulario(event) {
    event.preventDefault();
    const nombre = document.querySelector('.agregar__producto__nombre').value.trim();
    
    const precio = document.querySelector('.agregar__producto__precio').value.trim();
    
    const imagen = document.querySelector('.agregar__producto__imagen').value.trim();
      
    let conteo_error = 0;
    let mensaje_error = ''; 

    // Validar nombre
    if (nombre === '') {
        mensaje_error += 'El nombre del producto es obligatorio. \n';
        conteo_error++;
        document.querySelector('.agregar__producto__nombre').classList.add('error');
    } else {
        document.querySelector('.agregar__producto__nombre').classList.remove('error');
    }

    // Validar precio
    if (precio === '' || isNaN(precio) || parseFloat(precio) < 0) {
        mensaje_error += 'El precio del producto es obligatorio y debe ser un número positivo. \n';
        conteo_error++;
        document.querySelector('.agregar__producto__precio').classList.add('error');
    } else {
        document.querySelector('.agregar__producto__precio').classList.remove('error');
    }

    // Validar imagen
    if (imagen === '') {
        mensaje_error += 'La URL de la imagen del producto es obligatoria. \n';
        conteo_error++;
        document.querySelector('.agregar__producto__imagen').classList.add('error');
    } else {
        document.querySelector('.agregar__producto__imagen').classList.remove('error');
    }

    // Verificar errores
    if (conteo_error === 0) {
        return true;
    } else {
        mensaje_error = 'Han ocurrido los siguientes errores: \n' + mensaje_error;
        console.log(mensaje_error);
        alert(mensaje_error);
        return false;
    }
}

async function agregarProducto(event) {
    event.preventDefault();
    const response = await fetch('http://localhost:8080/lastId', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    
    const recogerId = await  response.json();
    const id = recogerId.id;
    const nombre = document.querySelector('.agregar__producto__nombre').value.trim();
    const precio = document.querySelector('.agregar__producto__precio').value.trim();
    const imagen = document.querySelector('.agregar__producto__imagen').value.trim();
    const producto = { id, nombre, precio, url: imagen };
    console.log(producto);
    if (validarFormulario(event)) {
        crearProducto(producto);
        limpiarForm(event);
    }
}

