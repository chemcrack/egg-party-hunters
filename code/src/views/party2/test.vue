<template>
  <div class="gravity-demo">
    <h3>设备重力方向（屏幕锁定时仍有效）</h3>

    <!-- 权限提示 -->
    <div v-if="!permissionGranted" class="permission-tip">
      <p>需要您授权设备方向权限才能获取重力数据</p>
      <button @click="requestPermission">点击授权</button>
    </div>

    <!-- 重力数据展示 -->
    <div v-else class="gravity-data">
      <p>α (绕Z轴): {{ alpha.toFixed(1) }}°</p>
      <p>β (绕X轴): {{ beta.toFixed(1) }}°</p>
      <p>γ (绕Y轴): {{ gamma.toFixed(1) }}°</p>
      <p>物理方向：{{ deviceOrientation }}</p>
      <p>是否竖屏（物理）：{{ isPhysicalPortrait ? '是' : '否' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 设备方向参数（重力感应核心值）
const alpha = ref<number>(0) // 绕Z轴旋转（方位角）0-360°
const beta = ref<number>(0)  // 绕X轴旋转（俯仰角）-180-180°
const gamma = ref<number>(0) // 绕Y轴旋转（横滚角）-90-90°

// 状态标识
const permissionGranted = ref<boolean>(false) // 是否获取权限
const deviceOrientation = ref<string>('未知') // 物理方向描述
const isPhysicalPortrait = ref<boolean>(true) // 物理是否竖屏

// 处理设备方向变化事件
const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
  // 过滤无效数据（部分设备初始值为null/undefined）
  if (event.alpha === null || event.beta === null || event.gamma === null) return

  // 更新原始角度值
  alpha.value = event.alpha
  beta.value = event.beta
  gamma.value = event.gamma

  // 计算物理方向（不受屏幕锁定影响）
  calculatePhysicalOrientation()
}

// 根据重力角度计算设备物理方向
const calculatePhysicalOrientation = () => {
  // 核心逻辑：通过gamma（横滚角）判断物理横竖屏
  // gamma绝对值 > 45° 判定为物理横屏，否则为竖屏
  const absGamma = Math.abs(gamma.value)
  isPhysicalPortrait.value = absGamma < 45

  // 细化方向描述
  if (isPhysicalPortrait.value) {
    // 竖屏：通过beta判断上下
    deviceOrientation.value = beta.value > 0 ? '竖屏（正）' : '竖屏（倒）'
  } else {
    // 横屏：通过gamma正负判断左右
    deviceOrientation.value = gamma.value > 0 ? '横屏（右）' : '横屏（左）'
  }
}

// 请求设备方向权限（HTTPS/本地环境才有效）
const requestPermission = async () => {
  try {
    // 现代浏览器需要主动请求权限
    if ((DeviceOrientationEvent as any).requestPermission) {
      const permission = await (DeviceOrientationEvent as any).requestPermission()
      if (permission === 'granted') {
        permissionGranted.value = true
        // 授权后开始监听
        window.addEventListener('deviceorientation', handleDeviceOrientation)
      } else {
        alert('拒绝权限将无法获取设备重力方向')
      }
    } else {
      // 无需主动授权的浏览器（如部分移动端）
      permissionGranted.value = true
      window.addEventListener('deviceorientation', handleDeviceOrientation)
    }
  } catch (error) {
    console.error('请求权限失败：', error)
    alert('获取重力方向失败，请检查浏览器权限设置')
  }
}

// 生命周期：挂载时初始化
onMounted(() => {
  // 非HTTPS环境提示（部分浏览器仅HTTPS支持）
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    console.warn('DeviceOrientation API 在非HTTPS环境下可能受限')
  }

  // 尝试自动请求权限（部分浏览器支持）
  if ((DeviceOrientationEvent as any).requestPermission) {
    // 需用户手动触发授权（浏览器安全策略），故不自动调用，仅提示
  } else {
    // 无需授权的环境直接监听
    permissionGranted.value = true
    window.addEventListener('deviceorientation', handleDeviceOrientation)
  }
})

// 生命周期：卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('deviceorientation', handleDeviceOrientation)
})
</script>

<style scoped>
.gravity-demo {
  padding: 20px;
  font-size: 16px;
}
.permission-tip {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 10px;
}
.permission-tip button {
  margin-top: 8px;
  padding: 6px 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.gravity-data p {
  margin: 8px 0;
}
</style>