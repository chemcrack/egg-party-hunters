<template>
  <!-- 大图浏览遮罩层 -->
  <div
      v-if="formData.visible"
      class="image-viewer-mask"
      @click.self="handleClose"
      @touchmove.prevent="handleTouchMoveGlobal">
    <div class="message" v-if="messageBox.visible">本地图链接已经复制！</div>
    <button class="close-btn control-btn" @click="handleClose()">&times;</button>
    <!-- 图片容器（负责移动/缩放/旋转） -->
    <img
        ref="imageRef"
        :src="formData.url"
        alt=""
        class="viewer-image"
        :style="{transform:`translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imagePosition.scale}) rotate(${imagePosition.rotate}deg)`,
          transition:isDragging?'none':'transform 0.2s ease'}"
        @load="handleImageLoad"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
        @wheel="handleWheel"
        @click.stop/>

    <!-- 操作按钮 -->
    <div class="viewer-toolbar">
      <div class="viewer-controls">
        <button class="control-btn" style="background-color: #C19A6B;" @click="handleScale(0.1)">+</button>
        <button class="control-btn" style="background-color: #C19A6B;" @click="handleScale(-0.1)">-</button>
        <button class="control-btn" @click="copyLink()">&#xe62c;</button>
        <button class="control-btn" style="background-color: #D8ABAB;" @click="handleRotate(90)">↻</button>
        <button class="control-btn" style="background-color: #D8ABAB;" @click="handleRotate(-90)">↺</button>
        <button class="control-btn" @click="handleReset">⟲</button>
      </div>
      <div>{{ formData.alt }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onUnmounted} from 'vue';
import {requestWakeLock} from "../../lib/wakeLock.ts";
import {useCopy} from "./useCopy.ts"

const formData = ref({url: "", degree: 0, visible: false, alt: "", link: ""});
const messageBox = ref({visible: false});

defineExpose({
  open: (url: string, degree: number, alt: string, link: string) => {
    requestWakeLock();
    handleReset();
    formData.value.alt = alt;
    formData.value.link = link;
    formData.value.url = url;
    formData.value.degree = degree;
    formData.value.visible = true;
  }
});

// 组件 Emits
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const copyLink = async () => {
  let a = useCopy();
  a.copyToClipboard(formData.value.link)
  messageBox.value.visible = true;
  setTimeout(() => {
    messageBox.value.visible = false;
  }, 5000);
};

// 核心状态
const imageRef = ref<HTMLImageElement | null>(null); // 图片DOM
// const imageContainerRef = ref<HTMLDivElement | null>(null);
const imagePosition = ref({
  x: 0,// 水平偏移
  y: 0,// 垂直偏移
  scale: 1,// 缩放比例
  rotate: 0// 旋转角度
});
const imageDefault = ref({SCALE_MAX: 3, SCALE_MIN: 0.5, SCALE: 1, ROTATE: 0});
const isDragging = ref(false); // 是否正在拖拽
const startX = ref(0); // 拖拽起始X
const startY = ref(0); // 拖拽起始Y
const startTouchDistance = ref(0); // 触摸起始距离（双指缩放）
const startTouchScale = ref(1); // 触摸起始缩放比例

// 关闭大图浏览
const handleClose = () => {
  formData.value.visible = false;
  emit('close');
};

// 重置图片状态
const handleReset = () => {
  imagePosition.value = {x: 0, y: 0, scale: imageDefault.value.SCALE, rotate: imageDefault.value.ROTATE}
};

// 图片加载完成后计算初始缩放（核心：小于屏幕时自动放大）
const handleImageLoad = () => {
  if (!imageRef.value) return;

  // 获取屏幕可视区域尺寸（减去边距避免溢出）
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 获取图片原始尺寸
  const imgWidth = screenWidth > screenHeight ? imageRef.value.naturalWidth : imageRef.value.naturalHeight;
  const imgHeight = screenWidth > screenHeight ? imageRef.value.naturalHeight : imageRef.value.naturalWidth;

  // 计算缩放比例：保证图片完整显示且不小于屏幕（取宽/高缩放的最大值）
  const scaleX = screenWidth / imgWidth;
  const scaleY = screenHeight / imgHeight;
  const initialScale = Math.min(scaleX, scaleY); // 最小缩放为1（原图），小于屏幕则放大
  imageDefault.value = {
    SCALE: initialScale,
    SCALE_MAX: initialScale * 5,
    SCALE_MIN: initialScale * 0.5,
    ROTATE: screenWidth > screenHeight ? (0) : (90)
  }
  // 重置状态
  imagePosition.value = {
    x: 0,
    y: 0,
    scale: imageDefault.value.SCALE,
    rotate: imageDefault.value.ROTATE + formData.value.degree
  };
};

// 旋转图片
const handleRotate = (deg: number) => {
  let v = imagePosition.value.rotate + deg;
  // 保证旋转角度在 0-360 范围内
  imagePosition.value.rotate = (v + 360) % 360;
};

// 缩放图片
const handleScale = (delta: number) => {
  const newScale = imagePosition.value.scale + delta;
  // 限制缩放范围
  if (newScale >= imageDefault.value.SCALE_MIN && newScale <= imageDefault.value.SCALE_MAX) {
    imagePosition.value.scale = newScale;
  }
};

// 滚轮缩放（桌面端）
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  // 滚轮方向：向上为正（放大），向下为负（缩小）
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  handleScale(delta);
};

// 鼠标按下（开始拖拽）
const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true;
  startX.value = e.clientX - imagePosition.value.x;
  startY.value = e.clientY - imagePosition.value.y;
  // 添加全局事件监听
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// 鼠标移动（拖拽中）
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  imagePosition.value.x = e.clientX - startX.value;
  imagePosition.value.y = e.clientY - startY.value;
};

// 鼠标抬起（结束拖拽）
const handleMouseUp = () => {
  isDragging.value = false;
  // 移除全局事件监听
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

// 触摸开始（移动端）
const handleTouchStart = (e: TouchEvent) => {
  // 单指拖拽
  if (e.touches.length === 1) {
    isDragging.value = true;
    startX.value = e.touches[0].clientX - imagePosition.value.x;
    startY.value = e.touches[0].clientY - imagePosition.value.y;
  }
  // 双指缩放
  else if (e.touches.length === 2) {
    startTouchDistance.value = getTouchDistance(e);
    startTouchScale.value = imagePosition.value.scale;
  }
};

// 触摸移动（移动端）
const handleTouchMoveGlobal = (e: TouchEvent) => {
  if (!isDragging.value && e.touches.length !== 2) return;

  // 单指拖拽
  if (e.touches.length === 1) {
    imagePosition.value.x = e.touches[0].clientX - startX.value;
    imagePosition.value.y = e.touches[0].clientY - startY.value;
  }
  // 双指缩放
  else if (e.touches.length === 2) {
    const currentDistance = getTouchDistance(e);
    const scaleRatio = currentDistance / startTouchDistance.value;
    const newScale = startTouchScale.value * scaleRatio;
    // 限制缩放范围
    if (newScale >= imageDefault.value.SCALE_MIN && newScale <= imageDefault.value.SCALE_MAX) {
      imagePosition.value.scale = newScale;
    }
  }
};

// 计算双指距离
const getTouchDistance = (e: TouchEvent): number => {
  const touch1 = e.touches[0];
  const touch2 = e.touches[1];
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

// 组件卸载时清理事件
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped>
.message {
  position: fixed;
  z-index: 1000;
  color: white;
  top: 0;
  width: auto;
  background: rgba(0, 200, 0, 0.3);
  padding: 5px 10px;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  display: flex;
  z-index: 30;
}

/* 遮罩层 */
.image-viewer-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

/* 图片容器 */
.image-container {
  width: 90%;
  height: 90%;
  cursor: move;
  user-select: none;
}

/* 图片样式 */
.viewer-image {
  position: absolute;
  width: auto;
  height: auto;
  user-select: none; /* 禁止选中图片 */
  max-width: none; /* 解除默认最大宽度限制，允许放大 */
  max-height: none; /* 解除默认最大高度限制 */
  transition: transform 0.2s ease;
  touch-action: none; /* 禁用浏览器默认触摸行为 */
  /* 标准属性（部分浏览器支持） */
  /* Webkit 内核浏览器（Chrome/Safari/Edge） */
  -webkit-user-drag: none;
  /* 可选：禁止选中（增强体验） */
  -webkit-user-select: none;
}

.viewer-toolbar {
}

/* 操作按钮组 */
.viewer-controls {
  position: fixed;
  font-size: 0.8rem;
  right: 10px;
  bottom: 10px;
  color: #eee;
  display: flex;
  flex-direction: column;
  gap: 1vw;
  z-index: 10000;
  margin: 0 0 5px 0;
}

/* 按钮样式 */
.control-btn {
  font-family: party-0chem, sans-serif;
  color: black;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: manipulation; /* 优化移动端点击 */
  margin: 0 5px 0 0;
  box-shadow: 3px 3px 3px black;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .viewer-controls {
    gap: 10px;
    bottom: 20px;
    flex-direction: row;
  }
}
</style>