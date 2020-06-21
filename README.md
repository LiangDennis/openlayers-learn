# vue2-demo

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


### 初始化项目 配置eslint 自动修复的功能

### 循环显示所有路由

### 创建第一个openlayers的vue文件
  #### 通过npm镜像下载openlayers@4.6.5版本
    1. 引入ol.css 通过 import 'openlayers/dist/ol.css' 的方式
    2. 通过 引入import ol from 'openlayers'，在代码中使用ol.xxx.yyy的方式使用openlayers中的各个组件
    3. 在使用一个方法创建地图中，如果要获取features内容
       1. 可以在创建的聚合中clusterSource 通过 .getSource().getFeatures() 的方式获取
       2. 而当clusterSource 作为source成为图层layer的数据源时，此时通过创建的图层cluster.getSource().getSource().getFeatures()的方式获取到数据
    4. 可以通过各个方法间的调用了创建

### 创建feature的方式
  1. new ol.Feature(new ol.geom.Point(data))
     1. 此处的 data 是一个包含两个数据的数组，但是不是坐标，而是相对于[0, 0]点的位置距离
     2. 此处的feature是通过一个一个地循环创建的feature
     3. 思考：只能通过for循环一个一个创建吗？

### 创建聚合的方式
  1. 先拿到features的data数据
  2. 使用矢量的source创建feature的source数据
    <code>let source = new ol.source.Vector({ features: featuresData})</code>
  3. 使用cluster 创建聚合
    <code>let clusters = new ol.source.Cluster({
      distance: 10,
      source: source
    })</code>
  4. 思考：
     1. 为什么要使用styleCache换成feature聚合的size大小？
     2. 为什么在layer中使用style，而不是在Cluster中使用style
     3. style的使用场景，使用方式

#### 刚学真的是各种写错，写漏api的字母
