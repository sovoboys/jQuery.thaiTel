/*
 *  jQuery.thaiTel.js
 *
 *  Copyright 2018, P. Cheewahkidakarn - https://www.sovoboys.net/about/ihut
 *
 *  Version: 0.0.0
 */
console.warn('NOT READY YET!');
jQuery.fn.thaiTel = function(options, additional){

	if (typeof options === typeof function(){}) {
		options = {p1: options};
		if (typeof additional === typeof function(){}) {
			options.p2 = additional;
		}
	} else if (typeof options !== typeof {}) {
		options = {};
	}

	let settings = jQuery.extend({

	}, options);

	this.each(function() {
		let $self = jQuery(this);


	});

  return this
};

}(jQuery));
