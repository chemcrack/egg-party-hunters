/**
 * 复制文本到剪贴板的组合式函数
 * @returns copyToClipboard - 复制函数，返回 Promise<boolean>
 */
export function useCopy() {
    /**
     * 复制文本到剪贴板
     * @param text 要复制的文本内容
     * @returns Promise<boolean> 复制成功返回 true，失败返回 false
     */
    const copyToClipboard = async (text: string): Promise<boolean> => {
        // 校验输入
        if (!text || typeof text !== 'string') {
            console.error('复制失败：需要复制的内容必须是非空字符串');
            return false;
        }

        try {
            // 优先使用现代浏览器的 Clipboard API（更安全、更优雅）
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }

            // 降级方案：创建临时文本框（兼容非安全上下文/旧浏览器）
            const textArea = document.createElement('textarea');
            textArea.value = text;

            // 隐藏临时文本框，避免影响页面布局
            textArea.style.position = 'fixed';
            textArea.style.top = '-9999px';
            textArea.style.left = '-9999px';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            // 执行复制操作
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (!success) {
                throw new Error('execCommand copy failed');
            }
            return true;
        } catch (error) {
            console.error('复制失败：', error);
            return false;
        }
    };

    return { copyToClipboard };
}