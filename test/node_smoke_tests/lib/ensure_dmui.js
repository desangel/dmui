"use strict";

var assert = require( "assert" );

// Check if the object we got is the dmui object by invoking a basic API.
module.exports = function ensureDmui( dmui ) {
	assert( /^dmui/.test( dmui.expando ),
		"dmui.expando was not detected, the dmui bootstrap process has failed" );
};
