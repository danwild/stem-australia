import moment from 'moment';
import leaflet from 'leaflet';
import '/node_modules/leaflet/dist/leaflet.css';

ClientState = new Mongo.Collection(null);

Meteor.startup(function(){

	sAlert.config({
		effect: 'slide',
		position: 'bottom-left',
		timeout: 5000,
		html: true,
		offset: 50
	});
});