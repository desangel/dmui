/*!
 * dmui's Gruntfile
 */

/* jshint node: true */
module.exports = function(grunt) {
	'use strict';

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	RegExp.quote = function(string) {
		return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	var generateNamespace = require('./grunt/dmui-namespace-generator.js');
	
	function readOptionalJSON( filepath ) {
		var stripJSONComments = require( "strip-json-comments" ),
			data = {};
		try {
			data = JSON.parse( stripJSONComments(
				fs.readFileSync( filepath, { encoding: "utf8" } )
			) );
		} catch ( e ) {}
		return data;
	}
	
	var fs = require( "fs" ),
		//gzip = require( "gzip-js" ),
		
		srcHintOptions = readOptionalJSON( "js/.jshintrc" ),
		
		// Skip jsdom-related tests in Node.js 0.10 & 0.12
		runJsdomTests = !/^v0/.test( process.version );
		
	if ( !grunt.option( "filename" ) ) {
		grunt.option( "filename", "js/dmui.js" );
	}
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			libPath: 'libs/',
			distPath: 'dist/',
			jsPath: 'js/',
			sassPath: 'sass/',
			examplesPath: 'example/'
		},

		banner: '/*!\n' +
			' * =====================================================\n' +
			' * dmui v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
			' * =====================================================\n' +
			' */\n',

		//tasks
		clean: {
			all: ['<%= meta.distPath %>'],
			sourceMap: ['<%= meta.distPath %>css/*.map']
		},

		//css
		sass: {
			options: {
				banner: '<%= banner %>',
				style: 'expanded',
				unixNewlines: true
			},
			dist: {
				files: {
					'<%= meta.distPath %>css/<%= pkg.name %>.css': 'sass/dmui.scss'
				}
			}
		},

		csscomb: {
			options: {
				config: 'sass/.csscomb.json'
			},
			dist: {
				files: {
					'<%= meta.distPath %>/css/<%= pkg.name %>.css': '<%= meta.distPath %>/css/<%= pkg.name %>.css'
				}
			}
		},
		
		cssmin: {
			options: {
				banner: '', // set to empty; see bellow
				keepSpecialComments: '*', // set to '*' because we already add the banner in sass
				sourceMap: false
			},
			dmui: {
				src: '<%= meta.distPath %>css/<%= pkg.name %>.css',
				dest: '<%= meta.distPath %>css/<%= pkg.name %>.min.css'
			}
		},

		//no amd js build
		concat: {
			dmui: {
				options: {
					banner: '<%= banner %>'
				},
				src: [
					'js/index.js',
					'js/core.js'
				],
				dest: '<%= meta.distPath %>js/<%= pkg.name %>.js'
			}
		},
		
		uglify: {
			options: {
				banner: '<%= banner %>',
				mangle: true,
				preserveComments: false,
				sourceMap: true,
				report: 'min',
				compress: {
					'hoist_funs': false,
					loops: false,
					unused: false
				}
			},
			dmui: {
				//src: '<%= concat.dmui.dest %>',
				src: '<%= meta.distPath %>js/<%= pkg.name %>.js',
				dest: '<%= meta.distPath %>js/<%= pkg.name %>.min.js'
			}
		},

		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				},
				livereload: true
			},
			scripts: {
				files: [
					'<%= meta.sassPath %>/**/*.scss',
					'<%= meta.jsPath %>/**/*.js'
				],
				tasks: 'dist'
			}
		},
		
		copy: {
			fonts: {
				expand: true,
				src: 'fonts/dmui*.ttf',
				dest: '<%= meta.distPath %>/'
			},
			examples: {
				expand: true,
				cwd: '<%= meta.distPath %>',
				src: ['**/dmui*'],
				dest: '<%= meta.examplesPath %>'
			}
		},

		//js
		build: {
			all: {
				dest: "dist/dmui.js",
				minimum: [
					"core"
				]
			}
		},
		
		jsonlint: {
			pkg: {
				src: [ 'package.json' ]
			}
		},
		
		jshint: {
			all: {
				src: [
					"js/*.js" //, "Gruntfile.js", "test/**/*.js", "build/**/*.js"
				],
				options: {
					jshintrc: true
				}
			},
			dist: {
				src: "dist/js/dmui.js",
				options: srcHintOptions
			},
			options: {
				jshintrc: 'js/.jshintrc'
			},
			grunt: {
				src: ['Gruntfile.js', 'grunt/*.js']
			},
			src: {
				src: 'js/*.js'
			}
		},

		jscs: {
			options: {
				config: '.jscsrc'
			},
			//docs: { src: '<%= jshint.docs.src %>' },
			grunt: { src: '<%= jshint.grunt.src %>' },
			src: { src: '<%= jshint.src.src %>' }
		},
		
		//test
		babel: {
			options: {
				sourceMap: "inline",
				retainLines: true
			},
			nodeSmokeTests: {
				files: {
					"test/node_smoke_tests/lib/ensure_iterability.js":
						"test/node_smoke_tests/lib/ensure_iterability_es6.js"
				}
			}
		},
		
		testswarm: {
			tests: [
				// A special module with basic tests, meant for
				// not fully supported environments like Android 2.3,
				// jsdom or PhantomJS. We run it everywhere, though,
				// to make sure tests are not broken.
				"core"
				
			]
		},

		csslint: {
			options: {
				csslintrc: 'sass/.csslintrc'
			},
			src: [
				'<%= meta.distPath %>/css/<%= pkg.name %>.css'
			]
		},
		sed: {
			versionNumber: {
				pattern: (function() {
					var old = grunt.option('oldver');
					return old ? RegExp.quote(old) : old;
				})(),
				replacement: grunt.option('newver'),
				recursive: true
			}
		}
	});
	// Load the plugins
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});
	require('time-grunt')(grunt);
	grunt.loadTasks( "build/tasks" );
	// Default task(s).
	grunt.registerTask( 'lint', [ 'jsonlint', 'jshint', 'jscs' ] );
	//grunt.registerTask( 'lint', [ 'jsonlint', 'jshint' ] );  // with out test
	
	grunt.registerTask('cleanAll', ['clean']);
	//grunt.registerTask('dist-css', ['sass', 'csscomb', 'cssmin', 'clean:sourceMap']);
	grunt.registerTask('dist-css', ['sass', 'csscomb', 'cssmin']);
	//grunt.registerTask('dist-js', ['concat', 'build-namespace', 'uglify']);
	grunt.registerTask('dist-js', [ 'build:*:*','lint', 'uglify']);   //for amd
	grunt.registerTask('dist', ['dist-css', 'dist-js', 'copy']); 
	grunt.registerTask('dev', ['clean:all', 'dist']);
	grunt.registerTask('default', ['dev']);

	grunt.registerTask( "test_fast", runJsdomTests ? [ "node_smoke_tests" ] : [] );
	//grunt.registerTask( "test", [ "test_fast" ].concat( runJsdomTests ? [ "promises_aplus_tests" ] : [] ) );
	grunt.registerTask( "test", [ 'node_smoke_tests' ] ) ;
	
	grunt.registerTask('build-namespace', generateNamespace);

	grunt.registerTask('server', ['dist','watch']);

	// Version numbering task.
	// grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
	// This can be overzealous, so its changes should always be manually reviewed!
	grunt.registerTask('change-version-number', 'sed');

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};