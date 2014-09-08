fs = require('fs')
path = require('path')

gulp = require('gulp')
minifyCss = require('gulp-minify-css')
concat = require('gulp-concat')
gutil = require('gulp-util')
jshint = require('gulp-jshint')
uglify = require('gulp-uglify')
sass = require('gulp-sass')
runSequence = require('run-sequence')
templateCache = require('gulp-angular-templatecache')


reportError = (err) ->
  gutil.log err


paths = {
  base: path.join(__dirname, 'public')
  bower: path.join(__dirname, 'public', 'bower')
  src: {}
  dst: {}
}

paths.dst.js = 
  app: path.join(paths.base, '.tmp', 'app.js')
  final: path.join(paths.base, 'app.js')
paths.dst.css = path.join(paths.base, 'app.css')
paths.dst.sass = path.join(paths.base, '.tmp', 'app.css')
paths.dst.ngTemplates = path.join(paths.base, '.tmp', 'ngtemplates.js')
paths.dst.fonts = path.join(paths.base, 'fonts')



paths.src.base = path.join(__dirname, 'public');

paths.src.js = 
  app: [
    path.join(paths.base, 'js', '**', '*.js')
  ]
  final: [
    path.join(paths.bower, 'socket.io', 'socket.io.js')
    path.join(paths.bower, 'jquery', 'dist', 'jquery.js')
    path.join(paths.bower, 'angular', 'angular.js')
    path.join(paths.bower, 'semantic-ui', 'build', 'packaged', 'javascript', 'semantic.js')
    paths.dst.js.app
    paths.dst.ngTemplates
  ]

paths.src.sass = path.join(paths.base,  'sass', '**', '*.scss')
paths.src.css = [
  paths.dst.sass
  path.join(paths.bower,  'semantic-ui', 'build', 'packaged', 'css', 'semantic.css')
]
paths.src.ngTemplates = path.join(paths.base,  'templates', '**', '*.html')
paths.src.fonts = path.join(paths.bower, 'semantic-ui', 'build', 'packaged', 'fonts', 'basic.*')




gulp.task 'sass', ->
  gulp.src paths.src.sass
    .pipe sass(
      onError: reportError
    )
    .pipe concat( path.basename(paths.dst.sass) )
    .pipe gulp.dest( path.dirname(paths.dst.sass) )


gulp.task 'css', ['sass'], ->
  gulp.src paths.src.css
    # .pipe minifyCss()
    .pipe concat( path.basename(paths.dst.css) )
    .pipe gulp.dest( path.dirname(paths.dst.css) )


gulp.task 'fonts', ->
  gulp.src paths.src.fonts
    .pipe gulp.dest(paths.dst.fonts)


gulp.task 'ng-templates', ->
  gulp.src paths.src.ngTemplates
    .pipe templateCache({
      module: 'gimmick.templates'
    })
    .pipe gulp.dest(paths.dst.ngTemplates)


gulp.task 'js-app', ['ng-templates'], ->
  gulp.src paths.src.js.app
    .pipe jshint()
    .pipe jshint.reporter('default')
    .pipe concat( path.basename(paths.dst.js.app) )
    .pipe gulp.dest( path.dirname(paths.dst.js.app) )


gulp.task 'js', ['js-app'], ->
  gulp.src paths.src.js.final
    .pipe uglify()
    .pipe concat( path.basename(paths.dst.js.final) )
    .pipe gulp.dest( path.dirname(paths.dst.js.final) )


gulp.task 'default', ['fonts', 'css', 'js']

