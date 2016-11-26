$(document).ready(function () {

    //initialize the map
    var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
              source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([37.41, 8.82]),
            zoom: 4
        })
    });

    //lets me grab the map object through jquery
    $('#map').data('map', map);

    //get the users current location and center the map there
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        var map = $('#map').data('map');
        map.getView().setCenter(ol.proj.transform([crd.longitude, crd.latitude], 'EPSG:4326', 'EPSG:3857'));
        map.getView().setZoom(14);
        console.log('More or less ' + crd.accuracy + ' meters.');
    };

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

});