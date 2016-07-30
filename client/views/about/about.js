Template.about.events({
	// iron router conflicts with normal anchor tags
	'click .anchor':function(e) {
		var target = document.getElementById(e.target.hash.replace('#', ''));
		target.scrollIntoView();
	}
});