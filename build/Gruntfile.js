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
		
		srcHintOptions = readOptionalJSON( "../src/js/.jshintrc" ),
		
		// Skip jsdom-related tests in Node.js 0.10 & 0.12
		runJsdomTests = !/^v0/.test( process.version );
		
	if ( !grunt.option( "filename" ) ) {
		grunt.option( "filename", "../temp/index.js" );  //build task output path
	}
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			main: {
				jsMain: 'index.js',
				sassMain: 'main.scss'
			},
			path: {
				basePath: '../',
				libPath: 'libs/',
				distPath: 'dist/',
				jsPath: 'src/js/',
				sassPath: 'src/sass/',
				examplesPath: 'example/',
				tempPath: 'temp/'
			}
		},

		banner: '/*!\n' +
			' * =====================================================\n' +
			' * dmui v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
			' * =====================================================\n' +
			' */\n',

		//tasks
		clean: {
			all: ['<%= meta.path.distPath %>'],
			temp: ['temp'],
			sourceMap: ['<%= meta.path.distPath %>css/*.map']
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
					'<%= meta.path.distPath %>css/<%= pkg.name %>.css': '<%= meta.path.basePath %><%= meta.path.sassPath %><%= meta.main.sassMain %>'
				}
			}
		},

		csscomb: {
			options: {
				config: 'sass/.csscomb.json'
			},
			dist: {
				files: {
					'<%= meta.path.distPath %>/css/<%= pkg.name %>.css': '<%= meta.path.distPath %>/css/<%= pkg.name %>.css'
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
				src: '<%= meta.path.distPath %>css/<%= pkg.name %>.css',
				dest: '<%= meta.path.distPath %>css/<%= pkg.name %>.min.css'
			}
		},

		//js
		jsonlint: {
			pkg: {
				src: [ 'package.json' ]
			}
		},
		
		jshint: {
			options: {
				jshintrc: '<%= meta.path.basePath %><%= meta.path.jsPath %>.jshintrc'
			},
			all: {
				src: [
					"<%= meta.path.distPath %>/*.js" //, "Gruntfile.js", "test/**/*.js", "build/**/*.js"
				],
				options: {
					jshintrc: true
				}
			},
			dist: {
				src: "<%= meta.path.distPath %>/*.js",
				options: srcHintOptions
			},
			grunt: {
				src: ['Gruntfile.js', 'grunt/*.js']
			},
			src: {
				src: '<%= meta.path.basePath %><%= meta.path.jsPath %>*'
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
		
		//js
		build: {
			all: {
				dest: "<%= meta.path.tempPath %>index.js",
				minimum: [
					"core"
				]
			}
		},
		
		//no amd js build
		concat: {
			dmui: {
				options: {
					banner: '<%= banner %>'
				},
				src: [
					'<%= meta.path.tempPath %>index.js'
				],
				dest: '<%= meta.path.distPath %>js/<%= pkg.name %>.js'
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
			main: {
				src: '<%= meta.path.distPath %>js/<%= pkg.name %>.js',
				dest: '<%= meta.path.distPath %>js/<%= pkg.name %>.min.js'
			}
		},
		
		copy: {
			fonts: {
				expand: true,
				src: '<%= meta.path.basePath %>fonts/dmui*.ttf',
				dest: '<%= meta.path.basePath %><%= meta.distPath %>/'
			},
			dist: {
				expand: true,
				cwd: '<%= meta.path.distPath %>',
				src: ['**/<%= pkg.name %>*'],
				dest: '<%= meta.path.basePath %><%= meta.path.distPath %>'
			},
			examples: {
				expand: true,
				cwd: '<%= meta.path.basePath %><%= meta.path.distPath %>',
				src: ['**/<%= pkg.name %>*'],
				dest: '<%= meta.path.basePath %><%= meta.path.examplesPath %>'
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
					'<%= meta.path.basePath %><%= meta.path.sassPath %>/**/*.scss',
					'<%= meta.path.basePath %><%= meta.path.jsPath %>/**/*.js'
				],
				tasks: 'dist'
			}
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
	grunt.registerTask('dist-js', [ 'build:*:*', 'concat', 'lint', 'uglify']);   //for amd
	grunt.registerTask('dist', ['dist-css', 'dist-js', 'copy']); 
	grunt.registerTask('dev', ['clean:all', 'dist']);
	grunt.registerTask('default', ['dev']);

	grunt.registerTask('dev-js', ['clean', 'dist-js', 'copy']);
	grunt.registerTask('dev-css', ['clean', 'dist-css', 'copy']);
	
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