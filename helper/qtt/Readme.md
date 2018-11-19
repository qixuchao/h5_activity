### 趣头条jsBridge 实现方案
由于趣头条的特殊性，不同版本之间，环境之间的差异。bridge使用两种方式（桥接和协议）三个接口（老版协议接口，新版桥接接口，cpc广告接口）实现。

#### 协议 【异步】
	采用url拦截策略实现，ios和android 分别以内置 `call` path 做为标记拦截，`target`参数调用实际方法名称,`callback` 将作为jsonp的方式进行回调。
```
	call?target=getToken&callback=cb
```

#### 交接 【同步】
	采用`dsbridge` js 对象注入的方式全局对象，同步调用内置方法。
```js
	window.cpcAndroid.fetchInfo('getToken')
```   

基于上述的几个差异化的内容进行的封装，将代码统一调整为异步代码

### Usage
```html
	<script type="text/javascript" src="./qttBridge.js"></script>
```
- dsbridge.js     dsbridge 基本类库
- qttBridge.js    qttBridge 都方式封装