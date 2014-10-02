module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ["build/"]
            },
            release: {
                src: ["release/"]
            }
        },
        concat: {
            js: {
                src: ['src/js/**/*.js', '!vleapi*.js'],
                dest: 'build/js/<%= pkg.name %>.js'
            },
            css: {
                src: ['src/css/**/*.css'],
                dest: 'build/css/<%= pkg.name %>.css'
            }
        },
        compress: {
            main: {
                options: {
                    archive: '<%= pkg.name %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**/*'],
                        dest: 'release/'
                    }
                ]
            }
        },
        copy: {
            build: {
                expand: true,
                cwd: 'src/',
                src: [
                    '*/',
                    'img/**'
                ],
                dest: 'build/',
                filter: 'isFile'
            },
            release: {
                expand: true,
                flatten: true,
                src: ['release/<%= compress.main.options.archive %>',
                    'release/<%= compress.main.options.archive %>.jpg'],
                dest: '<%= pkg.vle_path %>',
                filter: 'isFile'
            },
        },
        csslint: {
            options: {
                ids: false
            },
            src: ['src/css/**/*.css']
        },
        cssmin: {
            build: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    'build/css/app.min.css': ['<%= concat.css.dest %>']
                }
            }
        },
        jshint: {
            build: ['Gruntfile.js', 'src/js/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        open: {
            dev: {
                path: 'src/index.html' //Opens default browser
            },
            canary: {
                path: 'src/index.html',
                app: 'Chrome' //Opens Canary but not the file
            },
            ff: {
                path: 'src/index.html',
                app: 'Firefox'
            },
            ie: {
                path: 'src/index.html',
                app: 'Internet Explorer' //Can't find
            },
            test: {
                path: 'http://learn3.open.ac.uk/mod/oucontent/upload.php'
            }
        },
        processhtml: {
            build: {
                files: {
                    'build/index.xhtml': 'src/index.xhtml'
                }
            }
        },
        replace: {
            xml: {
                src: '<%= pkg.name %>.xml',
                dest: '<%= pkg.name %>.xml',
                replacements: [
                    {
                        from: '##title',
                        to: '<%= pkg.course %>' + ' ' + '<%= pkg.title %>'
                    },
                    {
                        from: 'src=""',
                        to: 'src="\\\\esaki\\lts-common$\\alex_phillips\\<%= pkg.name %>.zip"'
                    },
                    {
                        from: 'id=""',
                        to: 'id="<%= pkg.name %>"'
                    },
                    {
                        from: 'webthumbnail=""',
                        to: 'webthumbnail="<%= pkg.webthumbnail %>"'
                    },
                    {
                        from: 'width=""',
                        to: 'width="<%= pkg.width %>"'
                    },
                    {
                        from: 'height=""',
                        to: 'height="<%= pkg.height %>\"'
                    }
                ]
            },
            html: {
                src: 'src/index.xhtml',
                dest: 'src/index.xhtml',
                replacements: [
                    {
                        from: '##title',
                        to: '<%= pkg.title %>'
                    }
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'build/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-text-replace');

    //Tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('setup', ['replace']);
    grunt.registerTask('build', ['clean:build', 'jshint', 'csslint', 'concat', 'uglify', 'cssmin', 'copy:build', 'processhtml']);
    grunt.registerTask('release', ['clean:release', 'build', 'compress', 'copy:release']);

};