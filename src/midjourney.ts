import { Utils } from './util';
import { NotionManager } from './notion';
import { config } from './config';

class MidjourneyManager {
    private notionManager: NotionManager;
    private utils: Utils;
    constructor() {
        this.notionManager = new NotionManager();
        this.notionManager.initializeNotionClient();
        this.utils = new Utils();
    }

    /**
     * MJ保存提示词流程
     * @param imageUrl 
     * @param config 
     * @param tabUrl 
     * @returns 
     */
    public async processMj(imageUrl: string, tabUrl: string) {
        // 判断用户是否配置 notionDatabaseIdMJ
        const exists: boolean = await this.utils.checkStorageExists(config.notionDatabaseIdMJ);
        if (!exists) {
            console.log("notionDatabaseIdMJ not found.");
            return;
        }
        const databaseId: string = await this.utils.getChromeStorage(config.notionDatabaseIdMJ);
        this.savePromptWithImage(imageUrl, config, databaseId, tabUrl);
    }

    public async savePromptWithImage(imageUrl: string, config: any, databaseId: string, tabUrl: string) {
        // 获取jobId请求数据
        const jobId = this.utils.extractJobIdFromUrl(tabUrl);
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
                    this.notionManager.addToNotion(username, tabUrl, fullCommand, "", param, imageUrl, databaseId);
                }
            } catch (error) {
                console.error('Error processing data:', error);
            }
        }
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