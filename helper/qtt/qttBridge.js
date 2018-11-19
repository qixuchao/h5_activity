QTTB = (function(){
	var bridge={default:this,call:function(b,a,c){var e="";"function"==typeof a&&(c=a,a={});a={data:void 0===a?null:a};if("function"==typeof c){var g="dscb"+window.dscb++;window[g]=c;a._dscbstub=g}a=JSON.stringify(a);if(window._dsbridge)e=_dsbridge.call(b,a);else if(window._dswk||-1!=navigator.userAgent.indexOf("_dsbridge"))e=prompt("_dsbridge="+b,a);return JSON.parse(e||"{}").data},register:function(b,a,c){c=c?window._dsaf:window._dsf;window._dsInit||(window._dsInit=!0,setTimeout(function(){bridge.call("_dsb.dsinit")},
			0));"object"==typeof a?c._obs[b]=a:c[b]=a},registerAsyn:function(b,a){this.register(b,a,!0)},hasNativeMethod:function(b,a){return this.call("_dsb.hasNativeMethod",{name:b,type:a||"all"})},disableJavascriptDialogBlock:function(b){this.call("_dsb.disableJavascriptDialogBlock",{disable:!1!==b})}};
			!function(){if(!window._dsf){var b={_dsf:{_obs:{}},_dsaf:{_obs:{}},dscb:0,dsBridge:bridge,close:function(){bridge.call("_dsb.closePage")},_handleMessageFromNative:function(a){var e=JSON.parse(a.data),b={id:a.callbackId,complete:!0},c=this._dsf[a.method],d=this._dsaf[a.method],h=function(a,c){b.data=a.apply(c,e);bridge.call("_dsb.returnValue",b)},k=function(a,c){e.push(function(a,c){b.data=a;b.complete=!1!==c;bridge.call("_dsb.returnValue",b)});a.apply(c,e)};if(c)h(c,this._dsf);else if(d)k(d,this._dsaf);
			else if(c=a.method.split("."),!(2>c.length)){a=c.pop();var c=c.join("."),d=this._dsf._obs,d=d[c]||{},f=d[a];f&&"function"==typeof f?h(f,d):(d=this._dsaf._obs,d=d[c]||{},(f=d[a])&&"function"==typeof f&&k(f,d))}}},a;for(a in b)window[a]=b[a];bridge.register("_hasJavascriptMethod",function(a,b){b=a.split(".");if(2>b.length)return!(!_dsf[b]&&!_dsaf[b]);a=b.pop();b=b.join(".");return(b=_dsf._obs[b]||_dsaf._obs[b])&&!!b[a]})}}();

	var qkBridge = {
	  getCommonMsg:function(){
	    if (bridge.hasNativeMethod("getCommonMsg")) {
	      var res = bridge.call("getCommonMsg"); //同步
	      return (res && res.code === 1 && res.data) || ''
	    } else {
	      return (window.qukanClient && window.qukanClient.getCommonMsg && window.qukanClient.getCommonMsg()) || ''
	    }
	  },
	  isCoinVersion:function(){
	    if (bridge.hasNativeMethod("isCoinVersion")) {
	      var res = bridge.call("isCoinVersion"); //同步
	      return (res && res.code === 1 && res.data.value) || ''
	    } else {
	      return (window.qukanClient && window.qukanClient.isCoinVersion && window.qukanClient.isCoinVersion()) || ''
	    }
	  }
	}

	function getTokenInCPC(){
		return window.cpcAndroid && cpcAndroid.fetchInfo('getToken')
	}

	function isCoinVersion(){
		return qkBridge.isCoinVersion()|| window.cpcAndroid && cpcAndroid.fetchInfo('isCoinVersion')
	}

	function getTokenBySchema(){
		var calbackName = 'callbacks_'+Math.random().toString(16).slice(3,9)
		window[calbackName] = function(token){
			delete window[calbackName];
		}
		var url = 'call?target=getToken&callback='+calbackName
		location.href = url
	}

	function geToken(callback){
		callback = callback || function(){{}}
		if(window.cpcAndroid){
			callback(cpcAndroid.fetchInfo('getToken'))
		}else if(window.qukanClient){
			callback(qkBridge.getCommonMsg().token)
		}else{
			getTokenBySchema(callback)
		}
	}

	var qb = {
		version:'1.0.0',
		isCoinVersion:isCoinVersion,
		getToken:geToken,
		isQTT: /qukan/.test(navigator.userAgent)
	}

	return qb
})();