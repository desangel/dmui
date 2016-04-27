QUnit.module( "core", { teardown: moduleTeardown } );

QUnit.test( "Basic requirements", function( assert ) {
	assert.expect( 6 );
	assert.ok( Array.prototype.push, "Array.push()" );
	assert.ok( Function.prototype.apply, "Function.apply()" );
	assert.ok( document.getElementById, "getElementById" );
	assert.ok( document.getElementsByTagName, "getElementsByTagName" );
	assert.ok( RegExp, "RegExp" );
	assert.ok( dmui, "dmui" );
} );

QUnit.test( "dmui()", function( assert ) {

	var exec = false,
		expected = 23,
		attrObj = {
			"text": "test",
			"class": "test2",
			"id": "test3"
		},
		obj = new dmui();
	if ( dmui.prototype.init ) {
		expected++;
		attrObj[ "init" ] = function() { assert.ok( exec, "init executed." ); };
	}
	assert.expect( expected );
	
} );