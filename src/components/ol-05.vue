<template>
  <div class="container">
    <div class="map" id="map"></div>
    <div id="info">No countries selected</div>
    <img :src="image" alt="">
  </div>
</template>

<script>
import ol from 'openlayers'

export default {
  data () {
    return {
      map: null,
      image: require('../images/logo.png')
    }
  },
  mounted () {
    this.createDemo()
  },
  methods: {
    createDemo () {
      let vectorSource = new ol.source.Vector({
        url: `/static/countries.geojson`,
        format: new ol.format.GeoJSON()
      })

      this.map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          new ol.layer.Vector({
            source: vectorSource
          }) ],
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          constrainRotation: 16
        })
      })

      // a normal select interaction to handle click
      let select = new ol.interaction.Select()
      this.map.addInteraction(select)

      let selectedFeatures = select.getFeatures()
      console.log(selectedFeatures)
      // a DragBox interaction used to select features by drawing boxes
      let dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.platformModifierKeyOnly
        // condition: platformModifierKeyOnly
      })

      this.map.addInteraction(dragBox)

      dragBox.on('boxend', function () {
        // features that intersect the box geometry are added to the
        // collection of selected features

        // if the view is not obliquely rotated the box geometry and
        // its extent are equalivalent so intersecting features can
        // be added directly to the collection
        let rotation = this.map.getView().getRotation()
        let oblique = rotation % (Math.PI / 2) !== 0
        let candidateFeatures = oblique ? [] : selectedFeatures
        let extent = dragBox.getGeometry().getExtent()
        vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
          candidateFeatures.push(feature)
        })

        // when the view is obliquely rotated the box extent will
        // exceed its geometry so both the box and the candidate
        // feature geometries are rotated around a common anchor
        // to confirm that, with the box geometry aligned with its
        // extent, the geometries intersect
        if (oblique) {
          let anchor = [0, 0]
          let geometry = dragBox.getGeometry().clone()
          geometry.rotate(-rotation, anchor)
          let extent$1 = geometry.getExtent()
          candidateFeatures.forEach(function (feature) {
            let geometry = feature.getGeometry().clone()
            geometry.rotate(-rotation, anchor)
            if (geometry.intersectsExtent(extent$1)) {
              selectedFeatures.push(feature)
            }
          })
        }
      })

      // clear selection when drawing a new box and when clicking on the map
      dragBox.on('boxstart', function () {
        selectedFeatures.clear()
      })

      let infoBox = document.getElementById('info')

      selectedFeatures.on(['add', 'remove'], function (e) {
        console.log(e)
        let names = selectedFeatures.getArray().map(function (feature) {
          return feature.get('name')
        })
        if (names.length > 0) {
          infoBox.innerHTML = names.join(', ')
          infoBox.innerHTML = 'hello: ' + names.join(', ') + '11'
        } else {
          infoBox.innerHTML = 'No countries selected'
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
