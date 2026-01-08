<script setup lang="ts">
import list from "./MapList.vue"
import Footer from "../_footer.vue"

import {onMounted, onUnmounted} from "vue";

// 1. 禁止右键的事件处理函数
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault(); // 阻止原生右键菜单
};

// 3. 组件挂载时绑定事件，卸载时解绑（避免内存泄漏）
onMounted(() => {
  // 绑定全局右键事件
  document.addEventListener('contextmenu', handleContextMenu);
});

onUnmounted(() => {
  // 解绑事件
  document.removeEventListener('contextmenu', handleContextMenu);
});
</script>

<template>
  <Suspense>
    <list></list>
  </Suspense>
  <Footer></Footer>
</template>

<style>
:root {
  --0chem-party-help: url("/party/images/help.webp");
}
</style>