ClosestPoint = {

	deg2Rad: function(deg) {
		return deg * Math.PI / 180;
	},

    pythagorasEquirectangular: function( lat1, lon1, lat2, lon2 ) {
		lat1 = this.deg2Rad(lat1);
		lat2 = this.deg2Rad(lat2);
		lon1 = this.deg2Rad(lon1);
		lon2 = this.deg2Rad(lon2);
		var R = 6371; // km
		var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
		var y = (lat2-lat1);
		var d = Math.sqrt(x*x + y*y) * R;
		return d;
	},

    findPoint: function(latitude, longitude, positions) {

	    var minDiff = 99999;
		var closestIndex;

		for (var index = 0; index < positions.length; ++index) {

			var diff = this.pythagorasEquirectangular(latitude, longitude, positions[index].lat, positions[index].lng);

			if(diff < minDiff) {
				closestIndex = index;
				minDiff = diff;
			}
		}

		var closestLocation = (positions[closestIndex]);

	    return {
		    pos: closestLocation,
		    index: closestIndex
	    };
	}
};

