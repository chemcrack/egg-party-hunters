// src/utils/wakeLock.ts
let wakeLock: WakeLockSentinel | null = null;

/**
 * 请求屏幕常亮锁
 * @returns 是否请求成功
 */
export const requestWakeLock = async (): Promise<boolean> => {
    try {
        // 检查浏览器是否支持 Wake Lock API
        if (!('wakeLock' in navigator)) {
            console.warn('当前浏览器不支持 Wake Lock API');
            return false;
        }

        // 请求屏幕唤醒锁（需用户交互后调用）
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('屏幕常亮锁已激活');

        // 监听锁释放事件（如页面隐藏、用户手动关闭等）
        wakeLock.addEventListener('release', () => {
            console.log('屏幕常亮锁已释放');
            wakeLock = null;
        });

        return true;
    } catch (err) {
        console.error('请求屏幕常亮锁失败:', err);
        return false;
    }
};

/**
 * 释放屏幕常亮锁
 */
export const releaseWakeLock = (): void => {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
        console.log('主动释放屏幕常亮锁');
    }
};

/**
 * 检查是否已持有屏幕常亮锁
 */
export const hasWakeLock = (): boolean => {
    return !!wakeLock;
};