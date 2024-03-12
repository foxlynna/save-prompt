import { Utils } from './util';
import { NotionManager } from './notion';

class MidjourneyManager {
    private notionManager: NotionManager;
    private utils: Utils;
    constructor() {
        this.notionManager = new NotionManager();
        this.notionManager.initializeNotionClient();
        this.utils = new Utils();
    }

    public async savePromptWithImage(imageUrl: string, config: any, databaseId: string) {
        // 获取当前激活标签页的URL
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            var currentTab = tabs[0];
            if (currentTab && currentTab.url) {
                const src: string = currentTab.url;
                // 获取jobId请求数据
                const jobId = this.utils.extractJobIdFromUrl(src);
                if (jobId) {
                    try {
                        const data = await this.fetchDataAndProcess(jobId, config);
                        if (data) {
                            console.log(data);
                            const username = data[0].username;
                            let fullCommand = data[0].full_command;
                            fullCommand = this.utils.removeHttpLinks(fullCommand);
                            let param = this.utils.extractParamsWithDash(fullCommand);
                            console.log(`Username: ${username}, Full Command: ${fullCommand}`);
                            console.log(param);
                            this.notionManager.addToNotion(username, src, fullCommand, "", param, imageUrl, databaseId);
                        }
                    } catch (error) {
                        console.error('Error processing data:', error);
                    }
                }
            }
        });
    }


    public async fetchDataAndProcess(jobId: string, config: { mjImageApiUrl: string }) {
        const data = {
            jobIds: [jobId]
        };

        return fetch(config.mjImageApiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-Csrf-Protection': '1'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error:', error);
            });
    }
}


export { MidjourneyManager };