module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'bower-install-simple': {
            options: {
                color: true,
                directory: 'bower_components'
            },
            'prod': {
                options: {
                    production: true
                }
            },
            'dev': {
                options: {
                    production: false
                }
            }
        },
        clean: {
            build: {
                src: ['build/**/*']
            },
            release: {
                src: ['release/**/*', '!release/<%= pkg.name %>.zip.jpg', '!release/<%= pkg.name %>.xml']
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'release/<%= pkg.name %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/',
                        src: ['**/*', '!**/tmp/**']
                    }
                ]
            }
        },
        concat: {
            js: {
                src: ['src/js/**/*.js', '!src/js/vendor/**/*.js'],
                dest: 'build/tmp/<%= pkg.name %>.js'
            },
            css: { // Good idea??
                src: ['src/css/**/*.css', '!src/css/vendor/**/*.css'],
                dest: 'build/tmp/<%= pkg.name %>.css'
            },
            jquery: {
                files: {
                    'src/js/vendor/jquery.min.js': ['bower_components/jquery/dist/jquery.min.js']
                }
            }
        },
        copy: {
            build: {
                expand: true,
                cwd: 'src/',
                src: [
                    //'**/*',
                    'index.xhtml',
                    'css/vendor/**/*',
                    'data/**/*',
                    'img/**/*',
                    '!img/not_used/**/*',
                    'js/vendor/**/*',
                    'vleapi*.js'
                    //'!css/**/*',
                    //'!js/**/*',
					//'js/jquery*.js',
					//'!_sources/**/*',
					//'!index.html'
                ],
                dest: 'build/',
                filter: 'isFile'
            },
            html: {
                src: 'src/index.xhtml',
                dest: 'src/index.html'
            },
            release: {
                expand: true,
                flatten: true,
                src: ['<%= compress.main.options.archive %>',
                    '<%= compress.main.options.archive %>.jpg'],
                dest: '<%= pkg.vle_path %>',
                filter: 'isFile'
            }
        },
        csslint: {
            options: {
                ids: false
            },
            beforeconcat: ['<%= concat.css.src %>'],
            afterconcat: ['<%= cssmin.build.dest %>']
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                src: ['<%= concat.css.dest %>'],
                dest: 'build/css/<%= pkg.name %>.min.css'
            }
        },
        jshint: {
            options: {
				scripturl: true,
				loopfunc: true,

                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            },
            gruntfile: ['Gruntfile.js'],
            beforeconcat: ['<%= concat.js.src %>'],
            afterconcat: ['<%= concat.js.dest %>']
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
            learn2: {
                path: 'https://learn2.open.ac.uk/mod/oucontent/upload.php'
            },
            learn3: {
                path: 'http://learn3.open.ac.uk/mod/oucontent/upload.php'
            },
            commons: {
                path: '<%= pkg.vle_sc_path %>'
            },
            release: {
                path: 'release'
            }
        },
        processhtml: {
            build: {
                files: {
                    'build/index.xhtml': 'build/index.xhtml'
                }
            }
        },
        replace: {
            bower: {
                src: 'bower.json',
                dest: 'bower.json',
                replacements: [
                    {
                        from: '##jquery_version',
                        to: '<%= pkg.jquery_version %>'
                    }
                ]
            },
            xml: {
                src: 'release/<%= pkg.name %>.xml',
                dest: 'release/<%= pkg.name %>.xml',
                replacements: [
                    {
                        from: '##title',
                        to: '<%= pkg.title %>'
                    },
                    {
                        from: 'src=""',
                        to: 'src="<%= pkg.vle_sc_path %><%= pkg.name %>.zip"'
                    },
                    {
                        from: 'id=""',
                        to: 'id="X_<%= pkg.name %>"'
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
                        to: 'height="<%= pkg.height %>"'
                    }
                ]
            },
            html: {
                src: 'src/index.xhtml',
                dest: 'src/index.xhtml',
                replacements: [
                    {
                        from: '##title',
                        to: '<%= pkg.description %>'
                    },
                    {
                        from: 'app.min.js',
                        to: '<%= pkg.name %>.min.js'
                    },
                    {
                        from: 'style.min.css',
                        to: '<%= pkg.name %>.min.css'
                    }
                ]
            },
			xhtml: {
                src: 'build/index.xhtml',
                dest: 'build/index.xhtml',
                replacements: [
                    {
                        from: '.css">',
                        to: '.css" />'
                    }
                ]
            }
        },
        shell: {
            git_commit: {
                command: [
                    'git add -A',
                    'git commit -m "initial commit"',
                    'git push origin master'
                ].join('&&')
            }
        },
        uglify: {
            options: {
				preserveComments: false,
                compress: {
                    drop_console: true,
                    pure_funcs: [/*'console.log'*/] // will remove any unwanted vars/funcs
                },
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                src: ['<%= concat.js.dest %>'],
                dest: 'build/js/<%= pkg.name %>.min.js'
            }
        },
        watch: {
            js: {
                files: ['<%= jshint.beforeconcat %>'],
                tasks: ['jshint:beforeconcat']
            },
            css: {
                files: ['<%= csslint.beforeconcat %>'],
                tasks: ['csslint:beforeconcat']
            }
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
    /*grunt.loadNpmTasks('grunt-contrib-watch');*/
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');

    //Tasks
    grunt.registerTask('default', [
        'build'
    ]);
    grunt.registerTask('bower', [
        'bower-install-simple:prod',
        'concat:jquery'
    ]);
    grunt.registerTask('setup', [
        'replace:bower',
        'replace:html',
        'replace:xml',
        'bower'
        /*'shell:git_commit'*/
    ]);
    grunt.registerTask('html', [
        'copy:html'
    ]);
    grunt.registerTask('build', [
        'jshint:beforeconcat',
        'csslint:beforeconcat',
        'clean:build',
        'concat',
        'uglify',
        'cssmin',
        'copy:build',
        'processhtml',
        'replace:xhtml', //fix for processhtml
        'html'
    ]);
    grunt.registerTask('release', [
        'build',
        'clean:release',
        'compress',
        'copy:release'
    ]);
    grunt.registerTask('upload', [
        'open:learn3',
        'open:release'
    ]);


};