/*
 * iconttool
 * 
 *
 * Copyright (c) 2014 Mikko Kankaanranta
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    svgtoodata: {
      example_sassmap: {
        options: {
          output: 'file', 
          dataUri: true,
          listname: '$icons_svg_map',
          template: 'example/example.hbs',
          color: {
            black: '#000',
            white: '#FFF'

          }
        },
        files: {
          'example/dest/_svg_icon.scss': ['example/src/*.svg']
        }
      },
      example_json: {
        options: {
          output: 'file',
          dataUri: true, 
          listname: 'json',
          template: 'example/json.hbs',
          color: '#333'
        },
        files: {
          'example/dest/icons.json': ['example/src/*.svg']
        }
      },
      example_optimize_svg: {
        options: {
          output: 'folder',
          dataUri: false, 
          listname: false,
          template: false,
          color: '#000'
        },
        files: {
          'example/dest/optimized': ['example/src/*.svg']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'svgtoodata']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
