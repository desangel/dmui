define( [
	//"./var/document",
	window
], function( window ) {
	var dmui = function(){
		
	};
	dmui.fn = dmui.prototype = {
		constructor: dmui,
		init: function(){
			window.console.log('init');
		}
	};
} );
