document.addEventListener("DOMContentLoaded", function () {
    // Cargar el archivo XML
    fetch("data/datos.xml")
        .then(response => response.text())
        .then(data => {
            // Procesar el XML
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(data, "text/xml");

            // Mostrar la información de los pedidos en la tabla
            mostrarInformacionPedidos(xmlDoc);

            mostrarInformacionClientes(xmlDoc);

            crearFacturaCliente(xmlDoc);

            // Mostrar productos vendidos en el Último Trimestre de 2021
            mostrarProductosUltimoTrimestre2021(xmlDoc);
        })
        .catch(error => console.error('Error al cargar el archivo XML:', error));
});

function mostrarInformacionPedidos(xmlDoc) {
    // Obtener la tabla de pedidos
    let tablaPedidos = document.getElementById("tablaPedidos");

    // Limpiar la tabla antes de agregar nuevos datos
    tablaPedidos.innerHTML = "";

    // Obtener todos los nodos de pedido
    let pedidos = xmlDoc.querySelectorAll('pedido');

    // Crear encabezados de la tabla
    let encabezados = "<tr><th>Número de Pedido</th><th>Fecha de Compra</th><th>Fecha de Entrega</th><th>Total de Factura</th></tr>";
    tablaPedidos.innerHTML += encabezados;

    // Iterar sobre cada pedido y agregarlo a la tabla
    pedidos.forEach(pedido => {
        let numeroPedido = pedido.getAttribute('numero');
        let fechaCompra = pedido.querySelector('fechaCompra').textContent;
        let fechaEntrega = pedido.querySelector('fechaEntrega').textContent;
        let totalFactura = pedido.querySelector('totalFactura').textContent;

        let fila = `<tr><td>${numeroPedido}</td><td>${fechaCompra}</td><td>${fechaEntrega}</td><td>${totalFactura}</td></tr>`;
        tablaPedidos.innerHTML += fila;
    });
}

function mostrarInformacionClientes(xmlDoc) {
    // Obtener la tabla de clientes
    let tablaClientes = document.getElementById("tablaClientes");

    // Limpiar la tabla antes de agregar nuevos datos
    tablaClientes.innerHTML = "";

    // Obtener todos los nodos de cliente
    let clientes = xmlDoc.querySelectorAll('cliente');

    // Crear encabezados de la tabla
    let encabezados = "<tr><th>Nombre</th><th>Apellidos</th><th>Teléfono</th><th>Dirección</th><th>Correo Electrónico</th><th>Fecha de Inclusión</th></tr>";
    tablaClientes.innerHTML += encabezados;

    // Iterar sobre cada cliente y agregarlo a la tabla
    clientes.forEach(cliente => {
        let nombre = cliente.querySelector('nombre').textContent;
        let apellidos = cliente.querySelector('apellidos').textContent;
        let telefono = cliente.querySelector('telefono').textContent;
        let direccion = obtenerDireccion(cliente.querySelector('direccion'));
        let correo = cliente.querySelector('correo').textContent;
        let fechaInclusion = cliente.querySelector('fechaInclusion').textContent;

        let fila = `<tr><td>${nombre}</td><td>${apellidos}</td><td>${telefono}</td><td>${direccion}</td><td>${correo}</td><td>${fechaInclusion}</td></tr>`;
        tablaClientes.innerHTML += fila;
    });
}

function obtenerDireccion(direccionNode) {
    // Función para obtener la dirección formateada
    let calle = direccionNode.querySelector('calle').textContent;
    let ciudad = direccionNode.querySelector('ciudad').textContent;
    let codigoPostal = direccionNode.querySelector('codigoPostal').textContent;
    let provincia = direccionNode.querySelector('provincia').textContent;

    return `${calle}, ${ciudad}, ${codigoPostal}, ${provincia}`;
}

function crearFacturaCliente(xmlDoc) {
    // Obtener el div de la factura del cliente
    let facturaClienteDiv = document.getElementById("facturaCliente");

    // Limpiar el contenido del div antes de agregar nuevas facturas
    facturaClienteDiv.innerHTML = "";

    // Obtener todos los pedidos del primer trimestre
    let pedidosPrimerTrimestre = xmlDoc.querySelectorAll('año[año="2021"] trimestre[trimestre="1"] pedido');

    // Buscar el pedido número 1
    let pedidoNum1 = Array.from(pedidosPrimerTrimestre).find(pedido => pedido.getAttribute('numero') === "2");

    // Si no se encontró el pedido número 1, mostrar un mensaje y salir de la función
    if (!pedidoNum1) {
        console.log('No se encontró el pedido número 1 del primer trimestre.');
        return;
    }

    // Obtener la información del cliente
    let cliente = pedidoNum1.querySelector('cliente');
    let nombreCliente = cliente.querySelector('nombre').textContent;
    let apellidosCliente = cliente.querySelector('apellidos').textContent;
    let direccionCliente = obtenerDireccion(cliente.querySelector('direccion'));
    let correoCliente = cliente.querySelector('correo').textContent;

    // Obtener la información del pedido
    let numeroPedido = pedidoNum1.getAttribute('numero');
    let fechaCompra = pedidoNum1.querySelector('fechaCompra').textContent;
    let fechaEntrega = pedidoNum1.querySelector('fechaEntrega').textContent;
    let totalFactura = pedidoNum1.querySelector('totalFactura').textContent;

    // Crear la factura
    let facturaHTML = `
        <div class="factura">
            <p>Factura para: ${nombreCliente} ${apellidosCliente}</p>
            <p>Dirección de envío: ${direccionCliente}</p>
            <p>Correo Electrónico: ${correoCliente}</p>
            <hr>
            <p>Número de Pedido: ${numeroPedido}</p>
            <p>Fecha de Compra: ${fechaCompra}</p>
            <p>Fecha de Entrega: ${fechaEntrega}</p>
            <p>Total de Factura: ${totalFactura}</p>
        </div>
    `;

    // Agregar la factura al div
    facturaClienteDiv.innerHTML += facturaHTML;
}



function mostrarProductosUltimoTrimestre2021(xmlDoc) {
    // Obtener la tabla de productos vendidos en el último trimestre de 2021
    let tablaProductosUltimoTrimestre2021 = document.getElementById("productosUltimoTrimestre2021");

    // Limpiar la tabla antes de agregar nuevos datos
    tablaProductosUltimoTrimestre2021.innerHTML = "";

    // Obtener todos los nodos de detalle de pedido
    let detallesPedido = xmlDoc.querySelectorAll('detallePedido');

    // Crear encabezados de la tabla
    let encabezados = "<tr><th>Nombre del Producto</th><th>Referencia</th><th>Precio</th><th>Unidades</th></tr>";
    tablaProductosUltimoTrimestre2021.innerHTML += encabezados;

    // Iterar sobre cada detalle de pedido y agregar los productos del último trimestre de 2021 a la tabla
    detallesPedido.forEach(detallePedido => {
        let fechaCompra = detallePedido.querySelector('fechaCompra').textContent;

        // Filtrar solo los detalles de pedido del último trimestre de 2021
        if (esUltimoTrimestre2021(fechaCompra)) {
            let producto = detallePedido.querySelector('producto');
            let nombreProducto = producto.querySelector('nombre').textContent;
            let referenciaProducto = producto.querySelector('referencia').textContent;
            let precioProducto = producto.querySelector('precio').textContent;
            let unidadesProducto = producto.querySelector('unidades').textContent;

            let fila = `<tr><td>${nombreProducto}</td><td>${referenciaProducto}</td><td>${precioProducto}</td><td>${unidadesProducto}</td></tr>`;
            tablaProductosUltimoTrimestre2021.innerHTML += fila;
        }
    });
}

function esUltimoTrimestre2021(fecha) {
    // Convertir la fecha en un objeto Date
    let fechaDate = new Date(fecha);

    // Obtener el mes de la fecha (los meses van de 0 a 11 en JavaScript)
    let mes = fechaDate.getMonth();

    // Verificar si el mes está en el último trimestre del año (octubre, noviembre o diciembre)
    return mes >= 9 && mes <= 11; // Octubre es el mes 9, noviembre es el mes 10 y diciembre es el mes 11
}
