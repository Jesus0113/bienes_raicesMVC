(function() {

    const lat = document.querySelector('#lat').value || -34.6036349;
    const lng = document.querySelector('#lng').value || -58.3808653;
    const mapa = L.map('mapa').setView([lat, lng ], 14);

    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //PIN
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    //Detectar el movimiento del Pin

    marker.on('moveend', function(e){

        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        //Obtiene la info de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 14).run(function(error, resultado){

            marker.bindPopup(resultado.address.LongLabel)

            //LLenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })
    })
})()