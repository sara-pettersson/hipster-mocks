module.exports = function(grunt) {
	//1. All configuration goes here 
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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

		//1. Using grunt-gm with graphicsmagick plugin to place concepts into a hipster frame
		gm: {
			mocks: {
				options: {
		        // default: false, check if dest file exists and size > 0 
		        skipExisting: false,
		        // default: false 
		        stopOnError: false
		    },

				files: [
					{
						cwd: 'development/mocks',       // Src matches are relative to this path
						dest: 'production/images',      // Destination path prefix
						expand: true, 				    // Enable dynamic expansion
						filter:'isFile',
						src: ['**/**/*',  '!**/template/'],   //target files
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
				              in: ['development/template/macbook.png'],
				            }, {
				              // adD reflection 
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

	  //2. Minification of the images
      
	  imagemin: {
	    dynamic: {
	      files: [{
	        expand: true,
	        cwd: 'development/mocks/',							 // Src path for minification 
	        src: ['*.{png,jpg,gif}', '*.{png,jpg,gif}'],		 // [file], [template frame]
	        dest: 'production/images/'							 // Destination output
	      }]
	    }
	  },

	});






	// 3. Where we tell Grunt we plan to use this plug-in. Install plugins with --save-dev


  
    grunt.loadNpmTasks('grunt-gm'); //make sure install graphicsmagick inconjuction, info: https://www.npmjs.com/package/gm
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');



	// default task when work is passed between developers or being worked on after again 
	//- Running grunt will not destroy previous work by overwriting from templates
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', ['imagemin', 'gm', 'concat', 'sass' ]);
};

