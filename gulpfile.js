//gulp
const gulp = require('gulp')
//replace file paths in html
const htmlreplace = require('gulp-html-replace');
//minify html
const htmlmin = require('gulp-htmlmin');
//convert sass to css
var sass = require('gulp-sass');
//PostCSS gulp plugin to pipe CSS through several plugins, but parse CSS only once.
var postcss = require('gulp-postcss');
//autoprefixer
var autoprefixer = require('autoprefixer');
//optimize css
var cssnano = require('cssnano');
//rename files, add .min
var rename = require('gulp-rename');
//live reload
const browserSync = require('browser-sync').create();

function html() {
    return gulp.src('./src/index.html')
        //replace file paths in html
        .pipe(htmlreplace({
            'css': 'style.min.css',
            'js': 'script.min.js'
        },
            {
                keepBlockTags: false,
            }
        ))
        //minify html
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
}
function style() {
    var plugins = [
        //config in .browserslistrc
        autoprefixer(),
        cssnano()
    ];

    return gulp.src('./src/scss/style.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('./src/css/'))
        //parse CSS once
        //autoprefixer
        //optimization
        .pipe(postcss(plugins))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
}
function watch() {
    browserSync.init({
        server: {
            baseDir: "./src",
            index: "index.html"
        }
    });
    browserSync.reload()
    gulp.watch('src/*.html', html);
    gulp.watch('./src/*.html').on('change', browserSync.reload);
    gulp.watch('src/scss/**/*.scss', style);
    gulp.watch('src/scss/**/*.scss').on('change', browserSync.reload);
}
exports.html = html;
exports.style = style;
exports.watch = watch;