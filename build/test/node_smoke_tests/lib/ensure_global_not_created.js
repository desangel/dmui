"use strict";

var assert = require( "assert" );

// Ensure the dmui property on global/window/module.exports/etc. was not
// created in a CommonJS environment.
// `global` is always checked in addition to passed parameters.
module.exports = function ensureGlobalNotCreated() {
	var args = [].slice.call( arguments ).concat( global );

	args.forEach( function( object ) {
		assert.strictEqual( object.dmui, undefined,
			"A dmui global was created in a CommonJS environment." );
	} );
};
