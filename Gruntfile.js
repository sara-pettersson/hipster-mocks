module.exports = function(grunt) {

  // var adcfg = grunt.file.readJSON('adconfig.json');
  // var awscfg = grunt.file.readJSON('awsInfo.json');
  // var ftpcfg = grunt.file.readJSON('ftpInfo.json');

  // 1. All configuration goes here 
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),




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
              cwd: 'mocks',
              dest: 'development/_images',
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
                  in: ['mocks/template/macbook.png'],
                }, {
                  // ad reflection 
                 command: ['composite'],
                 in: ['mocks/template/shine.png'],
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
            cwd: 'mocks/out/',
            src: ['*.{png,jpg,gif}', '**/*.{png,jpg,gif}'],
            dest: 'production/_images/'
          }]
        }
      },



    });

  


    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-gm');
    grunt.loadNpmTasks('grunt-contrib-imagemin');



  /////////////////////////////////////////// default task when work is passed between developers or being worked on after again - Running grunt will not destroy previous work by overwriting from templates

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [
      'gm', 
      'imagemin',
    ]);


};