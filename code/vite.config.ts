import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        // 核心配置：../ 表示当前项目目录的上一级目录
        // outDir: '../publish',
        // 可选：清空目标目录（上级目录）中已有的文件（谨慎使用！）
        // emptyOutDir: true,
        // 可选：如果上级目录有其他文件，避免误删，可关闭 emptyOutDir
        // emptyOutDir: false,
    },
})
