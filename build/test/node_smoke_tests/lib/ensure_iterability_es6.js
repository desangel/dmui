/* jshint esnext: true */

"use strict";

var assert = require( "assert" );

module.exports = function ensureIterability() {
	require( "jsdom" ).env( "", function( errors, window ) {
		assert.ifError( errors );

		var i,
			ensuredmui = require( "./ensure_dmui" ),
			dmui = require( "../../../dist/dmui.js" )( window ),
			elem = dmui( "<div></div><span></span><a></a>" ),
			result = "";

		ensuredmui( dmui );

		for ( i of elem ) {
			result += i.nodeName;
		}

		assert.strictEqual( result, "DIVSPANA", "for-of doesn't work on dmui objects" );
	} );
};
