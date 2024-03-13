/**
 * 工具类
 */
class Utils {
    /**
     * 获取chrome.storage.local中的值。
     * @param key 要获取的值的键名。
     * @returns Promise，当成功时解析为与键关联的值，如果出错或键不存在则解析为undefined。
   */
    public async getChromeStorage(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    // result[key] 可能是undefined，如果key不存在的话
                    resolve(result[key]);
                }
            });
        });
    }

    /**
     * 判断chrome.storage.local中是否存在key
     * @param key 
     * @returns 
     */
    public async checkStorageExists(key: string): Promise<boolean> {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (result) => {
                const value = result[key];
                const exists = value !== undefined && value !== null && value !== '';
                resolve(exists);
              });
        });
      }

    /**
     * 从url中提取jobId
     * @param url 
     * @returns 
     */
    public extractJobIdFromUrl(url: string): string | null {
        const match = url.match(/jobs\/([a-z0-9-]+)/);
        return match ? match[1] : null;
    }

    /**
     * 从字符串中提取参数
     * @param input 
     * @returns 
     */
    public extractParamsWithDash(input: string): string {
        // 正则表达式用于匹配以 -- 开头的参数及其后的值
        const regex = /(--\w+\s+\w+)/g;
        let match;
        let result = '';

        // 循环遍历所有匹配项
        while ((match = regex.exec(input)) !== null) {
            // 将每个匹配项加到结果字符串，后面加上一个空格以分隔各参数
            result += `${match[0]} `;
        }

        // 移除最后一个多余的空格并返回结果
        return result.trim();
    }

    /**
     * 移除http或https链接
     * @param input 
     * @returns 
     */
    public removeHttpLinks(input: string): string {
        // 正则表达式用于匹配http或https链接
        const regex = /https?:\/\/[^\s]+/g;
        // 将所有符合正则表达式的部分替换为空字符串
        return input.replace(regex, '');
    }

    public showSucessStatus(): void {
        this.showBadge('成功', '#00FF00');
    }

    public showOkStatus(): void {
        this.showBadge('OK', '#00FF00');
    }

    public showErrorStatus(): void {
        this.showBadge('Error', '#FF0000');
    }

    /**
     * 显示徽章
     * @param text 
     * @param color 
     */
    public showBadge(text: string, color: string): void {
        // 设置徽章文本
        chrome.action.setBadgeText({ text: text });
        // 设置徽章背景颜色
        chrome.action.setBadgeBackgroundColor({ color: color });

        // 2秒后清除徽章文本
        setTimeout(() => {
            chrome.action.setBadgeText({ text: '' });
        }, 2000); // 2000毫秒后执行
    }
}

export { Utils };


