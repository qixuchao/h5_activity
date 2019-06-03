;
(function (factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['zepto'], factory);
    } else {
      define(function(require, exports, module){
        var $ = require("$")
        factory($)
      })
    }
  } else if (typeof exports === 'object') {
    module.exports = factory(require('zepto'));
  } else {
    factory();
  }
}(function ($) {

  function Validate(el, options) {
    this.$container = $(el);
    this.$options = options;
  }

  /**
   * rule list
   *    1. default 提示
   *        required 不能为空
   *        length   长度
   *            6||[6] 等于6
   *            [6,] 大于等于6
   *            [,6] 小于等于6
   *            [2,6] 2到6之间
   *        match    匹配对应的元素
   *        regExp   正则匹配
   *        @example rv-validate-rule="length:{rule:'[6]',msg:''},
   *                     required:'',match:{rule:'[name=password]',msg:''}
   *                     ,regExp:{rule:'/\d/',msg:''}"
   *
   */
  Validate.prototype = {
    // 错误信息的展示样式
    showPrompt: function (data) {
      var $prompt = $('.prompt');
      $prompt.css({ display: 'block' });
      $prompt.text(data);
      timer = setTimeout(function () {
        $prompt.css({ display: 'none' });
        clearTimeout(timer);
      }, 1500);
    },
    /**
     * 解析规则字符串
     * @param  {String} ruleString 规则字符串
     * @return {Object} 解析之后的规则
     */
    parseRuleString: function (ruleString) {
      var rule, i;
      if (!(ruleString[0] === '{' && ruleString[ruleString.length - 1] === '}')) {
        ruleString = '{' + ruleString + '}'
      }

      //ruleString = ruleString.replace(/'/g,'"');

      rule = (Function('return ' + ruleString))(); //JSON.parse(ruleString)

      for (i in rule) {
        if (typeof rule[i] === 'string') {
          rule[i] = {
            msg: rule[i]
          }
        }
      }
      return rule;
    },
    checkRule: function (value, rule, validateObj) {
      //非空是特殊校验；
      if (rule.required) {
        if (value === '') {
          return validateObj = {
            type: 'required',
            hasErr: true,
            message: rule.required.msg
          }
        }
      }

      if (rule.length) {
        var lenRule = rule.length.rule,
          _rule = lenRule.rule,
          match,
          length = value.length;
        if (+lenRule == lenRule ||
          ((match = lenRule.match(/\[(\d+)\]/)))) {
          if (!(length == match[1])) {
            return validateObj = {
              type: 'length',
              hasErr: true,
              message: '长度不正确;长度必须是' + match[1]
            };
          }

          //大于
        } else if (match = lenRule.match(/\[(\d+),\]/)) {
          if (!(length >= match[1])) {
            return validateObj = {
              type: 'length',
              hasErr: true,
              message: '长度不正确;长度必须是大于' + match[1]
            };
          }

          //小于
        } else if (match = lenRule.match(/\[,(\d+)\]/)) {
          if (!(length <= match[1])) {
            return validateObj = {
              type: 'length',
              hasErr: true,
              message: '长度不正确;长度必须是小于' + match[1]
            };
          }

          //区间
        } else if (match = lenRule.match(/\[(\d+),(\d+)\]/)) {
          if (!(length >= match[1] && length <= match[2])) {
            return validateObj = {
              type: 'length',
              hasErr: true,
              message: '长度不正确;长度必须是' + match[1] + '～' + match[2] + '之间'
            };
          }
        }

      }
      if (rule.regExp) {
        var regExp;
        if (rule.regExp.rule instanceof RegExp) {
          regExp = rule.regExp.rule;
        } else if (typeof(rule.regExp.rule) === 'string') {
          regExp = new RegExp(rule.regExp.rule);
        }
        if (!regExp.test(value)) {
          console.log('phone', value)
          return validateObj = {
            type: 'regExp',
            hasErr: true,
            message: rule.regExp.msg
          };
        }
      }
    },
    addRule: function () {

    },
    /**
     * @return {Array} 检测的错误列表
     */
    execute: function ($target) {
      var checkRuleObj = {};

      var rule = this.parseRuleString($target.attr('rv-validate-rule'));
      return this.checkRule($target.val(), rule, checkRuleObj)
    },
    /**
     * 检查
     * @return {[type]} [description]
     */
    inspect: function () {
      var that = this;
      var checkRuleObj = {};
      var isValidate = false

      //如果容器是input
      if (this.$container[0].tagName === 'INPUT') {
        checkRuleObj = that.execute(this.$container);
      } else {
        this.$container.find('[rv-validate-rule]').each(function (i) {
          var $this = $(this);

          var checkResult = that.execute($this);

          if (checkResult && checkResult.hasErr) {
            isValidate = true
            checkResult.object = $this;
            checkRuleObj =checkResult;
            return false
          }
        });
      }
      checkRuleObj.message && this.showPrompt(checkRuleObj.message);
      return isValidate
    }
  }

  $.fn.validate = function () {
    var _validate = this.data('validate')

    if (!_validate) {
      var option = arguments[0],
        options = $.extend({}, $.fn.validate.defaults, option);

      _validate = new Validate(this[0], options);

      this.data('validate', _validate);
    }
    return _validate
  }

  $.fn.validate.defaults = {}

}));
