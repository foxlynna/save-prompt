import { Client } from "@notionhq/client";
import { Utils } from './util';
import { config } from './config';


class NotionManager {
    private notion: Client;
    private utils: Utils;

    constructor() {
        // 初始时使用空字符串作为认证信息初始化Notion客户端
        this.notion = new Client({ auth: "" });
        this.utils = new Utils();
    }

    public async initializeNotionClient(): Promise<void> {
        try {
            const exists = await this.utils.checkStorageExists(config.notionAuth);
            if (exists) {
                const auth: string = await this.utils.getChromeStorage(config.notionAuth);
                this.notion = new Client({ auth: auth });
                console.log("Notion auth updated.");
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    /**
     * MJ保存提示词
     * @param username 
     * @param src 
     * @param prompt 
     * @param translation 
     * @param param 
     * @param imageUrl 
     * @param databaseId 
     */
    public async addToNotion(username: string, src: string, prompt: string, translation: string, param: string, imageUrl: string, databaseId: string) {
        try {
            console.log(this.notion);

            const response = await this.notion.pages.create({
                parent: { database_id: databaseId },
                properties: {
                    'username': {
                        title: [
                            {
                                text: {
                                    content: username,
                                },
                            },
                        ],
                    },
                    'src': {
                        type: 'url',
                        url: src,
                    },
                    'prompt': {
                        rich_text: [
                            {
                                text: {
                                    content: prompt,
                                },
                            },
                        ],
                    },
                    'translation': {
                        rich_text: [
                            {
                                text: {
                                    content: translation,
                                },
                            },
                        ],
                    },
                    'param': {
                        rich_text: [
                            {
                                text: {
                                    content: param,
                                },
                            },
                        ],
                    },
                    'image': {
                        type: 'url',
                        url: imageUrl,
                    },
                },
            });
            console.log('Success! Entry added to Notion.', response);
            this.utils.showOkStatus();
        } catch (error: any) {
            console.error('Error adding entry to Notion', error.body);
            this.utils.showErrorStatus();
        }
    }
    /**
     * Civitai保存提示词
     * @param properties 
     * @param databaseId 
     */
    public async addToNotionC(properties: any, databaseId: string) {
        const notionProperties = {
            "id": {
                "title": [
                    {
                        "text": {
                            "content": properties.id
                        }
                    }
                ]
            },
            "url": {
                "files": [
                    {
                        "name": "图片地址",
                        "external": {
                            "url": properties.url
                        }
                    }
                ]
            },
            "model": {
                "rich_text": [
                    {
                        "text": {
                            "content": properties.model
                        }
                    }
                ]
            },
            "modelUrl": {
                "url": properties.modelUrl
            },
            // "clipSkip": {
            //     "number": properties.clipSkip
            // },
            "steps": {
                "number": properties.steps
            },
            "prompt": {
                "rich_text": [
                    {
                        "text": {
                            "content": properties.prompt
                        }
                    }
                ]
            },
            "negativePrompt": {
                "rich_text": [
                    {
                        "text": {
                            "content": properties.negativePrompt
                        }
                    }
                ]
            },
            "cfg": {
                "number": properties.cfg
            },
            "sampler": {
                "rich_text": [
                    {
                        "text": {
                            "content": properties.sampler
                        }
                    }
                ]
            },
            "denoisingStrength": {
                "rich_text": [
                    {
                        "text": {
                            "content": properties.denoisingStrength
                        }
                    }
                ]
            },
            "hiresUpscal": {
                "rich_text": [
                    {
                        "text": {
                            "content": properties.hiresUpscal
                        }
                    }
                ]
            },
            "hiresUpscaler": {
                "rich_text": [
                    {
                        "text": {
                            "content": properties.hiresUpscaler
                        }
                    }
                ]
            }
        };
        try {
            const response = await this.notion.pages.create({
                parent: { database_id: databaseId },
                properties: notionProperties
            });
            console.log(response);
            this.utils.showOkStatus();
        } catch (error) {
            console.error(error);
            this.utils.showErrorStatus();
        }
    }

    public async getPage(pageId: string) {
        try {
            const response = await this.notion.pages.retrieve({ page_id: pageId });
            console.log("getPage:", response);
        } catch (error) {
            console.error(error);
        }
    }

    public async getDatabase(databaseId: string) {
        try {
            const response = await this.notion.databases.query({ database_id: databaseId });
            console.log("getDatabase:", response);
        } catch (error) {
            console.error(error);
        }
    }
}


export { NotionManager };