<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useMapStore } from "@/stores/map";

  const mapStore = useMapStore()

  onMounted(() => {
    mapStore.init()
  })
</script>

<template>
  <main>
    <div id="map"></div>
  </main>
</template>

<style>
  #map{
    min-height: 500px;
  }
</style>
