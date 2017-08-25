var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var autoprefixer = require("gulp-autoprefixer");
var cleanCss = require("gulp-clean-css");
var gulpIf = require("gulp-if");
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();

var config = {
    paths: {
        scss: "./public/sass/**/*.scss",
        html: "./public/index.html"
    },
    output: {
        cssName: "./css/ind.min.css",
        path: "./public"
    },
    isDevelop: true
};

gulp.task("scss", function () {
    return gulp.src(config.paths.scss)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(sass())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());
});

gulp.task("server", function () {
    browserSync.init({
        server: {
            baseDir: config.output.path
        }
    });
    
    gulp.watch(config.paths.scss, ["scss"]);
    gulp.watch(config.paths.html).on("change", browserSync.reload);
});

gulp.task("default", ["scss", "server"]);
