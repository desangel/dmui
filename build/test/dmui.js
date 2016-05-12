// Use the right dmui source on the test page (and iframes)
( function() {
	/* global loadTests: false */

	var src,
		path = window.location.pathname.split( "test" )[ 0 ],
		QUnit = window.QUnit || parent.QUnit,
		require = window.require || parent.require;

	// iFrames won't load AMD (the iframe tests synchronously expect dmui to be there)
	QUnit.config.urlConfig.push( {
		id: "amd",
		label: "Load with AMD",
		tooltip: "Load the AMD dmui file (and its dependencies)"
	} );

	// If QUnit is on window, this is the main window
	// This detection allows AMD tests to be run in an iframe
	if ( QUnit.urlParams.amd && window.QUnit ) {
		require.config( {
			baseUrl: path
		} );
		src = "js/dmui";

		// Include tests if specified
		if ( typeof loadTests !== "undefined" ) {
			require( [ src ], loadTests );
		} else {
			require( [ src ] );
		}
		return;
	}

	// Config parameter to use minified dmui
	QUnit.config.urlConfig.push( {
		id: "dev",
		label: "Load unminified",
		tooltip: "Load the development (unminified) dmui file"
	} );
	if ( QUnit.urlParams.dev ) {
		src = "dist/js/dmui.js";
	} else {
		src = "dist/js/dmui.min.js";
	}

	// Load dmui
	document.write( "<script id='dmui-js' src='" + path + src + "'><\x2Fscript>" );

	// Synchronous-only tests
	// Other tests are loaded from the test page
	if ( typeof loadTests !== "undefined" ) {
		document.write( "<script src='" + path + "test/unit/ready.js'><\x2Fscript>" );
	}

} )();
