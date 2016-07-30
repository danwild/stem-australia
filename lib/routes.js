Router.route('/', {
	name: 'home',
	layoutTemplate: 'masterlayout',
	template: 'home'
});

Router.route('/climate', {
	path: 'climate',
	layoutTemplate: 'masterlayout',
	template: 'climate'
});

Router.route('/energy', {
	path: 'energy',
	layoutTemplate: 'masterlayout',
	template: 'energy'
});

Router.route('/resources', {
	path: 'resources',
	layoutTemplate: 'masterlayout',
	template: 'resources'
});

Router.configure({
	layoutTemplate: 'masterlayout',
	notFoundTemplate: 'notfound',
	loadingTemplate: 'loadingPage'
});