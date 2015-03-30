// Modules
// =======

// General
var gulp           = require('gulp');
var gulpif         = require('gulp-if');
// Parse CLI commands, used for dev & prod arguments
var minimist       = require('minimist');
// Gives nice notifications
var notify         = require('gulp-notify');
// Reload browser or inject styles on change
var livereload     = require('gulp-livereload');
// Filter files
var filter         = require('gulp-filter');
// Concat files into array
var concat         = require('gulp-concat');
// Source maps for development
var sourcemaps     = require('gulp-sourcemaps');

// Styles
var sass           = require('gulp-sass');
var autoprefixer   = require('gulp-autoprefixer');
var minifycss      = require('gulp-minify-css');
//var sassdoc        = require('sassdoc');

// JavaScript
var jshint         = require('gulp-jshint');
var uglify         = require('gulp-uglify');

// Images
var imagemin       = require('gulp-imagemin');


// CLI Options
// ===========
var options = minimist(process.argv.slice(2));


// Paths
// =====

// Define default destination folder
var publicPath = 'web/';

// Define Assets path
var assetsPath = 'src/IP/UserBundle/Resources/assets/';

// Define JS Path
var JSPath = 'src/IP/UserBundle/Resource/js/';

// Define location of Bower config files
var bowerPath = 'vendor/bower_components/';


// Actions
// =======

// Stylesheets
gulp.task('styles', function() {
    var customStyles = [assetsPath + 'sass/*.scss'];

    // vendor assets may also be called from custom app.scss
    gulp.src(customStyles)
        .pipe(sourcemaps.init())
        //.pipe(sassdoc())
        .pipe(sass({
            errLogToConsole: false,
            onError: function(err) {
                return notify().write(err.message + ' in ' + err.file + ':' + err.line);
            }
        }))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(concat('app.css'))
        .pipe(gulpif(options.env === 'production', minifycss()))
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest(publicPath + 'css'))
        .pipe(notify({ message: 'Styles task complete' }))
        .pipe(livereload());
});

// JavaScript
gulp.task('scripts', function() {
    var jQuery      = [bowerPath + 'jquery/dist/jquery.js'];
    var bootstrapJs = [bowerPath + 'bootstrap-sass-official/assets/javascripts/bootstrap.js'];
    var customJs    = [JSPath + '*.js'];

    // Hints on custom js
    gulp.src(customJs)
        .pipe(jshint())
        // Use gulp-notify as jshint reporter
        .pipe(notify(function (file) {
            if (file.jshint.success) return false;

            var errors = file.jshint.results.map(function (data) {
                if (data.error) {
                    return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
                }
            }).join("\n");
            return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
        }));

    // Build js from custom + libs
    gulp.src(jQuery.concat(bootstrapJs).concat(customJs))
        .pipe(filter('*.js'))
        .pipe(concat('app.js'))
        .pipe(gulpif(options.env === 'production', uglify()))
        .pipe(gulp.dest(publicPath + '/js'))
        .pipe(notify('JS compiled'))
        .pipe(livereload());
});


// Images
gulp.task('images', function() {
    var customImages  = [assetsPath + 'images/*.{png,gif,jpg}'];

    gulp.src(customImages)
        .pipe(imagemin())
        .pipe(gulp.dest(publicPath + '/images'))
        .pipe(livereload());
});

// Fonts
gulp.task('fonts', function() {
    var glyphicons  = [bowerPath + 'bootstrap-sass-official/assets/fonts/bootstrap/**/*.{woff,woff2,eot,svg,ttf}'];
    var customFonts = [assetsPath + 'fonts/**/*.{woff,woff2,eot,svg,ttf}'];

    gulp.src(glyphicons)
        .pipe(gulp.dest(publicPath + 'fonts/bootstrap/'));

    gulp.src(customFonts)
        .pipe(gulp.dest(publicPath + '/fonts'))
        .pipe(livereload());
});

// Uploads
gulp.task('uploads', function()
{
    gulp.src(publicPath + 'uploads/*.{png,gif,jpg}')
        .pipe(imagemin());
});

// Views
gulp.task('views', function() {
    gulp.src('src/IP/UserBundle/Resources/views/**/*.twig')
        .pipe(livereload());
});

// Watch
gulp.task('watch', function () {
    livereload.listen();

    gulp.watch(assetsPath + 'sass/**/*.scss', ['styles']);
    gulp.watch(JSPath + '**.js', ['scripts']);
    gulp.watch(assetsPath + 'images/**', ['images']);
    gulp.watch('resources/views/**/*.php', ['views']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);
