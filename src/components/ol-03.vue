<template>
<div class="container">
  <h2>{{title}}</h2>
  <div class="map" id="map"></div>
  <div id="popup"><div class="popupStyle">Null Island</div></div>
</div>
</template>

<script>
import ol from 'openlayers'
import 'openlayers/dist/ol.css'

export default {
  data () {
    return {
      title: 'openlayers overlay 拖动',
      map: null
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      let element = document.getElementById('popup')

      let rasterLayer = new ol.layer.Tile({
        // source: new ol.source.TileJSON({
        //   url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
        //   crossOrigin: ''
        // })
        source: new ol.source.OSM()
      })

      this.map = new ol.Map({
        layers: [rasterLayer],
        target: document.getElementById('map'),
        view: new ol.View({
          center: [0, 0],
          zoom: 3
        })
      })

      let popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false,
        dragging: false,
        offset: [0, -50]
      })
      popup.setPosition([0, 0])
      this.map.addOverlay(popup)

      let dragPan
      this.map.getInteractions().forEach(interaction => {
        if (interaction instanceof ol.interaction.DragPan) {
          dragPan = interaction
        }
      })

      element.addEventListener('mousedown', (evt) => {
        dragPan.setActive(false)
        popup.set('dragging', true)
        console.info('start dragging')
      })
      this.map.on('pointermove', (evt) => {
        if (popup.get('dragging')) {
          let dd2 = this.map.getPixelFromCoordinate(evt.coordinate)
          let newX = dd2[0] - 0// 减去偏移量
          let newY = dd2[1] - (-100)
          let newPoint = this.map.getCoordinateFromPixel([newX, newY])
          popup.setPosition(newPoint)
        }
      })
      this.map.on('pointerup', (evt) => {
        if (popup.get('dragging') === true) {
          dragPan.setActive(false)
          console.info('stop dragging')
          popup.set('dragging', false)
        }
      })
    }
  }
}
</script>

<style scoped>
#map {
  position: relative;
}
#popup {
  cursor: pointer;
}
.popupStyle{
    position:relative;
  width:100px;
  height:100px;
  text-align:center;
  line-height:100px;
  color:white;
  background-color:rgba(0,0,0,0.4);
}
</style>
