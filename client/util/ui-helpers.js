
UI.registerHelper('formatDateTime', function(time) {
	return Helpers.format.time(time);
});

UI.registerHelper('isRoute', function(route) {
	if(Router.current().route) return route == Router.current().route.getName();
});

UI.registerHelper('version', function() {
	return Meteor.settings.public.version;
});

UI.registerHelper('subString', function(string, maxChars) {
	return string.substring(0, maxChars);
});
