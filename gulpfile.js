import gulp from 'gulp'
import csso from 'gulp-csso'
import include from 'gulp-file-include'
import htmlmin from 'gulp-htmlmin'
import sync from 'browser-sync'
import { deleteAsync } from 'del'
import concat from 'gulp-concat'
import autoPrefixer from 'gulp-autoprefixer'
import chokidar from 'chokidar'
import dartSass from 'gulp-dart-sass'
import image from 'gulp-image'
const { series, parallel, src, dest, task } = gulp

// Сборка HTML
task('html', async () => {
	src('./src/**.html')
		.pipe(
			include({
				prefix: '@@',
			})
		)
		.pipe(dest('docs'))
})

// Сборка, автопрефиксы, минификация SCSS
task('scss', async () => {
	return src('./src/styles/index.scss')
		.pipe(dartSass().on('error', dartSass.logError))
		.pipe(
			autoPrefixer({
				cascade: false,
			})
		)
		.pipe(csso())
		.pipe(concat('index.css'))
		.pipe(dest('docs'))
})

// Сборка JS
task('js', async () => {
	return src('./src/scripts/*').pipe(dest('docs/scripts'))
})

// Сборка изображений
gulp.task('image', async () => {
	gulp.src('./src/assets/**/**').pipe(image()).pipe(gulp.dest('docs/assets'))
})

gulp.task('fonts', async () => {
	gulp.src('./src/fonts/*').pipe(gulp.dest('docs/fonts'))
})

// Очистка docs папки
task('clear', () => {
	return deleteAsync('docs/*')
})

// Дефолтная таска
task(
	'default',
	series('clear', parallel('html', 'scss', 'js', 'image', 'fonts'))
)

// Watch
const watch = () => {
	sync.init({
		server: {
			baseDir: 'docs',
		},
		reloadOnRestart: false,
	})

	chokidar
		.watch('./src/**/*', {
			ignoreInitial: true,
		})
		.on('all', (event, path) => {
			console.log(`File ${path} has been ${event}`)
			series('html', 'scss', 'js')()
			sync.reload()
		})
}

task('watch', watch)
