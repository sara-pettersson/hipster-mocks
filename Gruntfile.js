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
          base: 'development/build',
          keepalive: true,
          open: true
        }
      }
    },



		// JS

		concat: {
		// 2. Configuration for concatinating files goes here. (install it first)
			dist: {
				src:[
					'development/build/js/libs/*.js',              //All JS in the libs folder
					'development/build/js/global.js'  			 // Global.js is where we will right our own code
				],
				dest: 'production/build/js/production.js',   //concats all into one file
			}
		},

		// minify the js 
		uglify: {
	    build: {
	        src: 'production/build/js/production.js',
	        dest: 'production/build/js/production.min.js'
	    }
		},

		// SASS
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'development/build/styles/css/site.css' : 'development/build/styles/sass/global.scss'
				}
			}
		},

		// Watch the SASS and JS files for changes
		watch: {
      options:{
        livereload: true,
      },
			scripts: {
				files: ['development/build/js/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn:false, 					// default
				},
			},
			css: {
				files:['development/build/styles/sass/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false,
				},
			}
		},

    // 
    concurrent: {
      watch: {
          tasks: ['watch', 'connect'],
          options: {
              logConcurrentOutput: true
          }
      }
    },

    //1. Using grunt-gm with graphicsmagick plugin to place concepts into a hipster frame
    gm: {
      merge: {
        options: {
          // default: false, check if dest file exists and size > 0 
          skipExisting: false,
          // default: false 
          stopOnError: false
        },
        files: [
          {
            cwd: 'development/mocks',       // Src matches are relative to this path
            dest: 'development/build/images',      // Destination path prefix
            expand: true,             // Enable dynamic expansion
            filter:'isFile',
            src: ['**/**/*', '**/**/**/*', '!**/template/'],   //target files
            options: {
              stopOnError: true
            },
            // image is passed as stream beteen tasks 
            tasks: [
              {
                // resize and crop image 
                resize: [788],
                crop:[788, 794, 0, 0,],
              }, 
              {
                // extent and center the image with padding above it
                gravity: ['South'],
                extent: [1160, 924],
              }, 
               {
                // FRAME IT-- add laptop 
                command: ['composite'],
                in: ['development/build/images/template/macbook.png'],
              }, 
              {
                // adD reflection 
               command: ['composite'],
               in: ['development/build/images/template/shine.png'],
              }, 
              {
                // final crop 
               crop:[1160, 794, 0, 0],
              },
              
            ]   
          }
        ]
      },
      resize: {
        files: [
          {
            cwd: 'development/mocks',       // Src matches are relative to this path
            dest: 'development/build/images/jpg',      // Destination path prefix
            expand: true,             // Enable dynamic expansion
            filter:'isFile',
            src: ['**/**/*', '**/**/**/*', '!**/template/'],   //target files
       
            tasks: [
              {
                // resize image 
                resize: [771],
              },
            ] 
          }
        ]

       }
    },

    //2. Minification of the images      
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'development/build/images/',               // Src path for minification 
          src: ['*.{png,jpg,gif}', '*.{png,jpg,gif}'],     // [file], [template frame]
          dest: 'production/build/images/'              // Destination output
        }]
      }
    },

    'string-replace': {
      dist: {
        files: {
          'production/build/index.html': 'development/build/index.html',
        },
        options: {
          replacements: [{
            pattern: 'aboutus',
            replacement: 'desktop'
          }]
        }
      }
    }





  });



  // 3. Where we tell Grunt we plan to use this plug-in. Install plugins with --save-dev


  
    grunt.loadNpmTasks('grunt-gm'); //make sure install graphicsmagick inconjuction, info: https://www.npmjs.com/package/gm
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-concurrent');



	// default task when work is passed between developers or being worked on after again 
	//- Running grunt will not destroy previous work by overwriting from templates
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', [
      'gm', 
      'imagemin',
      'concat', 
      'uglify', 
      'sass', 
      'concurrent:watch',
      //'string-replace'
    ]);
  
};
