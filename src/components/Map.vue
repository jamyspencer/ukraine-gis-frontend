<script setup lang="ts">   
  import { onMounted } from 'vue'
  import { useMapStore } from "@/stores/map";

  const mapStore = useMapStore()

  onMounted(() => {
    mapStore.init()
  })
</script>

<template>
    <div id="map"></div>
</template>

<style>
  #map{
    min-height: 800px;
    height: 100%;
  }
</style>