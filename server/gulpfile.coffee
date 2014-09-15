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


paths =
  base: path.join(__dirname, 'public')

paths.src = path.join(paths.base, 'src')
paths.build = path.join(paths.base, 'build')
paths.tmp = path.join(paths.build, '.tmp')
paths.bower = path.join(paths.base, 'bower')

paths.output = {}
paths.input = {}

paths.output.js = 
  app: path.join(paths.tmp, 'app.js')
  final: path.join(paths.build, 'js', 'app.js')
paths.output.css = path.join(paths.build, 'css', 'app.css')

paths.output.ngTemplates = path.join(paths.tmp, 'ngTemplates.js')
paths.output.fonts = path.join(paths.build, 'fonts')

paths.input.js = 
  app: [
    path.join(paths.src, 'js', 'app.js')
    path.join(paths.src, 'js', 'services', '*.js')
    path.join(paths.src, 'js', 'directives', '*.js')
    path.join(paths.src, 'js', 'controllers', '*.js')
  ]
  final: [
    path.join(paths.bower, 'socket.io-client', 'socket.io.js')
    path.join(paths.bower, 'jquery', 'dist', 'jquery.js')
    path.join(paths.bower, 'angular', 'angular.js')
    path.join(paths.bower, 'angular-route', 'angular-route.js')
    path.join(paths.bower, 'semantic-ui', 'build', 'packaged', 'javascript', 'semantic.js')
    paths.output.ngTemplates
    paths.output.js.app
  ]

paths.input.sass = [
  path.join(paths.src, 'sass', 'reset.scss')
  path.join(paths.bower, 'semantic-ui', 'build', 'packaged', 'css', 'semantic.css')
  path.join(paths.src, 'sass', '**', '*.scss')
]

paths.input.ngTemplates = path.join(paths.src,  'ngTemplates', '**', '*.html')
paths.input.fonts = path.join(paths.bower, 'semantic-ui', 'build', 'packaged', 'fonts', 'basic*')

paths.watch =
  ngTemplates: paths.input.ngTemplates
  js: paths.input.js.app
  css: paths.input.sass



gulp.task 'css', ->
  gulp.src paths.input.sass
    .pipe sass(
      onError: reportError
    )
    # .pipe minifyCss()
    .pipe concat( path.basename(paths.output.css) )
    .pipe gulp.dest( path.dirname(paths.output.css) )


gulp.task 'fonts', ->
  gulp.src paths.input.fonts
    .pipe gulp.dest(paths.output.fonts)


gulp.task 'ng-templates', ->
  gulp.src paths.input.ngTemplates
    .pipe templateCache({
      module: 'gimmick.templates'
      standalone: true
    })
    .pipe concat( path.basename(paths.output.ngTemplates) )
    .pipe gulp.dest( path.dirname(paths.output.ngTemplates) )


gulp.task 'js-app', ['ng-templates'], ->
  gulp.src paths.input.js.app
    .pipe jshint()
    .pipe jshint.reporter('default')
    .pipe concat( path.basename(paths.output.js.app) )
    .pipe gulp.dest( path.dirname(paths.output.js.app) )


gulp.task 'js', ['js-app'], ->
  gulp.src paths.input.js.final
    # .pipe uglify()
    .pipe concat( path.basename(paths.output.js.final) )
    .pipe gulp.dest( path.dirname(paths.output.js.final) )


gulp.task 'default', ['fonts', 'css', 'js']

gulp.task 'watch', ['default'], ->
  gulp.watch paths.watch.css, ['css']
  gulp.watch paths.watch.js, ['js']
  gulp.watch paths.watch.ngTemplates, ['js']

