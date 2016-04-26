/*!
 * dmui JavaScript Library v0.1.0
 * https://dmui.com/

 * Copyright dmui Foundation and other contributors
 * Released under the MIT license
 * https://github.com/desangel/dmui/license
 *
 * Date: 2016-04-26T08:54Z
 */
( function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get dmui.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var dmui = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "dmui requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of dmui 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";


	var dmui = function(){
		
	};
	dmui.fn = dmui.prototype = {
		constructor: dmui,
		init: function(){
			window.console.log('init');
		}
	};


var

	// Map over dmui in case of overwrite
	_dmui = window.dmui;

dmui.noConflict = function( deep ) {
	if ( deep && window.dmui === dmui ) {
		window.dmui = _dmui;
	}

	return dmui;
};

// Expose dmui and $ identifiers, even in AMD
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.dmui = dmui;
}


return dmui;
} ) );
