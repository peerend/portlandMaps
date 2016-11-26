$(document).ready(function () {

    //initialize the view
    var view = new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
    })

    //initialize the map

    var attribution = new ol.Attribution({
        html: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
    });

    var overlayGroup = new ol.layer.Group({
        title: 'Overlays',
        layers: []
    });

    var map = new ol.Map({
        target: 'map',
        layers: [
           new ol.layer.Group({
               'title': "Base Maps",
               layers:[
                   new ol.layer.Tile({
                       title: 'ESRI Base Layer',
                       type: 'base',
                       source: new ol.source.XYZ({
                           attributions: [attribution],
                           url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                               'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                       })
                   })
               ]   
           }),
           overlayGroup
        ],
        view: view
    });

    //create a layerswitcher and add it to the map
    var layerSwitcher = new ol.control.LayerSwitcher();
    map.addControl(layerSwitcher);

    //add layer (eventually want this to be database driven
    //need to figure out a good way to store params
    var params = { 'LAYERS': 'ne:ne_10m_admin_1_states_provinces_lines_shp' };
    addLayer('Counties', 'http://demo.opengeo.org/geoserver/wms', params, 'geoserver')

    //add a layer to the group
    function addLayer(title, url, params, serverType){
        overlayGroup.getLayers().push(new ol.layer.Tile({
            title: title,
            source: new ol.source.TileWMS({
                url: url,
                params: params,
                serverType: serverType
            })
        }));
    }

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
    //end map center

    //manipulate url to correctly utilize esri service
    function parseUrl(mapServerLoc, extent) {
        var url = "";
        return url;
    }
});

//           new ol.layer.Tile({
//               source: new ol.source.TileArcGISRest({
//                   url: parseUrl('https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation/MapServer', "")
//               })
//           })
