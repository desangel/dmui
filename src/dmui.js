/**
 * @author kid
 */

var dmui = { REVISION: '1' };

//

if ( typeof define === 'function' && define.amd ) {

		define( 'three', THREE );

} else if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {

		module.exports = THREE;

}


// polyfills

if ( self.requestAnimationFrame === undefined || self.cancelAnimationFrame === undefined ) {

	// Missing in Android stock browser.

	( function () {

		var lastTime = 0;
		var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

		for ( var x = 0; x < vendors.length && ! self.requestAnimationFrame; ++ x ) {

			self.requestAnimationFrame = self[ vendors[ x ] + 'RequestAnimationFrame' ];
			self.cancelAnimationFrame = self[ vendors[ x ] + 'CancelAnimationFrame' ] || self[ vendors[ x ] + 'CancelRequestAnimationFrame' ];

		}

		if ( self.requestAnimationFrame === undefined && self.setTimeout !== undefined ) {

			self.requestAnimationFrame = function ( callback ) {

				var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
				var id = self.setTimeout( function () {

					callback( currTime + timeToCall );

				}, timeToCall );
				lastTime = currTime + timeToCall;
				return id;

			};

		}

		if ( self.cancelAnimationFrame === undefined && self.clearTimeout !== undefined ) {

			self.cancelAnimationFrame = function ( id ) {

				self.clearTimeout( id );

			};

		}

	} )();

}

