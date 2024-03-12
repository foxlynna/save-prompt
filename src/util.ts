/**
 * 工具类
 */
class Utils {
    /**
     * 判断chrome.storage.local中是否存在notionAuth
     * @returns Promise<boolean>
     */
    public async checkNotionAuthExists(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // 尝试从chrome.storage.local获取notionAuth
            chrome.storage.local.get('notionAuth', (result) => {
                if (chrome.runtime.lastError) {
                    // 处理错误情况
                    reject(chrome.runtime.lastError);
                } else {
                    // 根据notionAuth是否为undefined或空字符串来解析
                    console.log(result);

                    resolve(result.notionAuth !== undefined && result.notionAuth !== '');
                }
            });
        });
    }

    /**
     * 判断chrome.storage.local中是否存在notionDatabaseIdMJ
     * @returns Promise<boolean>
     */
    public async checkNotionMjDatabaseIdExists(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // 尝试从chrome.storage.local获取notionAuth
            chrome.storage.local.get('notionDatabaseIdMJ', (result) => {
                if (chrome.runtime.lastError) {
                    // 处理错误情况
                    reject(chrome.runtime.lastError);
                } else {
                    console.log(result);
                    // 根据notionAuth是否为undefined或空字符串来解析
                    resolve(result.notionDatabaseIdMJ !== undefined && result.notionDatabaseIdMJ !== '');
                }
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


