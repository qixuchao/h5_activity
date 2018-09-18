h5活动
======
### 快速使用
```js
// 克隆项目
git clone ssh://git@git.innotechx.com:7999/fac/activity.git
```
```js
// 进入activity项目执行
npm install
```
```js
//
npm run dev

// 项目运行 localhost:9001
```

### 开发流程
说明：当前项目汇总了所有活动页（/src目录下），因为活动将会越来越多，为了方便管理，所以特此梳理开发流程。即每个活动单独的分支管理。
命名规范：
master // 汇总分支
activity/tempalate  // 公用模板
activity/活动1
activity/活动2
activity/活动3...
```js
// 基于当前分支 检出 新活动分支
git fetch

git checkout activity/tempalate

git checkout -b activity/需要新加的活动名称

// 开发即可...
```
