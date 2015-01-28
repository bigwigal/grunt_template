module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    install: true,
                    copy: false
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
                        src: ['**/*', '!tmp/**/*']
                    }
                ]
            }
        },
        concat: {
            js: {
                src: ['src/js/**/*.js', '!src/js/jquery*.js', '!src/js/vleapi*.js'],
                dest: 'build/tmp/<%= pkg.name %>.js'
            },
            css: { // Good idea??
                src: ['src/css/**/*.css'],
                dest: 'build/tmp/<%= pkg.name %>.css'
            }
        },
        copy: {
            xml: {
                src: '<%= pkg.name %>.xml',
                dest: 'release/'
            },
            build: {
                expand: true,
                cwd: 'src/',
                src: [
                    '**/*',
                    '!css/**/*',
                    '!js/**/*',
					'js/vleapi*.js',
					'js/jquery*.js',
					'!img/not_used/**/*',
					'!_sources/**/*',
					'!index.html'
                ],
                dest: 'build/',
                filter: 'isFile'
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
                        to: '<%= pkg.title %>'
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
                    'git commit -m "initial commit"'
                ].join('&&')
            }
        },
        uglify: {
            options: {
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');

    //Tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('setup', ['replace', 'bower:install', /*'shell:git_commit'*/]);
    grunt.registerTask('build', ['jshint:beforeconcat', 'csslint:beforeconcat', 'clean:build', 'concat', 'uglify', 'cssmin', 'copy:build', 'processhtml', 'replace:xhtml']);
    grunt.registerTask('release', ['clean', 'build', 'compress', 'copy:release', 'open:learn3', 'open:release']);

};