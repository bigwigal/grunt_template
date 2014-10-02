'use strict';

// Basic template description.
exports.description = 'Simple template to write package.json and set up working directory.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

exports.template = function (grunt, init, done) {

    init.process({}, [
        // Prompt for these values.
        init.prompt('name'),
        init.prompt('title'),
        init.prompt('description'),
        init.prompt('version', '1.0'),
        init.prompt('repository'),
        init.prompt('author_name', 'Alex Phillips'),
        init.prompt('author_email', 'alex.phillips@open.ac.uk'),
        init.prompt('author_url', 'http://learn3.open.ac.uk/course/view.php?id=300394'),
        init.prompt('course'),
        init.prompt('width', '880'),
        init.prompt('height', '820'),
        init.prompt('webthumbnail', 'false'),
        init.prompt('av', 'N')
        //init.prompt('remote_repository'),
        //init.prompt('licenses', 'MIT'),
        //init.prompt('jquery_version')
    ], function (err, props) {

        // module dependencies
        var join = require("path").join;

        // empty directories will not be copied, so we need to create them manual
        grunt.file.mkdir(join(init.destpath(), 'build'));
        grunt.file.mkdir(join(init.destpath(), 'release'));
        grunt.file.mkdir(join(init.destpath(), 'src/img'));
        grunt.file.mkdir(join(init.destpath(), 'src/js'));
        grunt.file.mkdir(join(init.destpath(), 'src/css'));

        if (props.av !== 'N') {
            grunt.file.mkdir(join(init.destpath(), 'src/av'));
        }

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
                //'grunt-mkdir': '^0.1.2',
                'grunt-open': '^0.2.3',
                'grunt-processhtml': '^0.3.3',
                'grunt-text-replace': '^0.3.12'
            };
            pkg.width = props.width;
            pkg.height = props.height;
            pkg.course = props.course;
            pkg.webthumbnail = props.webthumbnail;
            pkg.vle_sc_path = '\\\\esaki\\lts-common$\\alex_phillips\\' + props.course;
            pkg.vle_path = 'X:/alex_phillips/';
            pkg.remote_repository = '\\\\esaki\\LTS-Software\\git-repos\\' + props.name;
            return pkg;
        });

        // All done!
        done();
    });
};