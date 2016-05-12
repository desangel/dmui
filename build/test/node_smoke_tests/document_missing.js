"use strict";

var assert = require( "assert" ),
	ensureGlobalNotCreated = require( "./lib/ensure_global_not_created" ),
	dmuiFactory = require( "../../dist/dmui.js" );

assert.throws( function() {
	dmuiFactory( {} );
}, /dmui requires a window with a document/ );

ensureGlobalNotCreated( module.exports );
