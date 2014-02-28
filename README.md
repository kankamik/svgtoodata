# svgtoodata

> Optimise SVG files with DataUri option, make them scalable and automatically create various colorised version. Output in any format.

## Optimized SVG transformed to desired format

svgtoodata is a Grunt.js task that was mainly created to make scalable .svg-files that are optimized and colorized with needed colors. The core use-case was to convert .svg files to DataUri:s with pre-defined color options so that the .svg-files could be used as background-images in css/sass.

Many web pages have UI icons and as the support of icon fonts still lack, SVG is a create option as it scales and is sharp even on retina displays. The problem is performance and complexity what comes to implementation. The approach made possible by svgtoodata is to convert .svg-files to DataUri:s and use them for example as Sass Maps - which is possible because the templating engine Handlebars is supported by this plugin.


## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with by cloning the repository to your project's node_modules. The npm package is coming.

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('svgtoodata');
```

## The "svgtoodata" task

### Overview
In your project's Gruntfile, add a section named `svgtoodata` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  svgtoodata: {
    your_option: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

#### Options
svgtoodata has no default options - all the configuration is provided case-by-case by custon options

#### your_option.options.output
Type: `String`
Default value: `file`

A string to define if to ouput a single file or folder. The folder option is used when .svg-files are only optimized.

#### your_option.options.dataUri
Type: `Boolean`
Default value: `true`

A boolen to define if to convert .svg-files to DataUri:s or not.

#### your_option.options.listname
Type: `String`
Default value: `$default-svg-data`

A string value to be used in Handlebars templating. For example when creating Sass Maps.

#### your_option.options.template
Type: `String`
Default value: `test/template.hbs`

A string value that defines the location of Handlebars template file.

#### your_option.options.color
Type: `String|Object`
Default value: `#333`

A string | object that defines all the colors to which all .svg-files are colorized

#### your_option.files
Type: `Object`
Default value: ``

A object to define the destination-file and all the source files.

### Usage Examples

```js
grunt.initConfig({
  svgtoodata: {
    example_sassmap: {
      options: {
        output: 'file', 
        dataUri: true,
        listname: '$icons_svg_map',
        template: 'example/example.hbs',
        color: {
          black: '#000',
          white: '#000'
        }
      },
      files: {
        'example/dest/_svg_map.scss': ['example/src/*.svg']
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
  }
});
```

## Release History
+ Version 0.0.1: Initial release. Soft testing done, not bulletproof.

## License
Copyright (c) 2014 Mikko Kankaanranta. Licensed under the MIT license.
