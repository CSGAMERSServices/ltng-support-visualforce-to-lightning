const gulp = require('gulp');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');

gulp.task('default', function(){
    gulp.watch(['src/public/stylesheets/**/*.scss'], ['sass']);
    gulp.watch(['src/**/*.js'], ['eslint']);
});

//-- useful for verifying a command running
gulp.task('say-hello', function(){
    console.log('hello');
});

//-- run a linter against javascript
gulp.task('eslint', function(){
    return gulp.src([
        'src/**/*.js',
        '!src/public/scripts/lib/**/*.js'
    ])
    .pipe(plumber({
        errorHandler: function( error ){
            console.error(error.message);
            this.emit('end');
        }
    }))
    .pipe(eslint({
        configFile: 'eslint.json'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//-- converts sass (scss) files to css
gulp.task('sass', function(){
    return gulp.src([
        'src/public/stylesheets/**/*.scss'
    ])
    .pipe(plumber({
        errorHandler: function( error ){
            console.error(error.message);
            this.emit('end');
        }
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/public/stylesheets'));
})