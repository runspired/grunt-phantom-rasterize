grunt-svg2png [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
===============

[![npm version](https://badge.fury.io/js/grunt-svg2png.svg)](http://badge.fury.io/js/grunt-svg2png)
[![Build Status](https://travis-ci.org/runspired/grunt-svg2png.svg?branch=master)](https://travis-ci.org/runspired/grunt-svg2png)
[![dependencies](https://david-dm.org/runspired/grunt-svg2png.svg)](https://david-dm.org/runspired/grunt-svg2png)
[![devDependency Status](https://david-dm.org/runspired/grunt-svg2png/dev-status.svg)](https://david-dm.org/runspired/grunt-svg2png#info=devDependencies)


## Installation

If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```sh
npm install --save-dev grunt-svg2png
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-svg2png');
```


## Documentation

See the [Gruntfile](Gruntfile.js) in this repo for a full example.


### Example Generating Icons for an iOS Application

```js
grunt.initConfig({

  rasterize : {
    ios : {
      options: {
        sizes : [
          { width : 29, name : 'Icon-Small.png' },
          { width : 40, name : 'Icon-Small-40.png' },
          { width : 58, name : 'Icon-Small@2x.png' },
          { width : 76, name : 'Icon-76.png' },
          { width : 80, name : 'Icon-Small-40@2x.png' },
          { width : 87, name : 'Icon-Small@3x.png' },
          { width : 120, name : 'Icon-Small-40@3x.png' },
          { width : 120, name : 'Icon-60@2x.png' },
          { width : 152, name : 'Icon-76@2x.png' },
          { width : 180, name : 'Icon-60@3x.png' },
          { width : 512, name : 'iTunes@512.png' },
          { width : 1024, name : 'iTunes@1024.png' }
        ]
      },
      files: [
        {
          expand: true,
          cwd: 'graphics/icons',
          src: ['ios.svg'],
          dest : 'ios-prod/'
        },
        {
          expand: true,
          cwd: 'graphics/icons',
          src : ['ios-dev.svg'],
          dest : 'ios-dev/'
        }
      ]
    }
  }

});

grunt.loadNpmTasks("grunt-svg2png");
```

*Tip: the [grunt-newer](https://github.com/tschaub/grunt-newer) module might come in handy if you have a large number of files.*

## License

unlicence
