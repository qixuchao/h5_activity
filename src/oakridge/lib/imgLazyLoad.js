/**
 * 图片懒加载
 */
!function (t, e) {
  if( typeof exports === 'object' && typeof module !== 'undefined' ){
    module.exports = e(t)
  } else if(typeof define === 'function'){
    if(define.amd){
      define([], function(){
        'use strict';
        return e(t)
      })
    }else{
      define(function(r,exports,module){
        'use strict';
        module.exports =e(t)
      })
    }
  }else{
    (t = t || self, t.lazyLoad = e(t));
  }
}(this, function (root) {
    'use strict';

    var lazyLoad = {
        version: '1.2.0'
    };

    var callback = function () {};

    var offset, poll, throttle, unload,
        queues = [], //加载队列
        loading = 0,
        maxParallel = 5; //最大并行数

    /**
     * 加载下一张图片
     */
    var loadNextImg = function () {
            //判断是否可以加载下一张图片
        if (loading <= maxParallel) {
            var waitObj = queues.shift();
            //判断是否在可视窗口中，否则优先加载可视图片
            //if(inView(waitObj.elem)){
            if(waitObj){
                loading++;
                waitObj.elem.src = waitObj.src;
                loadNextImg();
            }

                //}else{
                //  loadNextImg();
                //}
        }
    }

    //使用requestAnimationFrame 替代 settimeout 来处理
    var raf = root.requestAnimationFrame || function (fn) {
        clearTimeout(poll);
        poll = setTimeout(fn, throttle);
    }

    /**
     * 判断元素是否在视口中
     * @param  {element} element 图片对象
     * @param  {object}  view 视图及页面显示部分
     * @return {Boolean} 是否在视图中
     */
    var inView = function (element) {
        var view = {
            l: (root.pageXOffset || document.documentElement.scrollLeft) - offset.l,
            t: -offset.t,
            b: window.innerHeight + offset.b,
            r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
        }
        var box = element.getBoundingClientRect();
        return ((box.top >= view.t && box.top < view.b || box.bottom >= view.t && box.bottom < view.b || box.bottom > view.b && box.top < view.t)
            && (box.left >= view.l && box.left < view.r || box.right < view.l && box.right<= view.r || view.l >= box.left && view.r <= box.right))
    };

    /**
     * 判断元素是否显示中
     * @param  {Element} element
     * @return {boolea}  是否显示
     */
    var isShow = function (element) {
        return String.prototype.toLocaleLowerCase.apply(element.style.display) !== 'none'
    }

    var debounce = function () {
        raf(lazyLoad.render);
    };

    lazyLoad.init = function (opts) {
        opts = opts || {
            succClass: '', //加载之后的class
            errClass: '', //加载失败时候的Class
            errSrc: '', //加载失败的错误src
        };
        var offsetAll = opts.offset || 0;
        var offsetVertical = opts.offsetVertical || offsetAll;
        var offsetHorizontal = opts.offsetHorizontal || offsetAll;
        maxParallel = opts.maxParallel || 5;

        var optionToInt = function (opt, fallback) {
            return parseInt(opt || fallback, 10);
        };
        offset = {
            t: optionToInt(opts.offsetTop, offsetVertical),
            b: optionToInt(opts.offsetBottom, offsetVertical),
            l: optionToInt(opts.offsetLeft, offsetHorizontal),
            r: optionToInt(opts.offsetRight, offsetHorizontal)
        };
        throttle = optionToInt(opts.throttle, 250);
        unload = !!opts.unload;
        callback = opts.callback || callback;
        lazyLoad.render();
        if (document.addEventListener) {
            root.addEventListener('scroll', debounce, false);
            root.addEventListener('touchstart', debounce, false);
            root.addEventListener('load', debounce, false);
        }
    };

    lazyLoad.render = function () {
        var nodes = (function () {
            var lazyLoad = [].slice.call(document.querySelectorAll('img[lazy-load]'), 0),
                lazyLoadBackgroud = [].slice.call(document.querySelectorAll('[lazy-load-background]'), 0);

            [].push.apply(lazyLoad, lazyLoadBackgroud);

            return lazyLoad;
        })()

        var length = nodes.length;
        var src, elem;

        var loadError = function (elem) {
            loading--;
            var errImg = elem.getAttribute('lazy-load-placeholder') || 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw==';
            if (elem.getAttribute('lazy-load-way') == 'lazy-load') {
                elem.removeEventListener('error');
                elem.removeEventListener('load');
                elem.src = errImg;
            }
            else if (elem.getAttribute('lazy-load-way') === 'lazy-load-background') {
                elem.style.backgroundImage = 'url(' + errImg + ')';
            }
            elem.removeAttribute('lazy-load-way');
            elem.className += ' lazyload-error ';
        };

        /**
         * 检测加载状态
         * 这里存在两次请求的情况，背景图加载的时候会出现两次。为了检测图片是否被加载成功
         *
         * @param  {Element}   elem  需要添加检测的标签，如果为空，创建一个新的image标签
         * @param  {Function} sucFn [description]
         * @param  {Function} failFn [description]
         */
        var monitorLoad = function (elem, sucFn, failFn, targetElem) {
            if (!elem) {
                elem = new Image();
            }
            elem.addEventListener('load', function () {
                //sucFn(targetElem || this,'load');
                loading--;
                (targetElem || this).removeAttribute('lazy-load-way')
                sucFn.call(targetElem || this, elem.src);
            }, false);

            elem.addEventListener('error', failFn, false);

            return elem;
        }
        var i = 0,
            loadWay,
            placeholderSrc,
            waitElem;
        for (; i < length; i++) {
            waitElem = elem = nodes[i];
            if (isShow(elem) && inView(elem)) {

                //判断是通过什么方式加载
                //如果存在双属性以lazy-load优先
                src = elem.getAttribute('lazy-load');

                loadWay = 'lazy-load'; //加载方式
                placeholderSrc = elem.src;
                if (!src) {
                    src = elem.getAttribute('lazy-load-background');
                    loadWay = 'lazy-load-background';
                    placeholderSrc = elem.style.backgroundImage;
                }

                elem.setAttribute('lazy-load-way', loadWay);

                elem.removeAttribute('lazy-load');
                elem.removeAttribute('lazy-load-background');

                //如果两个链接都为空 则不加载
                /*if(src){
                    return;
                }*/
                ;
                elem.setAttribute('lazy-load-placeholder', placeholderSrc);

                elem.className += ' lazyload ';

                if (loadWay === 'lazy-load') {
                    monitorLoad(elem, function () {
                        callback(this, 'load');
                    }, function () {
                        loadError(this);
                    });

                    elem.src = src;

                }
                else {
                    if(0){
                      elem.style.backgroundImage = 'url(' + src + ')';
                    }else{
                      waitElem = monitorLoad(null, function (src) {
                        this.style.backgroundImage = 'url(' + src + ')';
                        callback(this, 'load');
                      }, function () {
                        loadError(elem);
                      }, elem);
                    }

                }
                // /* queues.push({
                //      elem:new Image()
                //  })*/
                // queues.unshift({
                //     elem: waitElem,
                //     src: src
                // });
                //
                // loadNextImg();
            }
        }
    };

    /**
     * 提供外部API可以手动检查
     */
    lazyLoad.check = debounce;

    lazyLoad.detach = function () {
        if (document.removeEventListener) {
            $(root).off('scroll')
                .off('touchstart');
        }
        /* else {
            root.detachEvent('onscroll', debounce);
        }*/
        clearTimeout(poll);
    };

    root.lazyLoad = lazyLoad;

});
