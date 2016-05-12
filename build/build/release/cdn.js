var
	fs = require( "fs" ),
	shell = require( "shelljs" ),
	path = require( "path" ),

	cdnFolder = "dist/cdn",

	releaseFiles = {
		"dmui-VER.js": "dist/js/dmui.js",
		"dmui-VER.min.js": "dist/js/dmui.min.js",
		"dmui-VER.min.map": "dist/js/dmui.min.map",
		"dmui-VER.slim.js": "dist/js/dmui.slim.js",
		"dmui-VER.slim.min.js": "dist/js/dmui.slim.min.js",
		"dmui-VER.slim.min.map": "dist/js/dmui.slim.min.map"
	},

	googleFilesCDN = [
		"dmui.js", "dmui.min.js", "dmui.min.map",
		"dmui.slim.js", "dmui.slim.min.js", "dmui.slim.min.map"
	],

	msFilesCDN = [
		"dmui-VER.js", "dmui-VER.min.js", "dmui-VER.min.map",
		"dmui-VER.slim.js", "dmui-VER.slim.min.js", "dmui-VER.slim.min.map"
	];

/**
 * Generates copies for the CDNs
 */
function makeReleaseCopies( Release ) {
	shell.mkdir( "-p", cdnFolder );

	Object.keys( releaseFiles ).forEach( function( key ) {
		var text,
			builtFile = releaseFiles[ key ],
			unpathedFile = key.replace( /VER/g, Release.newVersion ),
			releaseFile = cdnFolder + "/" + unpathedFile;

		if ( /\.map$/.test( releaseFile ) ) {

			// Map files need to reference the new uncompressed name;
			// assume that all files reside in the same directory.
			// "file":"dmui.min.js","sources":["dmui.js"]
			text = fs.readFileSync( builtFile, "utf8" )
				.replace( /"file":"([^"]+)","sources":\["([^"]+)"\]/,
					"\"file\":\"" + unpathedFile.replace( /\.min\.map/, ".min.js" ) +
					"\",\"sources\":[\"" + unpathedFile.replace( /\.min\.map/, ".js" ) + "\"]" );
			fs.writeFileSync( releaseFile, text );
		} else if ( builtFile !== releaseFile ) {
			shell.cp( "-f", builtFile, releaseFile );
		}
	} );
}

function makeArchives( Release, callback ) {

	Release.chdir( Release.dir.repo );

	function makeArchive( cdn, files, callback ) {
		if ( Release.preRelease ) {
			console.log( "Skipping archive creation for " + cdn + "; this is a beta release." );
			callback();
			return;
		}

		console.log( "Creating production archive for " + cdn );

		var sum,
			archiver = require( "archiver" )( "zip" ),
			md5file = cdnFolder + "/" + cdn + "-md5.txt",
			output = fs.createWriteStream(
				cdnFolder + "/" + cdn + "-dmui-" + Release.newVersion + ".zip"
			),
			rver = /VER/;

		output.on( "close", callback );

		output.on( "error", function( err ) {
			throw err;
		} );

		archiver.pipe( output );

		files = files.map( function( item ) {
			return "dist" + ( rver.test( item ) ? "/cdn" : "" ) + "/" +
				item.replace( rver, Release.newVersion );
		} );

		sum = Release.exec( "md5sum " + files.join( " " ), "Error retrieving md5sum" );
		fs.writeFileSync( md5file, sum );
		files.push( md5file );

		files.forEach( function( file ) {
			archiver.append( fs.createReadStream( file ),
				{ name: path.basename( file ) } );
		} );

		archiver.finalize();
	}

	function buildGoogleCDN( callback ) {
		makeArchive( "googlecdn", googleFilesCDN, callback );
	}

	function buildMicrosoftCDN( callback ) {
		makeArchive( "mscdn", msFilesCDN, callback );
	}

	buildGoogleCDN( function() {
		buildMicrosoftCDN( callback );
	} );
}

module.exports = {
	makeReleaseCopies: makeReleaseCopies,
	makeArchives: makeArchives
};
