<script setup lang="ts">

</script>

<template>
  <label for="doorSwitch" class="gate-toggle">
    <div class="toggle-bg"></div>
    <div class="toggle-options">
      <div class="toggle-option">正门</div>
      <div class="toggle-option">侧门</div>
    </div>
  </label>
</template>

<style>
/* 核心：隐藏原生复选框 */
.gate-toggle-checkbox {
  display: none;
}

/* 长方形切换按钮容器 */
.gate-toggle {
  position: relative;
  width: 100px;      /* 长方形宽度 */
  height: 50px;      /* 长方形高度 */
  background-color: #aaa;/*#0A1624;*/
  border-radius: 12px; /* 长方形圆角（可改为0实现纯直角） */
  cursor: pointer;
  overflow: hidden;
  display: block;    /* 作为可点击容器 */
}

/* 按钮文字选项容器 */
.toggle-options {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 2;
}

/* 单个文字选项样式 */
.toggle-option {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  transition: color 0.3s ease;
  user-select: none;
  z-index: 2;
}

/* 滑动背景（核心酷炫效果） */
.toggle-bg {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  background: linear-gradient(135deg, #001E36, #0A1624); /* 紫蓝渐变 */
  border-radius: 8px;
  transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 6px 16px rgba(67, 97, 238, 0.4);
  z-index: 1;
}

/* 选中状态：切换到侧门时的背景位置 */
.gate-toggle-checkbox:checked + .gate-toggle .toggle-bg {
  left: calc(50%);
}

/* 选中状态：文字颜色变化 */
.gate-toggle-checkbox:not(:checked) + .gate-toggle .toggle-option:first-child,
.gate-toggle-checkbox:checked + .gate-toggle .toggle-option:last-child {
  color: #ffffff;
}

/* 悬停效果增强 */
.gate-toggle:hover .toggle-option {
  color: #333;
}
.gate-toggle-checkbox:not(:checked) + .gate-toggle:hover .toggle-option:first-child,
.gate-toggle-checkbox:checked + .gate-toggle:hover .toggle-option:last-child {
  color: #fff;
}

/* 点击反馈：轻微缩放 */
.gate-toggle:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}
</style>