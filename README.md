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

  #### 创建feature的方式
    1. new ol.Feature(new ol.geom.Point(data))
      1. 此处的 data 是一个包含两个数据的数组，但是不是坐标，而是相对于[0, 0]点的位置距离
      2. 此处的feature是通过一个一个地循环创建的feature
      3. 思考：只能通过for循环一个一个创建吗？

  #### 创建聚合的方式
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

### 第二个openlayers 地图的交互 draw，modify，snap
  #### modify 对象，可以将draw出来后的feature进行拓展，也就是可以再修改
    1. modify对象在创建地图后就可以创建
       1. let modify = new ol.interaction.Modify({source: mySource})
       2. 此处的mySource与地图中的source是同一个对象
    2. 并添加到地图中，添加到地图的方式是使用地图的this.map.addInteraction(modify)的方式
    3. 思考：为什么这个对象只需要创建一遍呢？
  #### draw对象，点击地图根据相应的规则产生相应的feature
    1. 创建的方式  使用vue的方式，这里缓存draw是需要更换feature类型的时候可以清楚这个draw，产生新的形式的draw
       1. this.draw = new ol.interaction.Draw({
         source: mySource, // 也是地图使用的source
         type: feature.type, // feature的类型，主要有：Point, LineString, Polygon, Circle
         style: new ol.style.Style({
           stroke: new ol.style.Stroke({
             color: // 设置draw时的颜色，线条的颜色，和圆与多边形的线条颜色
             width: // 线条的宽度
           }),
           image: new ol.style.Circle({ // 在draw时圆的半径，或者说是鼠标上的draw point 指示的样式
             radius: // 圆的半径
             fill: new style.Fill({
               color: 圆的填充颜色
             })
           })
         })
       })
    2. 添加到地图中 this.map.addInteraction(this.draw)
    3. 思考：draw中设置style的Fill样式是怎么样的呢？有哪些地方能够体现这个属性呢？
  #### snap 对象 设置鼠标的自动吸附功能
    1. 创建方式 this.snap = new ol.interaction.Snap({source: mySource}) // 缓存起来，以便清除
    2. 添加到地图中 this.map.addInteraction(this.snap)
    3. 思考：
       1. 为什么这个snap对象需要使用缓存起来，当改变feature的类型的时候，需要将它清除，然后使用一个新的snap呢？
       2. 为什么不是与modify对象那样，创建一次，添加一次就可以了呢?

  #### feature 的坐标获取
    1. 通过点击事件获取feature
       1. 方法this.map.on('click', (e) => {
         this.map.forEachFeatureAtPixel(e.pixel, () =>  {
           // 通过这种方式获取feature元素
         })
       })
       2. 这种方式获取的feature是一个个的，而不是数组
       3. 如果地图点击上方有多个feature，那么就会一个一个的获取到所有的feature

  #### 尝试一些新功能
    1. 添加当是Point的时候，点一次关闭draw
    2. 添加可以打开draw
    3. 添加关闭layer的功能
    4. 处理layer图层，销毁与创建
    5. 处理source数据，销毁与创建

### 刚学真的是各种写错，写漏api的字母
