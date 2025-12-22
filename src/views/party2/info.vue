<script setup lang="ts">
const formData = {
  info: [{name: "window宽高", value: window.innerWidth + " " + window.innerHeight},
    {name: "内容区域", value: document.documentElement.clientWidth + " " + document.documentElement.clientHeight}
  ]
}
</script>

<template>
  <dl class="info" v-for="(item,index) of formData.info">
    <dt>{{ index + 1 }}. {{ item.name }}</dt>
    <dd>{{ item.value }}</dd>
  </dl>
</template>

<style>
.egg .info {
  padding: 0;
  margin: 0 0 2px 0;
  display: flex;
  color: white;
}

.egg .info dt {
  padding: 0;
  margin: 0;
  width: 200px;
  background-color: #2c2c36;
  height: 40px;
  line-height: 40px;
}

.egg .info dd {
  height: 40px;
  line-height: 40px;
  padding: 0 0 0 10px;
  margin: 0;
  flex: auto;
  background-color: #1a1a1a;
  text-align: left;
}
</style>