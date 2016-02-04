module.exports = function(grunt) {


  // 1. All configuration goes here 
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),


    /////////////////////////////////////////// Local Server

    connect: {
      server: {
        options: {
          livereload: true,
          debug: true,
          protocol: 'http',
          hostname: '*',
          port:8087,
          base: 'development',
          keepalive: true,
          open: true
        }
      }
    },


    /////////////////////////////////////////// GM mocks
        
    gm: {
        mocks: {
          options: {
            // default: false, check if dest file exists and size > 0 
            skipExisting: false,
            // default: false 
            stopOnError: false,
            // task options will also be passed to arg callback 
            yourcustomopt: {
            //  'mocks/gruntjs.png': '"JavaScript Task Runner"',
            //  'mocks/nodejs.png': '"JavaScript Runtime"'
            }
           // template : 'mocks/template/<%= myTask.src %>',

          },
          files: [
            {
              cwd: 'development/mocks',
              dest: 'development/images',
              expand: true,
              filter: 'isFile',
              src: ['**/*', '!**/template/*'],

              options: {
               // skipExisting: true,
                stopOnError: true
              },
              // image is passed as stream beteen tasks 
              tasks: [
                {
                  // resize and crop image 
                  resize: [788],
                  crop:[788, 794, 0, 0],
                }, {
                  // extent and center the image with padding above it 
                  gravity: ['South'],
                  extent: [1160, 924],
                }, {
                  // add laptop 
                  command: ['composite'],
                  in: ['development/template/macbook.png'],
                }, {
                  // ad reflection 
                 command: ['composite'],
                 in: ['development/template/shine.png'],
                }, {
                  // final crop 
                 crop:[1160, 794, 0, 0],
                }
              ]
            }
          ]
        }
      },

      /////////////////////////////////////////// Minification
      
      imagemin: {
        dynamic: {
          files: [{
            expand: true,
            cwd: 'development/images',
            src: ['*.{png,jpg,gif}', '**/*.{png,jpg,gif}'],
            dest: 'production/images/'
          }]
        }
      },

		// JS

		concat: {
		// 2. Configuration for concatinating files goes here. (install it first)
			dist: {
				src:[
					'js/libs/*.js',              //All JS in the libs folder
					'js/global/.js'  			 // Global.js is where we will right our own code
				],
				dest: 'js/build/production.js',   //concats all into one file
			}


		},

		// minify the js 
		uglify: {
		    build: {
		        src: 'js/build/production.js',
		        dest: 'js/build/production.min.js'
		    }
		},

		// SASS

		sass: {
			dist: {
				options: {
					style: 'compressed'

				},
				files: {
					'styles/css/build/site.css' : 'styles/sass/global.scss'
				}

			}
		},

		// Watch the SASS and JS files ofr changes

		watch: {
			scripts: {
				files: ['js/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn:false, 					// default
				},
			},
			css: {
				files:['styles/sass/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false,
				},
			}
		},

	});


    // 3. Where we tell Grunt we plan to use this plug-in.
    //grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-gm'); //make sure install graphicsmagick inconjuction, info: https://www.npmjs.com/package/gm
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');


  // 3. Where we tell Grunt we plan to use this plug-in. Install plugins with --save-dev




	// default task when work is passed between developers or being worked on after again 
	//- Running grunt will not destroy previous work by overwriting from templates
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', [
      'gm', 
      'imagemin',
      'connect',
      'concat', 
      'uglify', 
      'sass', 
      'watch'
    ]);
  

};
