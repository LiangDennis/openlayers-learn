<template>
  <div class="container">
    <h2>{{title}}</h2>
    <div id="map" class="map"></div>
      <select id="type" v-model="selectType" @change="handleTypeChange">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
        <option value="Circle">Circle</option>
      </select>
      <button @click="createDrawSnap">open draw</button>
      <button @click="removeLayerMethod">remove layer</button>
  </div>
</template>

<script>
import 'openlayers/dist/ol.css'
import ol from 'openlayers'
export default {
  data () {
    return {
      title: 'openlayers 可以移动的features',
      map: null,
      draw: null,
      snap: null,
      selectType: 'Point',
      vectorLayer: null
    }
  },
  mounted () {
    this.createMap()
    // 监听地图点击事件
    this.map.on('click', (e) => {
      if (this.draw && this.selectType === 'Point') { // 防止画线、多边形、圆形的时候点击一次就消失
        this.removeDrawSnap()
      }
      // 通过forEachFeatureAtPixel 的方法，获取点击位置的feature
      this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
        console.log(feature.getGeometry().A) // 获取feature坐标，有没有更好的方式呢？
      })
    })
  },
  methods: {
    // 改变 feature 类型
    handleTypeChange () {
      this.removeDrawSnap()
      this.createDrawSnap() // 创建新的draw和snap
    },
    // 创建地图
    createMap () {
      let raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      })

      this.createSource()
      this.vectorLayer = this.createLayer()

      this.map = new ol.Map({
        layers: [raster, this.vectorLayer],
        target: 'map',
        view: new ol.View({
          center: [121.3028308866, 31.0164689898],
          projection: 'EPSG:4326',
          // center: [0, 0],
          zoom: 10
        })
      })
      this.createDrawSnap()
    },
    // 创建source
    createSource () {
      this.source = new ol.source.Vector()
    },
    // 创建layer vector
    createLayer () {
      let source = this.source
      let vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({ // 填充的颜色，圆或者多边形的内部填充颜色
          fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.2)'
          }),
          stroke: new ol.style.Stroke({ // 线条的样式，和圆和多边形的线条样式
            // color: '#ffcc33',
            color: 'rgb(0, 153, 255)',
            width: 10
          }),
          image: new ol.style.Circle({ // 画出Point的圆的样式
            radius: 50,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
        })
      })
      return vector
    },
    // 重新设置layer vector
    resetLayer () {
      this.vectorLayer = this.createLayer() // 当创建的时候还是同一个source
      this.map.addLayer(this.vectorLayer)
    },
    // 地图交互 图形的拓展
    createModify () {
      let source = this.source
      let modify = new ol.interaction.Modify({source: source}) // 设置线条可以再次被设置
      this.map.addInteraction(modify)
    },
    // 地图交互 draw 绘制各种图形 snap 鼠标吸附
    createDrawSnap () {
      if (this.draw) return alert('draw 已经存在，无需创建')
      if (!this.vectorLayer) {
        this.resetLayer()
      }
      let that = this
      this.draw = new ol.interaction.Draw({
        source: that.source,
        type: that.selectType,
        // 设置draw的时候使用的样式
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({ // 设置draw时的线条或者点的颜色
            color: '#0000ff',
            width: 10
          }),
          image: new ol.style.Circle({ // 设置鼠标的draw标记
            radius: 20,
            fill: new ol.style.Fill({
              color: '#0000ff'
            })
          })
        })
      })
      this.map.addInteraction(this.draw)
      this.snap = new ol.interaction.Snap({source: that.source}) // 鼠标的自动吸附
      this.map.addInteraction(this.snap)
    },
    // 清除draw 和 snap 以便生成新的draw 和 snap
    removeDrawSnap () {
      this.map.removeInteraction(this.draw)
      this.map.removeInteraction(this.snap)
      this.draw = null // 在地图销毁draw和snap后，需要将draw和snap值设置为null，以便判断
      this.snap = null
    },
    // 清除 layer 图层 以及 清除数据
    removeLayerMethod () {
      if (this.vectorLayer) {
        this.removeDrawSnap()
        this.source.clear() // 清除所有的feature
        this.map.removeLayer(this.vectorLayer)
        this.vectorLayer = null
      }
    }
  }
}

// console.log(this.snap.getMap().getLayers()) // 多个layer
// 这个获取到的是Vector对象，同时draw和snap所使用的source都是这个，所以可以获取到features
// console.log(this.snap.getMap().getLayers().a[1].getSource().getFeatures()) // features数组
// 获取到的Layer是Tile对象，其source是OSM对象，并不能获取feature
// console.log(this.draw.getMap().getLayers().a[0].getSource())
// let features = this.snap.getMap().getLayers().a[1].getSource().getFeatures()
// features.forEach(v => {
//   console.log(v.N)
//   console.log(v.getGeometry().A)
//   console.log(v.getGeometry().getProperties())
// })
</script>

<style scoped>
#type {
  margin: 20px 0;
}
</style>
