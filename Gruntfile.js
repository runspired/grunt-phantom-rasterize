/*global module*/
module.exports = function (grunt) {

  grunt.initConfig({

    rasterize : {
      fallback: {
        options : {
          subdir : 'png'
        },
        files: [{
          expand: true,
          cwd: "test/svg",
          src: ["**/*.svg"]
        }]
      },
      retina: {
        options: {
          sizes: [{ width : 128, name : 'icon@2x.png' }],
          limit: 5,
          subdir : 'png_2x'
        },
        files: [{
          expand: true,
          cwd: "test/svg",
          src: ["**/*.svg"],
          ext : '.png'
        }]
      },
      nosubdir: {
        options: {
          sizes: [{ width : 192, name : 'icon@3x.png' }],
          limit: 5
        },
        files: [{
          expand: true,
          cwd: "test/svg",
          src: ["**/*.svg"],
          dest : 'png_3x/',
          ext : '.png'
        }]
      }
    },

    simplemocha: {
      test: {
        src: "test/*.js"
      }
    },

    clean: {
      test: ["test/svg/png", "test/svg/png_2x", "test/svg/png_3x"]
    }

  });

  grunt.loadTasks("tasks");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-simple-mocha");

  grunt.registerTask("default", ["clean", "rasterize", "simplemocha", "clean"]);

};
