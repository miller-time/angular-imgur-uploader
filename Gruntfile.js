(function() {

    'use strict';

    module.exports = function (grunt) {

        // Load grunt tasks automatically
        require('load-grunt-tasks')(grunt);

        grunt.initConfig({

            watch: {
                js: {
                    files: ['src/**/*.js'],
                    tasks: ['build']
                }
            },

            ngAnnotate: {
                options: {
                    singleQuotes: true
                },
                dist: {
                    files: [
                        {
                            src: ['src/**/*.js'],
                            expand: true,
                            rename: function(destPath, srcPath) {
                                var match = /^src\/(.*)/.exec(srcPath);
                                if (match && match[1]) {
                                    return 'dist/.tmp/' + match[1];
                                } else {
                                    grunt.fail.fatal('error parsing src file: ' + srcPath);
                                }
                            }
                        }
                    ]
                }
            },

            uglify: {
                nonMin: {
                    options: {
                        beautify: true,
                        mangle: false,
                        compress: {
                            negate_iife: false
                        }
                    },
                    files: {
                        'dist/imgur-uploader.js': ['dist/.tmp/**/*.js']
                    }
                },
                min: {
                    options: {
                        beautify: false,
                        mangle: true,
                        compress: {
                            negate_iife: false
                        },
                        sourceMap: true
                    },
                    files: {
                        'dist/imgur-uploader.min.js': ['dist/.tmp/**/*.js']
                    }
                }
            },

            clean: {
                dist: {
                    files: [
                        {
                            dot: true,
                            src: ['dist/.tmp']
                        }
                    ]
                }
            }

        });

        grunt.registerTask('build', [
            'ngAnnotate',
            'uglify',
            'clean'
        ]);

        grunt.registerTask('default', [
            'build',
            'watch'
        ]);

    };

})();
