import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import ws from "gulp-webserver";
import gpug from "gulp-pug";
import ghPages from "gulp-gh-page";

sass.compiler = require("node-sass");

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "dist",
  },
  css: {
    watch: "src/scss/*",
    src: "src/scss/styles.scss",
    dest: "dist/css",
  },
};

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace",
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.pug.watch, pug);
};

const gh = () => gulp.src("dist/**/*").pipe(ghPages());

const webserver = () => gulp.src("dist").pipe(ws({ livereload: true }));

const clean = () => del(["dist/styles.css", "dist/index.html"]);

const prepare = gulp.series([clean]);

const assets = gulp.series([styles, pug]);

const live = gulp.parallel([watch, webserver]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gh, clean]);
