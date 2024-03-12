import { Client } from "@notionhq/client";
import { Utils } from './util';


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
            const exists = await this.utils.checkNotionAuthExists();
            if (exists) {
                chrome.storage.local.get("notionAuth", (result) => {
                    if (result.notionAuth) {
                        this.notion = new Client({ auth: result.notionAuth });
                        console.log("Notion auth updated.");
                    } else {
                        console.error("Notion auth not found.");
                    }
                });
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

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