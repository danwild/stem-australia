import moment from 'moment';
import leaflet from 'leaflet';
import c3 from 'c3';

//var points = require("/public/raw-clusters.json");
var points = require("/public/stations.json");

L.Icon.Default.imagePath = '/leaflet';
require("/node_modules/leaflet.markercluster/dist/leaflet.markercluster.js");
require("/node_modules/leaflet.markercluster/dist/MarkerCluster.css");
require("/node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css");

require("/node_modules/d3/build/d3.min.js");
require("/node_modules/c3/c3.min.js");
require("/node_modules/c3/c3.css");

Session.set("climateState", "CLIMATE");
Session.set("climateChartPanel", false);

Climate = {

	markers: null,
	map: null,
	clicked: false,

	initMap: function(){

		L.Icon.Default.imagePath = '/leaflet';
		var Esri_DarkGreyCanvas = L.tileLayer(
			"http://{s}.sm.mapstack.stamen.com/" +
			"(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
			"{z}/{x}/{y}.png",
			{
				attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
				'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
			}
		);

		this.map = L.map('climate-map', {
			layers: [ Esri_DarkGreyCanvas ]
		}).setView([-26, 137], 5);
		this.addClusters();

	},

	addClusters: function(){

		this.markers = L.markerClusterGroup({
			zoomToBoundsOnClick: false,
			spiderfyOnMaxZoom: false
		});

		_.each(points, function(point){

			var marker = L.marker(new L.LatLng(
				point.station.observedBy.currentSite.lat,
				point.station.observedBy.currentSite.long
			), { pointData: point });
			Climate.markers.addLayer(marker);

		});

		this.map.addLayer(this.markers);
		this.addClickHandler();
	},

	addClickHandler: function(){

		Climate.markers.on('clusterclick', function (a) {

			// a.layer is actually a cluster
			var clusterMarkers = a.layer.getAllChildMarkers();
			console.log('cluster ' + clusterMarkers.length);

			var data = _.map(clusterMarkers, function(m){
				return {
					year: parseInt(m.options.pointData.year),
					min: m.options.pointData.min,
					max: m.options.pointData.max
				}
			});

			data.sort(function(a, b){ return a.year - b.year });

			Climate.createChart({
				data: data,
				cluster: clusterMarkers.length
			});

			if(Climate.map.getZoom() < 10){
				Helpers.info({
					message: "Zoom in to view more cohesive clusters",
					options: { position: 'top-left' }
				});
				Climate.clicked = true;
			}
		});
	},

	createChart: function(data){

		console.log(data);

		var timeCol = ['x'].concat(_.pluck(data.data, 'year'));
		var minCol = ['Mean Min Temp (C)'].concat(_.pluck(data.data, 'min'));
		var maxCol = ['Mean Max Temp (C)'].concat( _.pluck(data.data, 'max'));

		console.log(timeCol);
		console.log(minCol);
		console.log(maxCol);

		var chart = c3.generate({
			bindto: '#climate-chart',
			data: {
				x: 'x',
				columns: [
					timeCol,
					minCol,
					maxCol
				]
			},
			zoom: {
				enabled: false
			}
		});

		Session.set("climateChartPanel", true);
	}

};

Template.climate.events({
	"click .section-trigger": function(e){
		Session.set("climateState", e.target.dataset.section);
	},

	"click .close-climate-chart": function(){
		Session.set("climateChartPanel", false);
	}
});

Template.climate.helpers({
	active: function(section){
		return Session.equals("climateState", section);
	},

	panelActive: function(){
		return Session.get("climateChartPanel")
	}
});

Template.climate.onRendered(function(){

	Climate.initMap();

});