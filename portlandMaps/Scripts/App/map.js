$(document).ready(function () {

    //initialize the view
    var view = new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
    })

    //initialize the map
    var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
              source: new ol.source.OSM()
          })
        ],
        view: view
    });

    //lets me grab the map object through jquery
    $('#map').data('map', map);

    //get the users current location and center the map there
    var geolocation = new ol.Geolocation({
        projection: view.getProjection(),
        tracking: true
    });

    //update the map when the position changes
    geolocation.once('change', function (evt) {
        view.setCenter(geolocation.getPosition());
    });

    geolocation.on('error', function (error) {
        console.log('ERROR: ' + error.message);
    });

    var accuracyFeature = new ol.Feature();
    accuracyFeature.addEventListener('change', function () {
        window.console.log(geolocation.getPosition());
    });

    var positionFeature = new ol.Feature();
    positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));

    function CenterMap(lat, long) {
        console.log("Lat: " + lat + " Long: " + long);
        map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
    }


    //map.getView().setCenter(ol.proj.fromLonLat([lon, lat]));
});