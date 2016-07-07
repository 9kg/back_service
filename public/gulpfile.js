// 获取当前ip
var os = require('os');
var en = os.networkInterfaces().en0 || os.networkInterfaces().en1;
var curIP;
for(var i=0;i<en.length;i++){
    if(en[i].family=='IPv4'){
        curIP = en[i].address;
    }
}

// 引入依赖组件
var gulp = require('gulp'),
    p = require('gulp-load-plugins')(),
    min_png = require('imagemin-pngquant');

// 配置
var base = {
    host_str: '_HOST_',
    host_url: 'http://'+curIP+':5211',
    // host_url_build: 'http://'+curIP+':5211',
    host_url_build: 'http://lz.594211.xyz',
    to_map: '../dev/maps',
    src: 'src',
    dev: 'dev',
    build: 'build'
};
var config = {
    jade_src: base.src+'/**/*.jade',
    less_src: [base.src+'/**/*.less', '!'+base.src+'/css/_temp/**/*.less'],
    css_src: base.dev+'/**/*.css',
    img_src: base.dev+'/**/*.{png,jpg,gif,ico}',
    concat_base_src: [base.src+'/js/base/jquery.js',base.src+'/js/base/base.js',base.src+'/js/base/*.js'],
    concat_chart_src: [base.src+'/js/chart/echarts.js',base.src+'/js/chart/renderChart.js'],
    uglify_src: base.dev+'/**/*.js',
    replace_src: [base.src+'/**/*.{json,jade,js,css}', '!'+base.src+'/js/base/*.js', '!'+base.src+'/js/chart/*.js'],
    replace2build_src: [base.dev+'/**/*.{json,jade}'],
    copy_src: base.src+'/**/*.{png,jpg,gif,ico,eot,svg,ttf,woff,xml}',
    copy2build_src: base.dev+'/**/*.{eot,svg,ttf,woff,xml}',
    del_dev_src: base.dev+"/*",
    del_build_src: base.build+"/*"
};
// 编译less为css
gulp.task('less',function(){
    return gulp.src(config.less_src)
    // .pipe(p.changed('./dev/css', {extension: '.css'}))    todo: 写一个有依赖关系的p.changed插件
    .pipe(p.sourcemaps.init())
    .pipe(p.less())
    .pipe(p.replace(base.host_str,base.host_url))
    .pipe(p.sourcemaps.write(base.to_map,{
        sourceMappingURL: function(file) {
          return base.host_url+'/maps/' + file.relative + '.map';
        }
      }))
    .pipe(gulp.dest(base.dev));
});
// 给css添加浏览器厂商前缀、css中的url添加MD5后缀、压缩css
gulp.task('css',['less'],function(){
    return gulp.src(config.css_src)
    .pipe(p.autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(p.makeCssUrlVersion())
    .pipe(p.cleanCss({
        advanced: true,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        compatibility: '*',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        keepBreaks: false//类型：Boolean 默认：false [是否保留换行]
    }))
    .pipe(p.replace(base.host_url,base.host_url_build))
    .pipe(gulp.dest(base.build));
});
// js代码拼接
gulp.task('concat_base',function(){
    return gulp.src(config.concat_base_src)
    .pipe(p.sourcemaps.init())
    .pipe(p.concat('base.js'))
    .pipe(p.replace(base.host_str,base.host_url))
    .pipe(p.sourcemaps.write('../'+base.to_map, {
        sourceMappingURL: function(file) {
          return base.host_url+'/maps/' + file.relative + '.map';
        }
      }))
    .pipe(gulp.dest(base.dev+'/js'));
});
gulp.task('concat_chart',function(){
    return gulp.src(config.concat_chart_src)
    .pipe(p.sourcemaps.init())
    .pipe(p.concat('chart.js'))
    .pipe(p.replace(base.host_str,base.host_url))
    .pipe(p.sourcemaps.write('../'+base.to_map, {
        sourceMappingURL: function(file) {
          return base.host_url+'/maps/' + file.relative + '.map';
        }
      }))
    .pipe(gulp.dest(base.dev+'/js'));
});
gulp.task('concat',['concat_base','concat_chart']);

// js代码压缩
gulp.task('uglify',['concat'],function(){
    return gulp.src(config.uglify_src)
    .pipe(p.uglify({
        //mangle: true,//类型：Boolean 默认：true 是否修改变量名
        mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
    }))
    .pipe(p.replace(base.host_url,base.host_url_build))
    .pipe(gulp.dest(base.build));
});
// 图片压缩、png图的深度压缩
gulp.task('img',function(){
    return gulp.src(config.img_src)
    .pipe(p.cache(p.imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [min_png()] //使用pngquant深度压缩png图片的imagemin插件
        })))
    .pipe(gulp.dest(base.build));
});
// 复制无需编译的代码 到 dev
gulp.task('copy', function(){
    return gulp.src(config.copy_src, { base: base.src })
    .pipe(p.changed(base.dev))
    .pipe(gulp.dest(base.dev));
});
gulp.task('replace', function(){
    return gulp.src(config.replace_src)
    .pipe(p.replace(base.host_str,base.host_url))
    .pipe(gulp.dest(base.dev));
});
// 复制无需编译的代码 到 build
gulp.task('copy2build',['replace2build'],function(){
    return gulp.src(config.copy2build_src, { base: base.dev })
    .pipe(gulp.dest(base.build));
});
gulp.task('replace2build', ['copy', 'replace'], function(){
    return gulp.src(config.replace2build_src)
    .pipe(p.replace(base.host_url,base.host_url_build))
    .pipe(gulp.dest(base.build));
});

//清空文件夹
gulp.task('del_dev',function(cb){
    return gulp.src(config.del_dev_src,{read: false})
    .pipe(p.clean());
});
gulp.task('del_build',function(cb){
    return gulp.src(config.del_build_src,{read: false})
    .pipe(p.clean());
});
// 监听
gulp.task('watch',function(){
    gulp.watch(config.less_src[0],['less']);
    gulp.watch(config.concat_base_src,['concat_base']);
    gulp.watch(config.concat_chart_src,['concat_chart']);
    gulp.watch(config.replace_src,['replace']);
    gulp.watch(config.copy_src,['copy']);
});
// 默认启动任务
gulp.task('default',function(cb){
    p.sequence('del_dev',['less','concat','replace','copy'],'watch',cb);
});
// 生成到生产环境
gulp.task('build',function(cb){
    p.sequence(['del_dev','del_build'],'copy2build','img',['uglify','css'],cb);
});