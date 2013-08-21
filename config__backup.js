var s_domain = window.GLOBAL.s_domain
    ,isDebug = window.GLOBAL.debug || false
seajs.config({
    plugins: isDebug ? ['shim', 'text', 'style', 'debug', 'nocache'] : ['shim','text','style'],
    paths: {
        gallery: s_domain + "/sea-modules/gallery",
        arale: s_domain + "/sea-modules/arale",
        alice: s_domain + "/sea-modules/alice",
        jquery: s_domain + "/sea-modules/jquery"
    },
    alias: {
        '$': 'jquery/jquery/1.7.2/jquery',
        'jquery': 'jquery/jquery/1.7.2/jquery',
        'store': 'gallery/store/1.3.7/store',
        'confirmbox': 'arale/dialog/1.1.1/confirmbox',
        'handlebars': 'gallery/handlebars/1.0.2/handlebars',
        'templatable': 'arale/templatable/0.9.2/templatable',
        'upload': 'arale/upload/1.0.1/upload',
        'slide': 'arale/switchable/0.9.15/slide',
        'carousel': 'arale/switchable/0.9.15/carousel',
        'json2': 'gallery/json/1.0.3/json',
        'widget': 'arale/widget/1.1.1/widget',
        'validator': 'arale/validator/0.9.5/validator',
        'cookie': 'arale/cookie/1.0.2/cookie',
        'es5-shim': s_domain + '/libs/es5-shim-debug.js', //引用外部开源库
        'global': s_domain + '/common/utils/global',
        'jquery.transform': {
            src: s_domain + '/libs/jquery/jquery.transform-0.9.3.min.js',
            deps: ['jquery']
        },
        'jquery.easing': {
            src: s_domain + '/libs/jquery/jquery.easing.1.3.js',
            deps: ['jquery']
        },
        'jquery.color': {
            src: s_domain + '/libs/jquery/jquery.color.plus-names-2.1.2.min.js',
            deps: ['jquery']
        },
        'jquery.mousewheel': {
            src: s_domain + '/libs/jquery/mousewheel-3.0.6/jquery.mousewheel.js',
            deps: ['jquery']
        },
        'jquery.tmpl': {
            src: s_domain + '/libs/jquery/jquery.tmpl.js',
            deps: ['jquery']
        },
        'jquery.ui': {
            src: s_domain + '/libs/jquery/jquery-ui.min.js',
            deps: ['jquery']
        }
    },
    preload: [
        Function.prototype.bind ? '' : 'es5-shim', //支持ecma5新标准
        window.JSON ? '' : 'json2' //支持JSON
    ],
    debug: isDebug,
    base: s_domain,
    charset: 'utf-8'
});
