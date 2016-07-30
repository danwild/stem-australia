Session.set("resourcesState", "GRAPH");

Template.resources.helpers({

	active: function(section){
		return Session.equals("resourcesState", section);
	},

	births: function(){
		return 0;
	},

	deaths: function(){
		return 0;
	}

});

Template.resources.events({

	"click .section-trigger": function (e) {
		Session.set("resourcesState", e.target.dataset.section);
	}

});

Template.resources.onRendered(function(){
	Resources.init();
});

Resources = {

	map: null,

	init: function(){
		this.initMap();
	},

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

		this.map = L.map('resources-map', {
			layers: [ Esri_DarkGreyCanvas ]
		}).setView([-20, 137], 4);

	}
};