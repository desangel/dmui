QUnit.module( "ready" );

( function() {
	var notYetReady, noEarlyExecution,
		promisified = Promise.resolve( dmui.ready ),
		order = [],
		args = {};

	notYetReady = !dmui.isReady;

	QUnit.test( "dmui.isReady", function( assert ) {
		assert.expect( 2 );

		assert.equal( notYetReady, true, "dmui.isReady should not be true before DOM ready" );
		assert.equal( dmui.isReady, true, "dmui.isReady should be true once DOM is ready" );
	} );

	// Create an event handler.
	function makeHandler( testId ) {

		// When returned function is executed, push testId onto `order` array
		// to ensure execution order. Also, store event handler arg to ensure
		// the correct arg is being passed into the event handler.
		return function( arg ) {
			order.push( testId );
			args[ testId ] = arg;
		};
	}

	function throwError( num ) {

		// Not a global QUnit failure
		var onerror = window.onerror;
		window.onerror = function() {
			window.onerror = onerror;
		};

		throw new Error( "Ready error " + num );
	}

	// Bind to the ready event in every possible way.
	dmui( makeHandler( "a" ) );
	//dmui( document ).ready( makeHandler( "b" ) );

	// Throw in an error to ensure other callbacks are called
	dmui( function() {
		throwError( 1 );
	} );

	// Throw two errors in a row
	dmui( function() {
		throwError( 2 );
	} );
	dmui.when( dmui.ready ).done( makeHandler( "c" ) );

	// Do it twice, just to be sure.
	dmui( makeHandler( "d" ) );
	dmui( document ).ready( makeHandler( "e" ) );
	dmui.when( dmui.ready ).done( makeHandler( "f" ) );

	noEarlyExecution = order.length === 0;

	// This assumes that QUnit tests are run on DOM ready!
	QUnit.test( "dmui ready", function( assert ) {
		assert.expect( 8 );

		assert.ok( noEarlyExecution,
			"Handlers bound to DOM ready should not execute before DOM ready" );

		// Ensure execution order.
		assert.deepEqual( order, [ "a", "b", "c", "d", "e", "f" ],
			"Bound DOM ready handlers should execute in on-order" );

		// Ensure handler argument is correct.
		assert.equal( args.a, dmui,
			"Argument passed to fn in dmui( fn ) should be dmui" );
		assert.equal( args.b, dmui,
			"Argument passed to fn in dmui(document).ready( fn ) should be dmui" );

		order = [];

		// Now that the ready event has fired, again bind to the ready event.
		// These ready handlers should execute asynchronously.
		var done = assert.async();
		dmui( makeHandler( "g" ) );
		dmui( document ).ready( makeHandler( "h" ) );
		window.setTimeout( function() {
			assert.equal( order.shift(), "g", "Event handler should execute immediately, but async" );
			assert.equal( args.g, dmui, "Argument passed to fn in dmui( fn ) should be dmui" );

			assert.equal( order.shift(), "h", "Event handler should execute immediately, but async" );
			assert.equal( args.h, dmui,
				"Argument passed to fn in dmui(document).ready( fn ) should be dmui" );
			done();
		} );
	} );

	QUnit.test( "Promise.resolve(dmui.ready)", function( assert ) {
		assert.expect( 2 );
		var done = dmui.map( new Array( 2 ), function() { return assert.async(); } );

		promisified.then( function() {
			assert.ok( dmui.isReady, "Native promised resolved" );
			done.pop()();
		} );

		Promise.resolve( dmui.ready ).then( function() {
			assert.ok( dmui.isReady, "Native promised resolved" );
			done.pop()();
		} );
	} );

	QUnit.test( "Error in ready callback does not halt all future executions (gh-1823)", function( assert ) {
		assert.expect( 1 );
		var done = assert.async();

		dmui( function() {
			throwError( 3 );
		} );

		dmui( function() {
			assert.ok( true, "Subsequent handler called" );
			done();
		} );
	} );
} )();
