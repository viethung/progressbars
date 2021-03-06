module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['source/js/progressbar.js'],
                dest: 'source/js/<%= pkg.name %>.concat.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                //eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            beforeconcat: ['Gruntfile.js', '*.js'],
            js: ['js/<%= pkg.name %>.js'],
            afterconcat: ['source/js/<%= pkg.name %>.js']
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                //,compress: true
                //,sourceMap: true
            },
            build: {
                files: {
                    'release/js/progressbar.min.js': 'js/progressbar.js'
                }
            }
        },
        copy: {
            js: {
                files: [
                    {expand: true, flatten: true, src: ['source/js/*'], dest: './js/', filter: 'isFile'}
                ]
            },
            css: {
                files: [
                    {expand: true, flatten: true, src: ['source/sass/*.css'], dest: './css/', filter: 'isFile'}
                ]
            }
        },
        cssmin: {
            minified: {
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'release/css/',
                    ext: '.min.css'
                }]
            }
        },
        htmlmin: {                                     // Task
            release: {  //Release
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'release/index.html': 'index.html'     // 'destination': 'source'
                }
            },
            dev: {//Development
                files: {
                    'release/index.html': 'index.html'
                }
            }
        },
        jasmine: {
            js: {
                src: 'js/**/*.js',
                options: {
                    specs: 'test/**/*.spec.js',
                    template: 'test/progressbar.spec.html',
                    //keepRunner: true,
                    vendor: [
                        'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js',
                        'lib/jquery.smartresize.js'
                    ]
                }
            },
            coverage: {
                src: ['js/**/*.js'],
                options: {
                    specs: ['test/**/*.spec.js'],
                    //keepRunner: true,
                    vendor: [
                        'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js',
                        'lib/jquery.smartresize.js'
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        template: 'test/progressbar.spec.html',
                        coverage: 'coverage/coverage.json',
                        report: {
                            type: 'html',
                            options: {
                                dir: 'coverage'
                            }
                        },
                        thresholds: {
                            lines: 75,
                            statements: 75,
                            branches: 75,
                            functions: 90
                        }
                    }
                }
            }
        },
        watch: {
            jasminetest: {
                files: ['test/**/*.spec.js'],
                //tasks: ['jasmine:js'],
                tasks: ['jasmine:coverage'],
                options: {
                    spawn: true
                }
            },
            scripts: {
                files: ['js/*.js'],
                //tasks: ['concat', 'uglify', 'concat:with_jquery', 'concat:with_jquery_min', 'copy:timeline'],
                //tasks: ['jshint:js', 'uglify', 'copy:js'],
                tasks: ['jasmine:coverage', 'uglify', 'copy:js'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['source/sass/*.css', 'css/*.css'],
                //tasks: ['copy:css', 'uglify:css'],
                tasks: ['copy:css', 'cssmin:minified'],
                options: {
                    spawn: false
                }
            }
            ,html: {
                files: ['*.html'],
                tasks: ['htmlmin:release'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
	//grunt.loadNpmTasks('qunitjs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    //grunt.registerTask('default', ['concat', 'uglify']);
    grunt.registerTask('default', ['watch']);
    //grunt.registerTask('default', ['concat', 'uglify', 'jshint:afterconcat']);
    //grunt.registerTask('default', ['jshint:utils', 'concat', 'uglify']);
};