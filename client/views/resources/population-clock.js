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

var refreshSpeed = 1000;

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
	speedMultiplier: 10,
	projectionTime: moment(),

	/**
	 * Calculate the current population, based on our anchor point
	 *
	 */
	init: function(){

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
		for(var i = Math.round(currentBirths); i < Math.round(births); i++){
			this.pingBirth();
		}

		Session.set("birthTotal", births);
	},

	checkDeaths: function(deaths){

		var currentDeaths = Session.get("deathTotal");
		for(var i = Math.round(currentDeaths); i < Math.round(deaths); i++){
			this.pingDeath();
		}

		Session.set("deathTotal", deaths);
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

		// get the no of seconds elapsed between anchor and present time
		var secondsElapsed = moment().diff(this.baseTime, 's');

		this.projectionTime.add(secondsElapsed * this.speedMultiplier, 's');
		Session.set("populationTime", this.projectionTime.format("DD/MM/YYYY HH:mm:ss"));

		// calc additions, subtractions and set total
		var births = secondsElapsed / (birthRate / this.speedMultiplier);
		var deaths = secondsElapsed / (deathRate / this.speedMultiplier);
		var migration = secondsElapsed / (migrationRate / this.speedMultiplier);
		var net = (births + migration) - deaths;

		this.checkBirths(births);
		this.checkDeaths(deaths);

		Session.set("populationTotal", Session.get("populationTotal") + net);
		Meteor.setTimeout(this.refresh, refreshSpeed);
	},

	refresh: function() {
		PopulationClock.calcPopulation();
	}

};