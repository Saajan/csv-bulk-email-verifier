/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  eslint = require('gulp-eslint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  del = require('del'),
  browserify = require('gulp-browserify');
// import {output as pagespeed} from 'psi';

// Styles
gulp.task('styles', function() {
  return sass('src/styles/main.scss', {
    style: 'expanded'
  })
    .pipe(autoprefixer(['> 1%']))
    .pipe(gulp.dest('public/dist/styles'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('public/dist/styles'))
    .pipe(notify({
      message: 'Styles task complete'
    }));
});

// Scripts
gulp.task('scripts-custom', function() {
  return gulp.src('src/scripts/custom/main.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/dist/scripts'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/scripts'))
    .pipe(notify({
      message: 'Scripts task for customs is complete'
    }));
});

// Scripts
gulp.task('scripts-vendor', function() {
  return gulp.src([
    'src/scripts/vendor/jquery-3.0.0.js',
    'src/scripts/vendor/mordernizr-3.0.1.js',
    'node_modules/socket.io-client/dist/socket.io.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/dist/scripts'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/scripts'))
    .pipe(notify({
      message: 'Scripts task for vendor is complete'
    }));
});

// Copy
gulp.task('copy', function() {
  return gulp
    .src('src/styles/etc/**/*')
    .pipe(gulp.dest('public/dist/styles/etc'));
});

gulp.task('copy-config', function() {
  return gulp
    .src('config/**/*')
    .pipe(gulp.dest('build/config'));
});

gulp.task('copy-routes', function() {
  return gulp
    .src('routes/**/*')
    .pipe(gulp.dest('build/routes'));
});

gulp.task('copy-public', function() {
  return gulp
    .src('public/**/*')
    .pipe(gulp.dest('build/public'));
});

gulp.task('copy-views', function() {
  return gulp
    .src('views/**/*')
    .pipe(gulp.dest('build/views'));
});

gulp.task('copy-static', function() {
  return gulp
    .src(['app.js', 'favicon.ico', 'package.json'])
    .pipe(gulp.dest('build'));
});

gulp.task('copy-csv', function() {
  return gulp
    .src(['src/static/**/*'])
    .pipe(gulp.dest('public/dist/static'));
});

// gulp.task('copy-script', function() {
//  return gulp
//    .src('src/scripts/vendor/*js')
// //    .pipe(gulp.dest('public/dist/scripts/vendor'));
// });

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('public/dist/images'))
    .pipe(notify({
      message: 'Images task complete'
    }));
});

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    proxy: 'http://localhost:4000'
  });
});

gulp.task('server', function() {
  // configure nodemon
  nodemon({
    // the script to run the app
    script: 'app.js',
    // this listens to changes in any of these files/routes and restarts the application
    watch: ['app.js', 'routes/', 'public/*', 'public/*/**'],
    ext: 'js'
    // Below i'm using es6 arrow functions but you can remove the arrow and have it a normal .on('restart', function() { // then place your stuff in here }
  }).on('restart', () => {
    gulp.src('app.js')
      // I've added notify, which displays a message on restart. Was more for me to test so you can remove this
      .pipe(notify('Running the start tasks and stuff'));
  });
});

// Clean
gulp.task('clean', function() {
  return del(['public/dist/styles', 'public/dist/scripts', 'public/dist/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts-custom', 'scripts-vendor', 'images', 'copy-csv', 'copy', 'watch');
});

// Default task
gulp.task('build', function() {
  gulp.start('copy-routes', 'copy-views', 'copy-public', 'copy-static', 'copy-config');
});

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile'
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb)
);

// Watch
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts-custom', 'scripts-vendor']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['public/dist/**']).on('change', browserSync.reload);

  gulp.watch(['views/**']).on('change', browserSync.reload);
});
