'use strict';

// Basic template description.
exports.description = 'Simple template to write package.json and set up working directory.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

exports.template = function (grunt, init, done) {

    init.process({}, [
        // Prompt for these values.
        init.prompt('module'),
        init.prompt('name'),
        init.prompt('title'),
        init.prompt('description'),
        init.prompt('version', '1.0.0'),
        init.prompt('author_name', 'The Open University'),
        init.prompt('author_email'),
        init.prompt('author_url'),
        init.prompt('webthumbnail', 'y/N')
        //init.prompt('licenses', 'MIT'),
    ], function (err, props) {

        // Module dependencies
        var join = require("path").join;

        // Empty directories will not be copied, so we need to create them manual
        grunt.file.mkdir(join(init.destpath(), 'build'));
        grunt.file.mkdir(join(init.destpath(), 'src/img'));
        grunt.file.mkdir(join(init.destpath(), 'src/img/not_used'));
        grunt.file.mkdir(join(init.destpath(), 'src/js'));
        grunt.file.mkdir(join(init.destpath(), 'src/css'));
        grunt.file.mkdir(join(init.destpath(), 'src/_sources'));

        // Files to copy (and process)
        var files = init.filesToCopy(props);

        // Add properly-named license files.
        //init.addLicenseFiles(files, props.licenses);

        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {});

        // Generate package.json file, used by npm and grunt.
        init.writePackageJSON('package.json', props, function (pkg, props) {
            pkg.devDependencies = {
                'grunt': '^0.4.5',
                'grunt-contrib-clean': '^0.6.0',
                'grunt-contrib-compress': '^0.11.0',
                'grunt-contrib-concat': '^0.5.0',
                'grunt-contrib-copy': '^0.5.0',
                'grunt-contrib-csslint': '^0.3.1',
                'grunt-contrib-jshint': '^0.10.0',
                'grunt-contrib-uglify': '^0.5.1',
                'grunt-contrib-watch': '^0.6.1',
                'grunt-contrib-cssmin': '^0.10.0',
                'grunt-bower-task': '^0.4.0',
                'grunt-git': '^0.2.14',
                'grunt-open': '^0.2.3',
                'grunt-processhtml': '^0.3.3',
                'grunt-shell': '^1.1.1',
                'grunt-text-replace': '^0.3.12'
            };
            pkg.module = props.module;
			if (props.webthumbnail === 'y/N') {
				pkg.width = '512';
                pkg.webthumbnail = false;
			} else {
				pkg.width = '880';
                pkg.webthumbnail = true;
            }
            pkg.height = '820';
            pkg.vle_sc_path = '\\\\esaki\\lts-common$\\alex_phillips\\';
            pkg.vle_path = 'X:/alex_phillips/';
            pkg.remote_repository = '\\\\esaki\\LTS-Software\\git-repos\\' + props.name + '.git';
            return pkg;
        });

        // All done!
        done();
    });
};