const { series, src, dest, watch } = require('gulp');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
// var sass = require('gulp-sass');
// var autoprefixer = require('gulp-autoprefixer');

// function sass() {
//     src('static/sass/**/*.scss')
//     .pipe(sass().on('erroe',sass.logError))
//     .pipe(autoprefixer({
//         browsers: ['last 2 versions'],
//         cascade: false
//     }))
//     .pipe(dest('static/styles'))
//     // .pipe(browserSync.reload({stream:true}));
//     done();
// }

gulp.task('sass',function(done){
    gulp.src('static/sass/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('static/styles'));
    done();
})

gulp.task('serve',function(){
    browserSync.init({
        server: {
            baseDir: ['./'],
            index: 'index.html'
        }
    });
    watch('static/sass/**/*.scss',gulp.series('sass'));
    watch(['./*.*', './styles/*.css', './scripts/*.js']).on("change", reload);
})

gulp.task('default',gulp.series('serve'));


// gulp.task('default', gulp.series('serve'));
//
// // Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
//     sass('static/sass/**/*.scss')
//         .on('error',function(err) { console.log(err.message); })
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false
//         }))
//         .pipe(gulp.dest('static/styles'))
//         // .pipe(browserSync.stream());
// });
//
// // Static Server + watching scss/html files
// gulp.task('serve', function() {
//
//     browserSync.init({
//         server: {
//             // baseDir: ['template','static']
//             baseDir: ['./template', './'],
//             index: 'index.html'
//         }
//     });
//
//     gulp.watch(['./template/*.*', './static/styles/*.css', './static/scripts/*.js']).on("change", reload);
// });
