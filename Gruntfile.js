/*global module*/
module.exports = function (grunt) {
	require('time-grunt')(grunt);

  grunt.initConfig({

    pkg : grunt.file.readJSON("package.json"),

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },

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


  /*
   Generate a Release (also creates a build);
   */
  grunt.registerTask(
    'release',
    'Creates and Publishes a Versioned Release. First arg is target, second arg allows for specific environment.',
    function (target) {

      grunt.loadNpmTasks('grunt-bump');
      var shouldBump = !!target;

      if (!shouldBump) {
        grunt.log.warn('[WARNING] grunt:release – No arguments provided. Version will not be bumped.');
      }

      if (shouldBump && !~['patch', 'major', 'minor', 'prerelease', 'git'].indexOf(target)) {
        grunt.log.error('[ERROR] grunt:release – "' + target + '" is not a valid semver target for to bump.');
        return false;
      }

      if (shouldBump) {
        grunt.task.run(['bump-only:' + target]);
      }

      grunt.task.run([
        'bump-commit'
      ]);

    }
  );


};
