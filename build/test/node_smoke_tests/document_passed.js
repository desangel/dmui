"use strict";

var assert = require( "assert" );

require( "jsdom" ).env( "", function( errors, window ) {
	assert.ifError( errors );

	var ensuredmui = require( "./lib/ensure_dmui" ),
		ensureGlobalNotCreated = require( "./lib/ensure_global_not_created" ),
		dmui = require( "../../dist/dmui.js" )( window );

	ensuredmui( dmui );
	ensureGlobalNotCreated( module.exports );
} );
