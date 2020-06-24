<template>
  <div class="container">
    <h2>{{title}}</h2>
    <input type="number" v-model="distance" style="margin: 0 0 10px;"> <button @click="createMap()">重新渲染地图</button>
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import 'openlayers/dist/ol.css'
import ol from 'openlayers'
export default {
  data () {
    return {
      title: 'openlayers 聚合features',
      distance: 10,
      styleCache: {},
      map: null
    }
  },
  mounted () {
    this.createMap()

    // this.onlyOneMethodToCreateMap()
  },
  methods: {
    // 创建 feature 数据
    createFeatureData () {
      let count = 20
      let e = 4500000
      let feature = new Array(count)
      for (let i = 0; i < count; i++) {
        // for 循环一个个创建feature
        // Point 接收的数据是一个包含两个数值得数组，同时这两个数值是相对于[0, 0]点的位置距离
        const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e]
        // console.log(coordinates)
        feature[i] = new ol.Feature(new ol.geom.Point(coordinates))
      }
      return feature
    },
    // 创建 cluster 聚合数据
    createClusterData () {
      let features = this.createFeatureData()

      let that = this
      let source = new ol.source.Vector({
        features: features
      })

      let clusterSource = new ol.source.Cluster({
        distance: parseInt(that.distance, 10), // 聚合范围，同时将其转换成十进制
        source: source
      })

      let clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function (feature) {
          let size = feature.get('features').length
          let style = that.styleCache[size]
          if (!style) {
            style = new ol.style.Style({ // 创建每个feature的样式
              image: new ol.style.Circle({ // 图片是一个openlayers原生的圆
                radius: 10, // 圆的半径
                stroke: new ol.style.Stroke({ // 这个圆的边
                  color: '#f00'// 圆的边的颜色
                }),
                fill: new ol.style.Fill({ // 对这个圆进行填充
                  color: '#fff' // 填充的颜色
                })
              }),
              text: new ol.style.Text({ // 修改字体的样式
                text: size.toString(), // size表示聚合后圆包括的feature的个数
                fill: new ol.style.Fill({ // 字体的填充颜色
                  color: '#000'
                })
              })
            })
            that.styleCache[size] = style
          }
          return style
        }
      })

      return clusters
    },
    // 创建地图
    createMap () {
      if (this.map) {
        // 1. 想删除原来的地图图层创建新的，这样的需求
        // console.log(this.map.getLayers().a)
        // this.map.removeLayer(this.map.getLayers().a[0])
        // this.map.removeLayer(this.map.getLayers().a[0])
        // 2. 现在的想法是将以前的feature删除，添加新的feature
        console.log(this.map.getFeatures())
      }

      let clusters = this.createClusterData()

      let raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      })

      this.map = new ol.Map({
        layers: [raster, clusters],
        target: 'map',
        view: new ol.View({
          // center: [121.3028308866, 31.0164689898],
          // projection: 'EPSG:4326',
          center: [0, 0],
          zoom: 2
        })
      })
    },
    onlyOneMethodToCreateMap () {
      let count = 20
      let features = new Array(count)
      let e = 4500000
      for (let i = 0; i < count; ++i) {
        let coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e]
        features[i] = new ol.Feature(new ol.geom.Point(coordinates))
      }

      let source = new ol.source.Vector({
        features: features
      })

      let clusterSource = new ol.source.Cluster({
        distance: parseInt(this.distance, 10),
        source: source
      })

      let styleCache = {}
      let clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function (feature) {
          let size = feature.get('features').length
          let style = styleCache[size]
          if (!style) {
            style = new ol.style.Style({
              image: new ol.style.Circle({
                radius: 10,
                stroke: new ol.style.Stroke({
                  color: '#f00'
                }),
                fill: new ol.style.Fill({
                  color: '#3399CC'
                })
              }),
              text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                  color: '#fff'
                })
              })
            })
            styleCache[size] = style
          }
          return style
        }
      })

      console.log(clusters.getSource().getSource().getFeatures())

      let raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      })

      this.map = new ol.Map({
        layers: [raster, clusters],
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 2
        })
      })
      // this.map = Object.freeze(map)
    }
  }
}
</script>
