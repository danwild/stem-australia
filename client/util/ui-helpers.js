
UI.registerHelper('isRoute', function(route) {
	if(Router.current().route) return route == Router.current().route.getName();
});

UI.registerHelper('subString', function(string, maxChars) {
	return string.substring(0, maxChars);
});

UI.registerHelper('formatLargeNum', function(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});
