define( [
	"./util/index",
	window
], function( util, window ) {
	
var version = "@VERSION";

var dmui = function(){
	this.init();
};
dmui.fn = dmui.prototype = {
	version: version,
	constructor: dmui,
	init: function(){
		window.console.log(util);
	}
};
	
} );
