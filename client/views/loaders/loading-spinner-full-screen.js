Session.set("loadingSpinnerFullScreen", false);
Session.set("loadingSpinnerFullScreenMsg", null);

Template.loadingSpinnerFullScreen.helpers({

	show: function(){
		return Session.get("loadingSpinnerFullScreen");
	},

	message: function(){
		return Session.get("loadingSpinnerFullScreenMsg");
	}
});

LoadingSpinnerFullScreen = {

	show: function(message){
		Session.set("loadingSpinnerFullScreenMsg", message);
		Session.set("loadingSpinnerFullScreen", true);
	},

	hide: function(){
		Session.set("loadingSpinnerFullScreen", false);
		Session.set("loadingSpinnerFullScreenMsg", null);
	}
};