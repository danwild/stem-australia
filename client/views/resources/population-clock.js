import moment from 'moment';
import d3 from 'd3';
require("/node_modules/d3/build/d3.min.js");

Session.set("populationTotal", 0);
Session.set("birthTotal", 0);
Session.set("deathTotal", 0);
Session.set("populationTime", moment().format("DD/MM/YYYY HH:mm:ss"));

/*

Population clock:
http://www.abs.gov.au/ausstats/abs%40.nsf/94713ad445ff1425ca25682000192af2/1647509ef7e25faaca2568a900154b63?OpenDocument

31 July 2016 at 09:18:09 AM (Canberra Time)

population = 24144643

one birth every 1 minute and 44 seconds, (104s)
one death every 3 minutes and 22 seconds, (202s)
a net gain of one international migration every 2 minutes and 36 seconds (153)

(leading to an overall total population increase of one person every 1 minute and 30 seconds.)

 */

var birthRate = 104;
var deathRate = 202;
var migrationRate = 156;

var refreshSpeed = 2000;

//var startPopulation = 23940300;
//var startAnchor = moment('31-12-2015 23:59:59+10:00', 'DD-MM-YYYY HH:mm:ss');

var startPopulation = 24144643;
var startAnchor = moment('31-07-2016 09:18:09+10:00', 'DD-MM-YYYY HH:mm:ss');

// http://www.abs.gov.au/ausstats/abs@.nsf/Latestproducts/3301.0Main%20Features52014?opendocument&tabname=Summary&prodno=3301.0&issue=2014&num=&view=
// same order as states array
var birthWeights = [.3, .25, .2, .06, .11, .01, .01, .01];
var statesIndex = [0,1,2,3,4,5,6,7];
var states = [
	{
		state: 'NSW',
		lat: -34,
		lon: 150
	},
	{
		state: 'VIC',
		lat: -37.5,
		lon: 145
	},{
		state: 'QLD',
		lat: -19,
		lon: 145
	},
	{
		state: 'SA',
		lat: -35,
		lon: 138
	},
	{
		state: 'WA',
		lat: -31,
		lon: 116
	},
	{
		state: 'TAS',
		lat: -42,
		lon: 147
	},
	{
		state: 'NT',
		lat: -12.5,
		lon: 130
	},
	{
		state: 'ACT',
		lat: -35,
		lon: 149
	}
];

PopulationClock = {

	baseTime: null,
	basePop: 0,
	speedMultiplier: 18,
	projectionTime: null,
	reset: false,

	/**
	 * Calculate the current population, based on our anchor point
	 *
	 */
	init: function(){

		console.log('init');

		this.baseTime = moment();

		// get the no of seconds elapsed between anchor and present time
		var secondsElapsed = this.baseTime.diff(startAnchor, 's');

		// calc additions, subtractions and set total
		var births = secondsElapsed / birthRate;
		var deaths = secondsElapsed / deathRate;
		var migration = secondsElapsed / migrationRate;
		var net = (births + migration) - deaths;

		Session.set("birthTotal", 0);
		Session.set("deathTotal", 0);
		this.basePop = startPopulation + net;
		Session.set("populationTotal", startPopulation + net);

		this.initPing();
		Meteor.setTimeout(this.refresh, refreshSpeed);
	},

	initPing: function(){
		this.pingLayer = L.pingLayer({}).addTo(Resources.map);
		this.pingLayer.radiusScale().range([4, 28]);
		this.pingLayer.opacityScale().range([1, 0]);
	},

	checkBirths: function(births){

		var currentBirths = Session.get("birthTotal");

		if(Math.round(currentBirths) < Math.round(births)){
			this.pingBirth();
		}

		Session.set("birthTotal", births);

		//var currentBirths = Session.get("birthTotal");
		//var newBirths = currentBirths + births;
		//
		//if(Math.round(currentBirths) < Math.round(newBirths)){
		//	this.pingBirth();
		//}
		//
		//Session.set("birthTotal", newBirths);
	},

	checkDeaths: function(deaths){

		var currentDeaths = Session.get("deathTotal");

		if(Math.round(currentDeaths) < Math.round(deaths)){
			this.pingDeath();
		}

		Session.set("deathTotal", deaths);

		//var currentDeaths = Session.get("deathTotal");
		//var newDeaths = currentDeaths + deaths;
		//
		//if(Math.round(currentDeaths) < Math.round(newDeaths)){
		//	this.pingDeath();
		//}
		//
		//Session.set("deathTotal", newDeaths);
	},

	getBirthLocation: function(){

		var num = Math.random();
		var s = 0;
		var lastIndex = birthWeights.length - 1;
		var targetIndex;
		for (var i = 0; i < lastIndex; ++i) {

			s += birthWeights[i];
			if (num < s) {
				targetIndex = statesIndex[i];
				break;
			}
		}

		targetIndex = targetIndex ? targetIndex : 0;
		var state = states[statesIndex[targetIndex]];
		return [state.lon, state.lat];
	},

	pingBirth: function(){
		var loc = this.getBirthLocation();
		this.pingLayer.ping(loc, 'ping-birth');
	},

	pingDeath: function(){
		this.pingLayer.ping(this.getBirthLocation(), 'ping-death');
	},

	calcPopulation: function(){

		if(!this.projectionTime) this.projectionTime = moment();

		// get the no of seconds elapsed between baseTime and present time
		var secondsElapsed = Math.abs(this.projectionTime.diff(this.baseTime, 's')) + this.speedMultiplier;

		// update the basetime
		this.projectionTime.add(refreshSpeed + (this.speedMultiplier * 1000), 'ms');

		Session.set("populationTime", this.projectionTime.format("DD/MM/YYYY HH:mm:ss"));
		var births = secondsElapsed / birthRate;
		var deaths = secondsElapsed / deathRate;
		var migration = secondsElapsed / migrationRate;
		var net = (births + migration) - deaths;

		this.checkBirths(births + migration);
		this.checkDeaths(deaths);

		Session.set("populationTotal", this.basePop + net);
		Meteor.setTimeout(this.refresh, refreshSpeed);
	},

	refresh: function() {
		if(PopulationClock.reset){
			PopulationClock.projectionTime = null;
			PopulationClock.init();
			PopulationClock.reset = false;
		}
		else {
			PopulationClock.calcPopulation();
		}
	}

};