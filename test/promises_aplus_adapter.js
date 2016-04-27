/* jshint node: true */

"use strict";

require( "jsdom" ).env( "", function( errors, window ) {
	if ( errors ) {
		console.error( errors );
		return;
	}

	var dmui = require( ".." )( window );

	exports.deferred = function() {
		var deferred = dmui.Deferred();

		return {
			promise: deferred.promise(),
			resolve: deferred.resolve.bind( deferred ),
			reject: deferred.reject.bind( deferred )
		};
	};
} );
