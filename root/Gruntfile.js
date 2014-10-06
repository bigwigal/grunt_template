module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['build/**/*']
            },
            release: {
                src: ["release/**/*"]
            }
        },
        concat: {
            js: {
                src: ['src/js/**/*.js'],
                dest: 'build/js/<%= pkg.name %>.js'
            },
            css: { // Good idea??
                src: ['src/css/**/*.css'],
                dest: 'build/css/<%= pkg.name %>.css'
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
                        src: ['**/*']
                    }
                ]
            }
        },
        copy: {
            build: {
                expand: true,
                cwd: 'src/',
                src: [
                    '**/*',
                    '!css/**/*',
                    '!js/**/*'
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
            src: ['src/css/**/*.css']
        },
        cssmin: {
            build: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    'build/css/style.min.css': ['<%= concat.css.dest %>']
                }
            }
        },
        jshint: {
            options: {
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
                        to: '<%= pkg.title %>'
                    },
                    {
                        from: 'src=""',
                        to: 'src="<%= pkg.vle_sc_path %><%= pkg.name %>.zip"'
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
                    }
                ]
            }
        },
        shell: {
            mk_git_dir: {
                options: {
                    execOptions: {
                        cwd: '//esaki/LTS-Software/git-repos'
                    }
                },
                command: 'mkdir <%= pkg.name %>.git'
            },
            git_init: {
                options: {
                    failOnError: false
                },
                command: 'git init'
            },
            git_clone: {
                command: 'git clone --bare ../<%= pkg.name %> ../<%= pkg.name %>.git'
            },
            git_commit: {
                command: [
                    'git add -A',
                    'git commit -m \'msg\''
                ].join('&&')
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'build/js/app.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        watch: {
            js: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint']
            },
            css: {
                files: ['<%= csslint.src %>'],
                tasks: ['csslint']
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
	grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');

    //Tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('setup', ['replace', 'shell:git_commit']);
    grunt.registerTask('build', ['clean:build', 'jshint', 'csslint', 'concat', 'uglify', 'cssmin', 'copy:build', 'processhtml']);
    grunt.registerTask('release', ['clean:release', 'build', 'compress', 'copy:release']);

};