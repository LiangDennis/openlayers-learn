<template>
  <div class="container">
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import ol from 'openlayers'

export default {
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.initMap()
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
    }
  }
}
</script>

<style>

</style>
