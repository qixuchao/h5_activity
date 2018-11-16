var bridge = {
  default: this,
  call: function(method, args, cb) {
    var ret = '';
    if (typeof args == 'function') {
      cb = args;
      args = {}
    }
    var arg = {
      data: args === undefined ? null : args
    };
    if (typeof cb == 'function') {
      var cbName = 'dscb' + window.dscb++;
      window[cbName] = cb;
      arg['_dscbstub'] = cbName
    }
    arg = JSON.stringify(arg);
    if (window._dsbridge && window._dsbridge.call) {
      ret = _dsbridge.call(method, arg)
    } else if (window._dswk || navigator.userAgent.indexOf("_dsbridge") != -1) {
      ret = prompt("_dsbridge=" + method, arg)
    }
    return JSON.parse(ret || '{}').data
  },
  hasNativeMethod: function(name, type) {
    return this.call("_dsb.hasNativeMethod", {
      name: name,
      type: type || "all"
    })
  },
  disableJavascriptDialogBlock: function(disable) {
    this.call("_dsb.disableJavascriptDialogBlock", {
      disable: disable !== false
    })
  }
};
! function() {
  if (window._dsf) return;
  var ob = {
    _dsf: {
      _obs: {}
    },
    _dsaf: {
      _obs: {}
    },
    dscb: 0,
    dsBridge: bridge,
    close: function() {
      bridge.call("_dsb.closePage")
    },
    _handleMessageFromNative: function(info) {
      var arg = JSON.parse(info.data);
      var ret = {
        id: info.callbackId,
        complete: true
      };
      var f = this._dsf[info.method];
      var af = this._dsaf[info.method];
      var callSyn = function(f, ob) {
        ret.data = f.apply(ob, arg);
        bridge.call("_dsb.returnValue", ret)
      };
      var callAsyn = function(f, ob) {
        arg.push(function(data, complete) {
          ret.data = data;
          ret.complete = complete !== false;
          bridge.call("_dsb.returnValue", ret)
        });
        f.apply(ob, arg)
      };
      if (f) {
        callSyn(f, this._dsf)
      } else if (af) {
        callAsyn(af, this._dsaf)
      } else {
        var name = info.method.split('.');
        if (name.length < 2) return;
        var method = name.pop();
        var namespace = name.join('.');
        var obs = this._dsf._obs;
        var ob = obs[namespace] || {};
        var m = ob[method];
        if (m && typeof m == "function") {
          callSyn(m, ob);
          return
        };
        obs = this._dsaf._obs;
        ob = obs[namespace] || {};
        m = ob[method];
        if (m && typeof m == "function") {
          callAsyn(m, ob);
          return
        }
      }
    }
  };
  for (var attr in ob) {
    window[attr] = ob[attr]
  };
}();

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

