<template>
  <div class="container">
  <h2>{{title}}</h2>
  <div class="map" id="map"></div>
  <button @click="openDragFeature">移动feature</button>
</div>
</template>

<script>
import ol from 'openlayers'
import 'openlayers/dist/ol.css'

export default {
  data () {
    return {
      title: '拖动 feature',
      map: null,
      layer: null,
      feature: null
    }
  },
  mounted () {
    this.initMap()
    this.createLayer()
  },
  methods: {
    initMap () {
      let rasterLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
      })

      this.map = new ol.Map({
        layers: [rasterLayer],
        target: document.getElementById('map'),
        view: new ol.View({
          // center: [0, 0],
          zoom: 3,
          center: [121.3028308866, 31.0164689898],
          projection: 'EPSG:4326'
        })
      })
    },
    // 开启移动feature
    openDragFeature () {
      this.dragFeature(this.map, (obj) => {
        this.featurePosition(obj)
      })
    },
    // 移动后的feature位置
    featurePosition (obj) {
      this.layer.getSource().removeFeature(this.feature)
      this.feature = null
      this.feature = new ol.Feature(new ol.geom.Point(obj.coordinate))
      this.layer.getSource().addFeature(this.feature)
    },
    // 创建layer图层
    createLayer () {
      // let source = new ol.source.Vector()
      let coordinates = ['121.2683382313913', '31.086166762483096']
      this.feature = new ol.Feature(new ol.geom.Point(coordinates))
      this.layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [this.feature]
        })
      })
      this.map && this.map.addLayer(this.layer)
    },
    // 拖动feature
    dragFeature  (_map, _dragEndCallback) {
      console.log(_map)
      let selFeature = null
      _map.on('pointerdrag', function (evt) {
        selFeature = _map.getFeaturesAtPixel(evt.pixel, function (feature) {
          return feature
        })
      })
      let translate = new ol.interaction.Translate({// 拖拽移动interaction
        features: selFeature// 拖拽的为选择的要素
      })
      // _map.encmap.addInteraction(translate)
      _map.addInteraction(translate)
      translate.on('translateend', function (f) {
        if (_dragEndCallback) {
          let obj = {}
          obj.features = f.features
          obj.coordinate = f.coordinate
          _dragEndCallback(obj)// 拖拽完成事件，可以获取拖拽后的要素
        }
        _map.removeInteraction(translate)
      })
    }
    // ————————————————
    // 版权声明：本文为CSDN博主「YOOSHIN」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
    // 原文链接：https://blog.csdn.net/YOOSHIN/java/article/details/103987540
  }
}
</script>

<style scoped>

</style>
