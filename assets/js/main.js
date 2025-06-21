// Espera a que todo el contenido del DOM (la página HTML) esté completamente cargado y parseado.
document.addEventListener('DOMContentLoaded', function() {
    // Declaración de una variable 'cart' para almacenar los productos del carrito.
    // Intenta obtener el carrito guardado en localStorage. Si no existe, inicializa como un array vacío.
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para actualizar la visualización del carrito (el contador en la navbar).
    function updateCartDisplay() {
        // Selecciona el elemento del DOM que muestra el contador del carrito.
        const cartCountElement = document.getElementById('cart-count');
        // Calcula el número total de artículos sumando las cantidades de cada producto en el carrito.
        // reduce() ejecuta una función reductora sobre cada elemento del array, resultando en un único valor.
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Si el elemento del contador existe en la página...
        if (cartCountElement) {
            // ...actualiza su texto con el número total de artículos.
            cartCountElement.innerText = totalItems;
        }
        
        // Llama a la función para renderizar los ítems en la página del carrito, si estamos en ella.
        renderCartItems();
    }

    // Función para guardar el estado actual del carrito en el localStorage del navegador.
    function saveCart() {
        // Convierte el objeto 'cart' (array de JavaScript) a una cadena de texto en formato JSON.
        // localStorage solo puede almacenar cadenas de texto.
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Función para agregar un producto al carrito.
    // Se ejecuta cuando un usuario hace clic en un botón "Agregar al carrito".
    function addToCart(productId, productName, productPrice, productImage) {
        // Busca si el producto ya existe en el carrito usando su ID.
        const existingItem = cart.find(item => item.id === productId);

        // Si el producto ya existe...
        if (existingItem) {
            // ...incrementa su cantidad en 1.
            existingItem.quantity++;
        } else {
            // Si es un producto nuevo, lo agrega al array del carrito.
            cart.push({
                id: productId, // ID único del producto.
                name: productName, // Nombre del producto.
                price: productPrice, // Precio del producto.
                image: productImage, // URL de la imagen del producto.
                quantity: 1 // Cantidad inicial es 1.
            });
        }
        // Guarda los cambios en localStorage.
        saveCart();
        // Actualiza la visualización del carrito.
        updateCartDisplay();
        // Muestra una alerta simple para notificar al usuario.
        alert(productName + ' ha sido agregado al carrito.');
    }
    
    // Función para renderizar (dibujar) los ítems en la página del carrito.
    function renderCartItems() {
        // Selecciona el contenedor donde se mostrarán los ítems del carrito y el resumen del total.
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalContainer = document.getElementById('cart-total-container');

        // Si no estamos en la página del carrito, estos contenedores no existirán. Sale de la función.
        if (!cartItemsContainer) {
            return; // Termina la ejecución de la función.
        }

        // Limpia el contenido actual de los contenedores para evitar duplicados al re-renderizar.
        cartItemsContainer.innerHTML = '';
        cartTotalContainer.innerHTML = '';

        // Si el carrito está vacío...
        if (cart.length === 0) {
            // Muestra un mensaje indicando que el carrito está vacío.
            cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
            // Sale de la función.
            return;
        }

        // Variable para calcular el precio total.
        let total = 0;

        // Itera sobre cada ítem en el array 'cart'.
        cart.forEach(item => {
            // Crea un nuevo elemento div para representar la fila del ítem en el carrito.
            const itemElement = document.createElement('div');
            // Añade clases de Bootstrap para estilizarlo como una fila con alineación vertical.
            itemElement.className = 'row mb-4 d-flex justify-content-between align-items-center';

            // Define el HTML interno para este ítem.
            // Incluye la imagen, nombre, precio, campo de cantidad y botón para eliminar.
            // Se usan atributos data-* (ej. data-id) para almacenar información relevante en los elementos HTML.
            itemElement.innerHTML = `
                <div class="col-md-2 col-lg-2 col-xl-2">
                    <img src="${item.image}" class="img-fluid rounded-3 cart-item-image" alt="${item.name}">
                </div>
                <div class="col-md-3 col-lg-3 col-xl-3">
                    <h6 class="text-muted">Agenda</h6>
                    <h6 class="text-black mb-0">${item.name}</h6>
                </div>
                <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                    <input type="number" value="${item.quantity}" min="1" class="form-control form-control-sm quantity-input" data-id="${item.id}" />
                </div>
                <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h6 class="mb-0">$ ${(item.price * item.quantity).toFixed(2)}</h6>
                </div>
                <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <button class="btn btn-link text-danger remove-item-btn" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                </div>
            `;
            
            // Añade el elemento del ítem recién creado al contenedor principal del carrito.
            cartItemsContainer.appendChild(itemElement);
            
            // Suma el subtotal de este ítem al total general.
            total += item.price * item.quantity;
        });

        // Crea y muestra el resumen del total de la compra.
        const totalElement = document.createElement('div');
        totalElement.className = 'card-body';
        totalElement.innerHTML = `
            <div class="d-flex justify-content-between mb-4">
                <h5 class="text-uppercase">Total de la compra</h5>
                <h5>$ ${total.toFixed(2)}</h5>
            </div>
            <button type="button" id="checkout-btn-mp" class="btn btn-primary btn-block btn-lg">Pagar con Mercado Pago</button>
        `;
        // Añade el elemento del total al contenedor correspondiente.
        cartTotalContainer.appendChild(totalElement);
    }
    
    // Función para manejar los clics en la página (delegación de eventos).
    document.body.addEventListener('click', function(event) {
        // Verifica si el elemento clickeado (o uno de sus padres) tiene la clase 'add-to-cart-btn'.
        const addButton = event.target.closest('.add-to-cart-btn');
        if (addButton) {
            // Previene el comportamiento por defecto del enlace/botón.
            event.preventDefault();
            // Extrae los datos del producto de los atributos data-*.
            const productId = addButton.dataset.id;
            const productName = addButton.dataset.name;
            const productPrice = parseFloat(addButton.dataset.price); // Convierte el precio a número.
            const productImage = addButton.dataset.image;
            // Llama a la función para agregar el producto al carrito.
            addToCart(productId, productName, productPrice, productImage);
        }

        // Verifica si el elemento clickeado es un botón para eliminar un ítem.
        const removeButton = event.target.closest('.remove-item-btn');
        if (removeButton) {
            // Previene el comportamiento por defecto.
            event.preventDefault();
            // Obtiene el ID del producto a eliminar.
            const productId = removeButton.dataset.id;
            // Filtra el carrito, creando un nuevo array que excluye el ítem con el ID coincidente.
            cart = cart.filter(item => item.id !== productId);
            // Guarda y actualiza la vista del carrito.
            saveCart();
            updateCartDisplay();
        }
        
        // Verifica si el elemento clickeado es el botón de "Pagar con Mercado Pago".
        const checkoutButton = event.target.closest('#checkout-btn-mp');
        if (checkoutButton) {
            // Llama a la función que manejará el checkout.
            handleMercadoPagoCheckout();
        }
    });

    // Función para manejar los cambios en los inputs de cantidad.
    document.body.addEventListener('change', function(event) {
        // Verifica si el elemento que cambió es un input de cantidad.
        if (event.target.matches('.quantity-input')) {
            // Obtiene el ID del producto y la nueva cantidad.
            const productId = event.target.dataset.id;
            const newQuantity = parseInt(event.target.value); // Convierte la cantidad a número.
            // Busca el ítem en el carrito.
            const itemToUpdate = cart.find(item => item.id === productId);

            // Si el ítem existe y la cantidad es válida (mayor que 0)...
            if (itemToUpdate && newQuantity > 0) {
                // ...actualiza su cantidad.
                itemToUpdate.quantity = newQuantity;
                // Guarda y actualiza la vista.
                saveCart();
                updateCartDisplay();
            }
        }
    });
    
    // ======================================================= //
    // ====== INTEGRACIÓN CON MERCADO PAGO (FRONT-END) ======= //
    // ======================================================= //
    // Esta función PREPARA los datos para enviarlos a tu backend.
    // El backend es quien debe comunicarse de forma segura con Mercado Pago.
    async function handleMercadoPagoCheckout() {
        // 1. Prepara el array de ítems en el formato que Mercado Pago necesita.
        const items = cart.map(item => {
            return {
                title: item.name,
                quantity: item.quantity,
                unit_price: item.price
            };
        });

        // 2. Muestra los datos en la consola para que veas lo que se enviaría.
        console.log("Enviando al backend para crear preferencia de pago:", items);
        alert("Revisa la consola (F12) para ver los datos que se enviarían a tu backend.");

        // --- INICIO DE LA PARTE QUE NECESITA BACKEND ---
        // 3. Realiza una petición a tu propio servidor (backend).
        //    Debes reemplazar 'https://tu-servidor.com/crear-preferencia' con la URL de tu backend.
        try {
            // Usa 'fetch' para enviar los datos de los ítems a tu servidor.
            // La petición es de tipo POST y el cuerpo (body) contiene los ítems en formato JSON.
            const response = await fetch('https://tu-servidor.com/crear-preferencia', {
                method: 'POST', // Método de la petición
                headers: {
                    'Content-Type': 'application/json' // Tipo de contenido que se envía
                },
                body: JSON.stringify({ items: items }) // El cuerpo de la petición con los datos
            });

            // Espera la respuesta de tu servidor y la convierte a JSON.
            // Tu backend debería devolver el ID de la preferencia de pago creada en Mercado Pago.
            const preference = await response.json();
            
            // 4. Redirige al usuario al checkout de Mercado Pago.
            //    Aquí usarías el SDK de Mercado Pago para renderizar el botón de pago
            //    o redirigir al init_point que tu backend te proporcionó.
            //    Ejemplo (necesitarás el SDK de Mercado Pago JS V2):
            //    const mp = new MercadoPago('TU_PUBLIC_KEY');
            //    mp.checkout({ preference: { id: preference.id } });
            
            // Muestra una alerta simulando que el proceso funcionó.
            alert("¡Redirigiendo a Mercado Pago! (Esto es una simulación)");

        } catch (error) {
            // Si hay un error (ej. tu backend no responde), lo muestra en la consola y alerta al usuario.
            console.error("Error al crear la preferencia de pago:", error);
            alert("Hubo un error al conectar con el sistema de pago. Por favor, intenta de nuevo.");
        }
        // --- FIN DE LA PARTE QUE NECESITA BACKEND ---
    }

    // Llama a la función de actualización inicial para que el contador y la página del carrito
    // muestren los datos correctos apenas se carga la página.
    updateCartDisplay();
}); // Fin del evento DOMContentLoaded.