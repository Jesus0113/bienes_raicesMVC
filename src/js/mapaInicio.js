(function(){

    const lat = -34.6036349;
    const lng = -58.3808653;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 12);
    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = []

    //Filtros

    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios')



    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //FIltrado de categorias y precio
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades();
    })

    const obtenerPropiedades = async (req, res) => {
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()

            mostrarPropiedades(propiedades)
            
        } catch (error) {
            console.log(error);
        }
    }

    const mostrarPropiedades = propiedades => {
        //Limpiiar los markers previos
        markers.clearLayers()
        
        propiedades.forEach(propiedad => {
            //Agregar pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            }).addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
            `)

            markers.addLayer(marker)
        })

    }

    const filtrarPropiedades = () => {

        const resultado = propiedades.filter(propiedad => {

            return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad

        }).filter( propiedad => {
            return filtros.precio ? propiedad.precioId === filtros.precio : propiedad
        })

        mostrarPropiedades(resultado)

    }

    obtenerPropiedades()

})()