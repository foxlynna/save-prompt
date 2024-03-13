import { Utils } from './util';
import { NotionManager } from './notion';
import { config } from './config';

class CivitaiManager {
    private notionManager: NotionManager;
    private utils: Utils;
    constructor() {
        this.notionManager = new NotionManager();
        this.notionManager.initializeNotionClient();
        this.utils = new Utils();
    }

    public async processCivitai(imageUrl: string, tabUrl: string, param: CivitaiPageExtarctParam) {
        // 判断用户是否配置 notionDatabaseIdSD
        const exists: boolean = await this.utils.checkStorageExists(config.notionDatabaseIdSD);
        if (!exists) {
            console.log("notionDatabaseIdSD not found.");
            return;
        }
        const databaseId: string = await this.utils.getChromeStorage(config.notionDatabaseIdSD);
        // 判断用户是否配置 civitaiApiKey
        const exists2: boolean = await this.utils.checkStorageExists(config.civitaiApiKey);
        if (!exists2) {
            console.log("civitaiApiKey not found.");
            return;
        }
        const civitaiApiKey: string = await this.utils.getChromeStorage(config.civitaiApiKey);
        // 请求接口获取image信息
        const data = await this.fetchCivitaiImageInfo(civitaiApiKey, param);
        // 从data中筛选出当前imageId的信息
        const imageId = this.extractImageIdFromTabUrl(tabUrl);
        if (imageId) {
            const imageInfo = data.items.find((item: any) => item.id === Number(imageId));
            if (imageInfo) {
                console.log(imageInfo);
                const properties: NotionProperty = this.mapImageInfoToNotionProperty(imageInfo);
                properties.modelUrl = config.civitaiModelUrlPrefix + param.modelId;
                console.log(properties);
                // 保存到notion
                this.notionManager.addToNotionC(properties, databaseId);
            }
        }
    }

    /**
     * 请求civitai接口
     * @param civitaiApiKey 
     * @param param 
     * @returns 
     */
    public async fetchCivitaiImageInfo(civitaiApiKey: String, param: CivitaiPageExtarctParam) {
        const url = new URL(config.civitaiImageApiUrl);
        if (param.postId) {
            url.searchParams.append('postId', param.postId);
        }
        if (param.modelId) {
            url.searchParams.append('modelId', param.modelId);
        }
        return fetch(url.toString(), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${civitaiApiKey}`
            }
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error:', error);
            });
    }

    /**
     * 从url中提取imageId
     * @param tabUrl 
     * @returns 
     */
    public extractImageIdFromTabUrl(tabUrl: string): string | null {
        const regex = /\/images\/(\d+)(?=[\/?]|$)/;
        const match = tabUrl.match(regex);
        if (match) {
            return match[1];
        }
        return null;
    }

    /**
     * 数据映射
     * @param imageInfo 
     * @returns 
     */
    public mapImageInfoToNotionProperty(imageInfo: any): NotionProperty {
        return {
            id: String(imageInfo.id) || "",
            url: imageInfo.url || "",
            model: imageInfo.meta.Model || "",
            modelUrl: "",
            clipSkip: 0,
            steps: imageInfo.meta.steps,
            prompt: imageInfo.meta.prompt || "",
            negativePrompt: imageInfo.meta.negativePrompt || "",
            cfg: imageInfo.meta.cfgScale,
            sampler: imageInfo.meta.sampler || "",
            denoisingStrength: imageInfo.meta["Denoising strength"] || "",
            hiresUpscal: imageInfo.meta["Hires upscale"] || "",
            hiresUpscaler: imageInfo.meta["Hires upscaler"] || ""
        };
    }
}


interface CivitaiPageExtarctParam {
    postId: string | null;
    modelId: string | null;
}

interface NotionProperty {
    id: string;
    url: string;
    model: string;
    modelUrl: string;
    clipSkip: number;
    steps: number;
    prompt: string;
    negativePrompt: string;
    cfg: number;
    sampler: string;
    denoisingStrength: string;
    hiresUpscal: string;
    hiresUpscaler: string;
}

export { CivitaiManager, CivitaiPageExtarctParam };