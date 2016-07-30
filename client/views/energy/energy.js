import c3 from 'c3';
import _ from 'underscore';
require("/node_modules/d3/build/d3.min.js");
require("/node_modules/c3/c3.css");
var supply = require("/public/generation-series.json");
var consumption = require("/public/consumption-series.json");

Session.set("energyState", "ENERGY");
Session.set("energyChart", "SUPPLY");


Template.energy.events({

	"click .section-trigger": function(e) {
		Session.set("energyState", e.target.dataset.section);
	},

	"click .graph-switch button": function(e){
		Session.set("energyChart", e.target.dataset.chart);
	},

	"change #energyChartSwitch": function(e){
		var chart = Session.get("energyChart");
		var target = chart == "USAGE" ? "SUPPLY" : "USAGE";
		Session.set("energyChart", target);
	}
});

Template.energy.helpers({

	active: function(section){
		return Session.equals("energyState", section);
	},

	activeChart: function(chart){
		return Session.equals("energyChart", chart);
	}
});

Template.energy.onRendered(function(){
	Energy.initGraphs();
});

Energy = {

	initGraphs: function(){
		this.createSupplyChart();
		this.createUsageSeries();
	},

	createSupplyChart: function(){

		var keys = _.keys(supply[0].data);
		var years =[];
		_.each(keys, function(key){
			years.push(parseInt(key.split('-')[0]));
		});

		var columns = [
			['x'].concat(years)
		];

		_.each(supply, function(c){
			columns.push( [c.name].concat(_.values(c.data)) );
		});

		var chart = c3.generate({
			bindto: '#supply-chart',
			data: {
				x: 'x',
				columns: columns
			},
			zoom: {
				enabled: true
			}
		});
	},

	createUsageSeries: function(){

		var keys = _.keys(consumption[0].data);
		var years =[];
		_.each(keys, function(key){
			years.push(parseInt(key.split('-')[0]));
		});

		var columns = [
			['x'].concat(years)
		];

		_.each(consumption, function(c){
			columns.push( [c.name].concat(_.values(c.data)) );
		});

		var chart = c3.generate({
			bindto: '#usage-chart',
			data: {
				x: 'x',
				columns: columns
			},
			zoom: {
				enabled: true
			}
		});

	}

};