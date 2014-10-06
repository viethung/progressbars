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
                    'js/progressbar.min.js': 'source/js/progressbar.js'
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
        watch: {
            scripts: {
                files: ['./source/js/*.js'],
                //tasks: ['concat', 'uglify', 'concat:with_jquery', 'concat:with_jquery_min', 'copy:timeline'],
                //tasks: ['jshint:js', 'uglify', 'copy:js'],
                tasks: ['uglify', 'copy:js'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['source/sass/*.css', 'css/*.css'],
                //tasks: ['copy:css', 'uglify:css'],
                tasks: ['copy:css'],
                options: {
                    spawn: false
                }
            }
//            ,html: {
//                files: ['./*.htm'],
//                tasks: ['copy:html'],
//                options: {
//                    spawn: false
//                }
//            }
        },
        qunit: {
            all: {
                options: {
                    urls: [
                        //'http://localhost/web/progressbars/',
                        'http://localhost/web/progressbars/test/bar.html'
                    ]
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    //grunt.registerTask('default', ['concat', 'uglify']);
    grunt.registerTask('default', ['watch']);
    //grunt.registerTask('default', ['concat', 'uglify', 'jshint:afterconcat']);
    //grunt.registerTask('default', ['jshint:utils', 'concat', 'uglify']);
};