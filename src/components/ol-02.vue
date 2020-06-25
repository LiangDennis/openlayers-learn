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
      selectType: 'Point'
    }
  },
  mounted () {
    this.createMap()
    this.map.on('click', (e) => {
      // console.log('地图被点击了')
      // console.log(e)
      this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
        console.log(feature.getGeometry().A)
      })
      // this.map.forEachLayerAtPixel(e.pixel, (layer) => {
      //   console.log(layer)
      // })
    })
  },
  methods: {
    handleTypeChange () {
      this.map.removeInteraction(this.draw) // 移除旧的draw和snap
      this.map.removeInteraction(this.snap)
      this.createDrawSnap() // 创建新的draw和snap
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
    },
    createMap () {
      let raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      })

      this.createSource()
      let vector = this.createLayer()

      this.map = new ol.Map({
        layers: [raster, vector],
        target: 'map',
        view: new ol.View({
          center: [121.3028308866, 31.0164689898],
          projection: 'EPSG:4326',
          // center: [0, 0],
          zoom: 10
        })
      })
      // this.createModify()
      this.createDrawSnap()
    },
    createSource () {
      this.source = new ol.source.Vector()
    },
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
    createModify () {
      let source = this.source
      let modify = new ol.interaction.Modify({source: source}) // 设置线条可以再次被设置
      this.map.addInteraction(modify)
    },
    createDrawSnap () {
      let that = this
      this.draw = new ol.interaction.Draw({
        source: that.source,
        type: that.selectType,
        // 设置draw的时候使用的样式
        style: new ol.style.Style({
          // fill: new ol.style.Fill({
          //   color: '#ff0000'
          // }),
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
    }
  }
}
</script>

<style scoped>
#type {
  margin: 20px 0;
}
</style>
