/*
 * svgtoodata
 * 
 *
 * Copyright (c) 2014 Mikko Kankaanranta
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    // Configuration that will be passed directly to SVGO
    var svgoOptions = {
        plugins: [
            { removeViewBox: false }
        ]
    };

    var SVGO = new (require( 'svgo' ))(svgoOptions),
        Handlebars = require( 'handlebars' ),
        pattern = /fill=['|"]#[A-Za-z0-9]*['|"]/,
        UriPrefix = "data:image/svg+xml;charset=US-ASCII,";

    grunt.registerMultiTask('svgtoodata', 'Optimise SVG files with DataUri option, make them scalable and automatically create various colorised version. Output in any format', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            output: 'file',
            dataUri: true,
            listname: '$default-svg-data',
            template: 'test/template.hbs',
            color: '#333333'
        });

        var TemplateData = {
            ListName: options.listname,
            Files: []
        };

        var storage = [],
            colors = typeof options.color === 'object' ? true : false;

        if( options.template && options.output === 'file' ) {

            grunt.log.writeln('Writing Icons to file. Reading Handlebars template...');

            var source = grunt.file.read( options.template ).toString( 'utf-8' );
            var template = Handlebars.compile( source );
        }

        function _extend() 
        {
            var args = arguments;
            for(var i=1; i<args.length; i++)
            {
                for(var key in args[i])
                {
                    if(args[i].hasOwnProperty(key))
                    {
                        args[0][key] = args[i][key];
                    }
                }
            }
            
            return args[0];
        }

        function _extendcolor( key, value, obj )
        {
            var a = [],
                b = {};

            obj.forEach( function( o ) 
            {   
                b['color'] = {
                    name: key,
                    value: value
                };
                b = _extend( {}, b, o );

                a.push(b);
            });

            return a;
        }

        function _colorizecl( filedata, color )
        {
            return filedata
                // Replace the fill color with option color
                .replace( pattern, 'fill="'+color+'"' )
                // Replace the width with 100%
                .replace( /width=['|"][0-9]*['|"]/, 'width="100%"' )
                // Replace the height with 100%;
                .replace( /height=['|"][0-9]*['|"]/, 'height="100%"' );
        }

        function _optimize( obj, end, filedest )
        {
           SVGO.optimize( obj.filedata, function ( result ) 
            {

                obj.filedata = !options.dataUri ? result.data : UriPrefix + encodeURIComponent( result.data.toString('utf-8')
                    //strip newlines and tabs
                    .replace( /[\n\r]/gmi, "" )
                    .replace( /\t/gmi, " " )
                    //strip comments
                    .replace( /<\!\-\-(.*(?=\-\->))\-\->/gmi, "" )
                    //replace
                    .replace( /'/gmi, "\\i") );

                storage.push( obj );

                if( end )
                {
                    _writeend( filedest );
                }
            });
        }

        function _process( data, filedest )
        {
            var l = data.length;

            data.forEach( function( obj ) {

                l--;
                // Optimize and colorize
                obj.filedata = _colorizecl( obj.filedata, obj.color.value );
                obj.filename = obj.filename.replace( '.svg', '' );
                // Convert to datauri or just optimize
                // Tell the SVGO task to callback when all 
                // objects are done
                _optimize( obj, !l ? true : false , filedest );

            });
        }

        function _writeend( filedest )
        {
            if( colors )
            {   
                var objByColor = {};

                // Sort to objects with the color name as key
                storage.forEach( function( obj )
                {
                    if( !objByColor.hasOwnProperty( obj.color.name ) )
                    {
                        objByColor[ obj.color.name ] = [];
                    }

                    objByColor[ obj.color.name ].push( obj );

                });

                // Push the object to tempalate data objects
                for( var key in objByColor )
                {
                    TemplateData.Files.push( {
                        Name: key,
                        Files: objByColor[ key ]
                    } );
                }                
            }
            else 
            {
                storage.forEach( function( obj )
                {
                    TemplateData.Files.push( obj );
                });
            }

            if( options.template && options.output === 'file') {

                grunt.log.writeln( "Data Conversion done. Counting " + TemplateData.Files.length + " objects." );
                grunt.file.write( filedest, template( TemplateData ) );
            }

            if( !options.template && options.output === 'folder' ) {
                grunt.log.writeln('Writing optimized files to folder: ' + filedest );

                TemplateData.Files.forEach( function( obj ) {

                    if( !obj.hasOwnProperty( 'Files' ) && obj.hasOwnProperty( 'filename' ) && obj.hasOwnProperty( 'filedata' ) )
                    {
                        grunt.file.write( filedest + '/' + obj.filename + '.svg', obj.filedata );   
                    }
                    
                });
                
            }
        }

        //Iterate over all specified file groups.
        this.files.forEach( function ( file ) {
        
            // 1. Map files to name and data string objects
            var src = file.src.filter( function ( filepath ) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) 
                {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    
                    return false;
                } 
                else 
                {
                    return true;
                }
            
            }).map( function ( filepath ) {
                
                var filenameArr = filepath.split('/'),
                    filename = filenameArr[filenameArr.length - 1],
                    filedata = grunt.file.read( filepath );
                
                return {
                    filename: filename,
                    filedata: filedata
                };
            });

            // 2. Create normalized data array
            var tempData = [];

            // 2.1 Color option is an object
            if( colors )
            {   
                for( var name in options.color )
                {   
                    tempData = tempData.concat( _extendcolor( name, options.color[ name ], src ) );
                }
            }
            // 2.2 Color options is a string
            else
            {
                tempData = tempData.concat( _extendcolor( 'none', options.color, src ) );
            }

            // 3. Optimize, colorize the data and write.
            _process( tempData, file.dest );
        
            // grunt.log.writeflags( obj );
            // grunt.log.writeln( str );

        });        

    });
};