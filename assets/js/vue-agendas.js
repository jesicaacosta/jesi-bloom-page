// ✅ ARCHIVO: assets/js/vue-agendas.js (NUEVO)
// Este archivo ahora solo se encarga de la lógica de Vue para la página de agendas.

const { createApp } = Vue;

createApp({
    data() {
        return {
            productos: []
        };
    },
    mounted() {
        // Carga los productos desde tu archivo JSON.
        // Asegúrate que la ruta 'assets/data/productos.json' sea correcta.
        fetch('assets/data/productos.json')
            .then(res => res.json())
            .then(data => {
                this.productos = data;
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }
}).mount('#app');