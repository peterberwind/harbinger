var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var concat      = require('gulp-concat');
var sourcemaps  = require('gulp-sourcemaps');
var deploy      = require("gulp-gh-pages");

// TODO: Add Growl Notifications
// TODO: Add JS Minification
// TODO: Add Css Minification
// TODO: Add JS Hint
// TODO: Add Img Optimzation

// Variables
var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Jykell Build
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

// Jykell Re-Build
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// BrowserSync
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// Scripts
 gulp.task('scripts', function() {
  return gulp.src('_assets/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('_site/js'))
    .pipe(gulp.dest('js'));
});


// Scss
gulp.task('sass', function () {
    return gulp.src('_assets/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(sourcemaps.write())
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('_site/css'))
        .pipe(gulp.dest('css'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
      '_assets/fonts/*.*'])
    .pipe(gulp.dest('_site/fonts/'));
});

// Images
gulp.task('images', function() {
    return gulp.src([
      '_assets/images/*.*'])
    .pipe(gulp.dest('_site/images/'))
    .pipe(gulp.dest('images'));
});

// Deploy
gulp.task("deploy", ["jekyll-build"], function () {
    return gulp.src("./_site/**/*")
        .pipe(deploy());
});


// Watch
gulp.task('watch', function () {
    gulp.watch('_assets/scss/**/*.scss', ['sass']);
    gulp.watch('_assets/js/**/*.js', ['scripts']);
    gulp.watch('_assets/fonts/**/*.*', ['fonts']);
    gulp.watch('_assets/images/**/*.*', ['images']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*', '_includes/*', '*.md'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch', ]);
