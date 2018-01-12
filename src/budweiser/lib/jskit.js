import wx from './libs/jweixin';

'use strict';

var jskit = {
    VERSION: '0.2.0',
    isDebug: false
};
var apiHost = window.apiHost || 'http://test.eeknow.cn'

var toString = function(obj) {
    return ({}).toString.call(obj);
};

function isType(type) {
    return function(obj) {
        return toString(obj) === '[object ' + type + ']';
    };
}

var isObject = isType('Object'),
    isString = isType('String'),
    isArray = Array.isArray || isType('Array'),
    isFunction = isType('Function'),
    isUndefined = isType('Undefined');

var ua = window.navigator.userAgent;
jskit.isWechat = /MicroMessenger/i.test(ua);
jskit.isIphone = /iPhone/ig.test(ua);
jskit.isAndroid = /Android|Linux/.test(ua);
jskit.isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/ig.test(ua);


jskit.extends = function() {
    var obj,
        args = arguments,
        i = 1,
        len = args.length,
        src = args[0],
        key;

    //如果只有一个参数则将这个参数合并到当前调用对象上
    if (len === 1) {
        i = 0;
        src = this;
    }
    for (; i < len; i++) {
        if ((obj = args[i])) {
            for (key in obj) {
                src[key] = obj[key];
            }
        }
    }
    return src;
};

var utils = {
    //获得随机字符串，默认16位
    getNonce: function(length) {
        length = length || 16;
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var pos = chars.length;
        var nonces = [];
        var i;
        for (i = 0; i < length; i++) {
            nonces.push(chars.charAt(Math.floor(Math.random() * pos)));
        }
        return nonces.join('');
    },

    /**
     * 解析url
     * @param  {String}  str      需要解析的URL
     * @param {boolean} [isNoCaseSensitive] 是否不区分大小写 default:false 默认是区分的
     *                                      如果值为true，则会全部转成小写
     * @return {String}
     */
    parseUrl: function(str, isNoCaseSensitive) {
        var arr,
            part,
            url = {};
        //去掉首位空格
        if (!(str || '').replace(/^\s+|\s+$/, '')) {
            return {};
        }

        str = str.replace(/\S*\?/, '');

        if (str) {

            if (isNoCaseSensitive) {
                str = str.toLocaleLowerCase();
            }

            arr = str.split('&');
            for (var i in arr) {
                part = arr[i].split('=');
                url[part[0]] = decodeURIComponent(part[1]);
            }
        }
        return url;
    },
    /**
     * 获得当前页面的参数
     * @param {boolean} [isNoCaseSensitive] 是否不区分大小写 default:false 默认是区分的
     * @return {object} [description]
     */
    getUrlObj: function(isNoCaseSensitive) {
        return utils.parseUrl(location.search, false, isNoCaseSensitive);
    },
    /**
     * 将对象url参数化
     * @param  {object} paramObj 参数对象
     * @return {string}          url query param
     */
    param: function(paramObj) {
        var str = [];
        for (var i in paramObj) {
            if (!isUndefined(paramObj[i])) {
                str.push(i + '=' + encodeURIComponent(paramObj[i]));
            }
        }
        return str.join('&');
    },
    /**
     * 增加参数
     *
     * @param {string}  url
     * @param {object}  params
     * @param {boolean} isAddAuth 是否增加认证
     */
    addParam: function(url, params, isAddAuth) {
        var SEARCH_REG = /\?([^#]*)/,
            HASH_REG = /#(.*)/,
            searchStr;

        url = url || '';
        var search = {},
            searchMatch = url.match(SEARCH_REG);

        if (searchMatch) {
            search = utils.parseUrl(searchMatch[0]);
        }

        //合并当前search参数
        search = jskit.extends(search, params);

        if (isAddAuth) {
            search = jskit.extends(search, jskit.utils.getAuthInfo());
        }

        searchStr = '?' + utils.param(search);

        //是否存在search
        if (SEARCH_REG.test(url)) {
            url = url.replace(SEARCH_REG, searchStr);
        } else {
            //是否存在hash
            if (HASH_REG.test(url)) {
                url = url.replace(HASH_REG, searchStr + '#' + url.match(HASH_REG)[1]);
            } else {
                url += searchStr;
            }
        }
        return url;
    }
}


/**
 * 提供简易的loadjs的方法，
 * @param  {string}   url      加载的url
 * @param  {Function} callback 回调函数
 */
var loadJs = function(url, callback) {
    var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');

    script.onload = script.onreadystatechange = script.onerror = function() {
        if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) {
            return;
        }

        script.onload = script.onreadystatechange = script.onerror = null;
        script.src = '';
        script.parentNode.removeChild(script);
        script = null;
        callback && callback();
    };

    script.charset = 'utf-8';
    script.src = url;
    head.appendChild(script);
};

/**
 *
 * @param  {string} url  [description]
 * @param  {object[type]} opts [description]
 */
jskit.jsonp = function(url, opts) {
    var callbackFnName = '_jskit_' + utils.getNonce();

    opts = opts || {};

    window[callbackFnName] = function(data) {
        opts.callback && opts.callback(data || {});
        delete window[callbackFnName];
    };

    var data = opts.data || {};

    //无缓存
    if (opts.cache === false) {
        data.v = utils.getNonce();
    }

    data.callback = callbackFnName;


    loadJs(utils.addParam(url, data));
};


jskit.getToken = function() {
    var params = this.utils.getUrlObj();
    if (params.access_token) {
        var d = new Date();
        d.setTime(d.getTime() + 1000 * 60 * 60 * 2);
        var expires = "expires=" + d.toUTCString();
        document.cookie = 'access_token=' + params.access_token + ';' + expires
        return params.access_token;
    }

    var tokenMatch = document.cookie.match(/access_token=([^;]*)/);
    if (tokenMatch) {
        return tokenMatch[1];
    }
    return null;
}

jskit.extends(jskit, {
    utils: utils
}, {
    open: function(path) {
        return location.href = path;
    },
    toLogin: function(url) {
        if (!url) {
            url = location.href;
        }
        location.href = apiHost + '/Wxlogin/wxScan?ret=' + encodeURIComponent(url);
    },
    /**
     * 打开支付
     * @param  {Object} params 支付参数
     *                         order_id
     *                         order_type
     *                         access_token
     *                         ret   //基本为固定成功页
     *                         backRet 成功页返回地址，避免返回支付页面或订单页
     */
    openPay: function(params) {

        params = jskit.extends({
            //成功回跳地址
            //规则：成功提示页拼接返回页不传递ret成功页不显示返回功能
            //默认方式为跳转至backRet或当期页
            ret: '/pay/complete?ret=' + encodeURIComponent(params.backRet || location.href),
            //成功回调
            success: function() {
                location.href = params.ret;
            },
            error: function() {}
        }, params);

        //jskit.jsonp('http://localhost:3456/pay', {
        jskit.jsonp(apiHost + '/pay', {
            cache: false,
            data: {
                order_id: params.order_id,
                access_token: params.access_token,
            },
            callback: function(res) {
                if (res.code == 1) {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            'appId': res.appId, //公众号名称，由商户传入
                            'timeStamp': res.timeStamp, //时间戳，自1970年以来的秒数
                            'nonceStr': res.nonceStr, //随机串
                            'package': res.package,
                            'signType': res.signType || 'MD5', //微信签名方式:
                            'paySign': res.paySign //微信签名
                        },
                        function(res) {
                            // 使用以上方式判断前端返回,微信团队郑重提示:res.err_msg
                            // 将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                params.success();
                            } else {
                                params.error(res);
                            }
                        });
                } else {
                    params.error(res);
                }
            }
        });
    }
});

if (jskit.isWechat) {
    
    //任务列表
    var taskList = [];
    var menuMap = {
        /*基础类*/
        1: [
            "menuItem:exposeArticle",
            "menuItem:setFont",
            "menuItem:dayMode",
            "menuItem:nightMode",
            "menuItem:refresh",
            "menuItem:profile",
            "menuItem:addContact",
        ],
        /*传播类*/
        2: [
            "menuItem:share:appMessage",
            "menuItem:share:timeline",
            "menuItem:share:qq",
            "menuItem:share:weiboApp",
            "menuItem:favorite",
            "menuItem:share:facebook",
            "menuItem:share:QZone"
        ],
        /*保护类*/
        3: [
            "menuItem:editTag",
            "menuItem:delete",
            "menuItem:copyUrl",
            "menuItem:originPage",
            "menuItem:readMode",
            "menuItem:openWithQQBrowser",
            "menuItem:openWithSafari",
            "menuItem:share:email",
            "menuItem:share:brand",
        ]
    }
    jskit.extends({
        isReady: false,
        /**
         * 任务执行，针对微信存在异步注册功能，导致页面同步会到导致操作失败
         * 将所有依赖注册的方法放到task中，等待初始化成功再执行
         * 不过限定可以异步执行的方式：比如支付页面已经成功，点击支付延迟很久才能执行 这样是不合理的。
         */
        taskExecutor: function(fn) {
            //当不传入方法则直接执行队列
            if (fn) {
                //先将任务加入到队列中
                taskList.push(fn);
            }

            //如果已经准备状态就从头执行所有任务
            if (jskit.isReady) {
                var task;
                while (task = taskList.shift()) {
                    task && task();
                }
            }
        },
        toLogin: function(url) {
            url = url || location.href
            var _url = 'http://budweiserwechat.cagoe.com/Oauth.aspx?OauthType=snsapi_userinfo&Url='+decodeURIComponent(url)
            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe3765c474f61d44f&redirect_uri='+encodeURIComponent(_url) +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        },
        open: function() {},
        //显示分享遮罩引导用户下载
        showShareMask: function() {
            return;
            var id = '_jskit_mask';
            var mask = document.getElementById(id);
            if (!mask) {
                mask = document.createElement('div');
                mask.className = 'wechat-mask show';
                mask.id = id;
                mask.innerHTML = '<div style="position:fixed;z-index:9999;left:0px;top:0px;width:100%;text-align:' +
                    'right;background-color: rgba(20, 20, 20, 0.85);height: 100%;padding-right:30px">' +
                    ' <img width="90%" src="http://biz.isongli.net/wx_mask.png" /></div>';

                (document.body || document.documentElement).appendChild(mask);
            }

            mask.onclick = function() {
                this.style.display = 'none';
            };

            mask.style.display = 'block';
        },
        /**
         * [openShare description]
         * @param  {Object} shareConf 分享参数
         *                        title
         *                        link
         *                        desc
         *                        imgUrl
         *         {Boolean} hideMask 是否隐藏遮罩
         * @return {[type]}           [description]
         */
        openShare: function(shareConf, hideMask) {

            jskit.taskExecutor(function() {
                wx.onMenuShareTimeline(shareConf);
                wx.onMenuShareAppMessage(shareConf);

                if (!hideMask) {
                    jskit.showShareMask();
                }
            });
        },
        previewImg: function(options) {
            //微信图片预览
            wx.previewImage({
                current: options.urls[options.current], // 当前显示的图片链接
                urls: options.urls // 需要预览的图片链接列表
            });
        },
        //隐藏所有非基础按钮接口
        //应用场景在支付或跟用户信息相关的页面关闭分享和从外部链接打开
        //保证页面的完全性
        hideAllNonBaseMenuItem: function() {
            jskit.taskExecutor(wx.hideAllNonBaseMenuItem);
        },
        //显示所有功能按钮接口
        showAllNonBaseMenuItem: function() {
            jskit.taskExecutor(wx.showAllNonBaseMenuItem);
        },
        //http://mp.weixin.qq.com/wiki/11/74ad127cc054f6b80759c40f77ec03db.html#.E9.99.84.E5.BD.953-.E6.89.80.E6.9C.89.E8.8F.9C.E5.8D.95.E9.A1.B9.E5.88.97.E8.A1.A8
        showMenuItems: function(apiList) {
            if (typeof apiList === 'number') {
                apiList = menuMap[apiList]
            }
            jskit.taskExecutor(function() {
                wx.showMenuItems({
                    menuList: apiList
                });
            });
        },
        hideMenuItems: function(apiList) {
            if (typeof apiList === 'number') {
                apiList = menuMap[apiList]
            }
            jskit.taskExecutor(function() {
                wx.hideMenuItems({
                    menuList: apiList
                });
            });
        },
        showOptionMenu: function() {
            jskit.taskExecutor(wx.showOptionMenu);
        },
        hideOptionMenu: function() {
            jskit.taskExecutor(wx.hideOptionMenu);
        },
        initWechat: function(config, readyCallback) {

            var wxCfg = {
                debug: jskit.isDebug,
                //appId: 'wxa06ebe9f39751792',
                //timestamp: null,
                //noncestr: '',
                //signature: '',
                shareConf: {
                    title: '',
                    desc: '',
                    imgUrl: ''
                },
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ],
                menuItemConf: { //
                    menuList: [
                        'menuItem:exposeArticle',
                        'menuItem:setFont',
                        'menuItem:dayMode',
                        'menuItem:nightMode',
                        // 'menuItem:refresh',
                        'menuItem:profile',
                        'menuItem:addContact',

                        /*'menuItem:share:appMessage',
                        'menuItem:share:timeline',
                        'menuItem:share:qq',
                        'menuItem:share:weiboApp',
                        'menuItem:favorite',
                        'menuItem:share:facebook',*/
                        'menuItem:share:QZone',

                        'menuItem:editTag',
                        'menuItem:delete',
                        'menuItem:copyUrl',
                        'menuItem:originPage',
                        'menuItem:readMode',
                        'menuItem:openWithQQBrowser',
                        'menuItem:openWithSafari',
                        'menuItem:share:email',
                        'menuItem:share:brand'
                    ],
                    success: function(res) {
                        console.log(res);
                    },
                    fail: function(res) {

                        wx.showOptionMenu();
                        wx.showAllNonBaseMenuItem();
                    }
                }
            }

            config = jskit.extends(wxCfg, config);

            //获得签名并初始化微信
            jskit.jsonp(apiHost + '/wxlogin/wxJsSdk', {
                data: {
                    url: location.href.split('#')[0]
                },
                cache: false,
                callback: function(res) {
                    if (res.code == 0) {

                        jskit.extends(config,res.data.config);
                        wx.config(config);
                        wx.ready(function() {

                            jskit.isReady = true;

                            jskit.taskExecutor();

                            readyCallback && readyCallback(wx);
                        });

                        wx.error(function(res) {
                            console.log('wx error', res)
                        });
                    }

                    
                }
            });
        }
    });

    setTimeout(function() {
        if (!jskit.isReady) {
            jskit.initWechat();
        }
    });
}


export default jskit;
