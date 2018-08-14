/**
 *  The configuration for Grunt.
 *  
 *  Please note that JSCS FIXES the the code if the environment variable
 *  JSCS_FIX
 *  is set to "TRUE"
**/
module.exports = function(grunt) {
	
	var fixJSCS = false;
	if(process.env.JSCS_FIX && process.env.JSCS_FIX == "TRUE"){
		fixJSCS = true;
	}
	
	grunt.initConfig({
		jshint: {
			src: {
				src: [
					'src/local_modules/**/*.js'
				],
				exclude: [
				],
				directives: {
					node: true,
					todo: true
				},
				options: {
					undef: true,
					globals: {
						module:true,
						process:true,
						console:true,
						require:true,
						__dirname:false
					}
				},
			},
			test: {
				src: [
					'tests/**/*.js'
				],
				exclude: [
				],
				directives: {
					node: true,
					todo: true
				},
				options: {
					undef: true,
					globals: {
						console:true,
						describe:true,
						it: true,
						module:true,
						process:true,
						require:true,
						__dirname:false
					}
				},
			}
		},
		jscs: {
			src: {
				src: [
					'src/local_modules/**/*.js',
					'src/*.js'
				],
				options: {
					//preset: "crockford",
					//config: "crockford.jscs",
					config: "./airbnb.jscs",
					requireCurlyBraces: [ "if" ],
					fix: fixJSCS,
					disallowSpaceBeforeBlockStatements: true
				}
			},
			test: {
				src: [
					'tests/**/*.js'
				],
				options: {
					//preset: "crockford",
					//config: "crockford.jscs",
					config: "./airbnb.jscs",
					requireCurlyBraces: [ "if" ],
					fix: fixJSCS,
					disallowSpaceBeforeBlockStatements: true
				}
			}
		},
		ejslint: {
			target: ['src/**/*.ejs'],
			options: {
				delimiter: '%'
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					quiet: false,
					clearRequireCache: true,
					noFail: false
				},
				src: [
					'tests/**/*.js'
				]
			}
		},
		mocha_istanbul: {
			coverage: {
				src: 'tests',
				options: {
					mask: '*[sS]pec.js'
				}
			}
		},
		watch: {
			src: {
				files: ['src/**/*.js'],
				tasks: ["default"],
				options: {
					spawn: false
				}
			},
			test: {
				files: ['src/**/*.js', 'tests/**/*.js', 'src/**/*.ejs'],
				tasks: ["test"],
				options: {
					spawn: false
				}
			}
		},
		clean: {
			default: {
				src: ['dist']
			},
			grunt: {
				src: ['Grunt.output']
			}
		}
	});
	
	if( fixJSCS ){
		grunt.log.writeln( "JSCS CURRENTLY auto-fixes errors" );
		grunt.log.writeln( "- to disable, run shellscript 'unset JSCS_FIX'" );
	} else {
		grunt.log.writeln( "JSCS currently does not auto-fix errors" );
		grunt.log.writeln( "- to enable, run shellscript 'export JSCS_FIX=\"TRUE\"'" );
	}
	//-- uncomment to verify JSCS is fixing or not as expected
	//-- verifies that JSCS is configured correctly
	//console.log( "JSCS_FIX:" + fixJSCS );
	//-- prints out the JSCS config
	//grunt.log.writeln( JSON.stringify( grunt.config().jscs, null, 2 ));
	
	grunt.loadNpmTasks('grunt-ejslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	//grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.registerTask("default", ["jshint:src", "ejslint", "jscs:src"]);
	grunt.registerTask("test", ["jshint:src","jshint:test", "ejslint", "jscs:src","jscs:test", "mochaTest"]);
	grunt.registerTask("testOnly", ["mochaTest"]);
	grunt.registerTask("coverage", ["jshint:src","jshint:test", "ejslint", "jscs:src","jscs:test", "mochaTest", "mocha_istanbul"]);
	grunt.registerTask("coverageOnly", ["mochaTest", "mocha_istanbul"] );
	
	grunt.registerTask('watchSrc', ['watch:src']);
	grunt.registerTask('watchTest', ['watch:test']);
};