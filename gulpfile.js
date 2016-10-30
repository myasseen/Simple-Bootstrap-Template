/** Gulpfile setup **/

// Project configuration
var url   = './', // Local Development URL for BrowserSync. Change as-needed.

		files = [	  // watch files
			'**/*.html',
			'**/*.scss',
			'**/*.js',
			'**/*.{png,jpg,gif}'
		],

		src = {
			scss: 'scss/**/*.scss',
			css:  'css/**/*.css',
			html: '**/*.html'
		}

// Load plugins
var gulp 						= require('gulp'),
		browserSync 	= require('browser-sync').create(), // Asynchronous browser loading on .scss file changes
		reload					= browserSync.reload,
		sass 						= require('gulp-sass'),
		autoprefixer 	= require('gulp-autoprefixer'), // Autoprefixing magic
		minifycss 			= require('gulp-uglifycss'),
		uncss					= require('gulp-uncss'),
		filter 						= require('gulp-filter'),
		sourcemaps 	= require('gulp-sourcemaps')
		rename 				= require('gulp-rename'),
		newer 					= require('gulp-newer'),
		concat 				= require('gulp-concat'),
		notify 					= require('gulp-notify'),
		runSequence 	= require('gulp-run-sequence'),
		ignore 					= require('gulp-ignore'), // Helps with ignoring files and directories in our run tasks
		plumber 				= require('gulp-plumber'), // Helps prevent stream crashing on errors
		cache 					= require('gulp-cache'),


/** Browser Sync **/
gulp.task('browser-sync', /*['styles'],*/ function() {
	// initialize browsersync
	browserSync.init(files, {
		// server: true,
		server: url,
		notify: false,
		port: 7000,
		injectChanges: false,
		reloadOnRestart: true
	})
});


/** Styles **/
gulp.task('styles', function () {
	return gulp.src(src.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
		errLogToConsole: true,
		outputStyle: 	'compressed',
		// outputStyle: 'compact',
		// outputStyle: 'nested',
		// outputStyle: 'expanded',
		precision: 10
	}))
	// .pipe(uncss({ html: ( uncssloc ), ignore: ['#cover', '.collapse.in', '.collapsing'] }))
	.pipe(sourcemaps.write({includeContent: false}))
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(autoprefixer('last 2 version', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(sourcemaps.write('.'))
	.pipe(plumber.stop())
	.pipe(gulp.dest(src.css))
	.pipe(filter(src.css)) // Filtering stream to only css files
	// .pipe(reload({stream:true})) // Inject Styles when style file is created
	.pipe(rename({ suffix: '.min' }))
	.pipe(minifycss({
		maxLineLen: 80
	}))
	.pipe(gulp.dest(src.css))
	.pipe(reload({stream:true})) // Inject Styles when min style file is created
	// .pipe(browserSync.stream({match: '**/*.css'}));
	// .pipe(browserSync.stream());
	.pipe(notify({ message: 'Styles task complete', onLast: true }))
});


/** Clean gulp cache **/
gulp.task('clear', function () {
	cache.clearAll();
});


/** Gulp Default Watch Task **/
gulp.task('default', ['styles', 'clear', 'browser-sync'], function () {
	gulp.watch(src.scss, ['styles']);
	// gulp.watch((src.scss).on("change", reload);

	// gulp.watch(src.css, reload);
	/*gulp.watch([src.css]).on("change", function(file) {
		browserSync.reload(file.path);
	})*/

	gulp.watch(src.html).on('change', reload);
});

// require('require-dir')('./gulp'); // to split gulp tasks into separate files.