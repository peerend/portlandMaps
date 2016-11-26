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
    var getLocation = function() {
        var geoOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;
            var map = $('#map').data('map');
            map.setCenter(crd);
        }

        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }

        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
    }

    getLocation();
});