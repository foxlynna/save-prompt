/**
 * 配置-常量
 */
export interface Constant {
    mjImageApiUrl: string;
    notionAuth: string;
    notionDatabaseIdMJ: string;
    notionDatabaseIdSD: string;
    civitaiApiKey: string;
    civitaiImageApiUrl: string;
    civitaiModelUrlPrefix: string;
}

export const config: Constant = {
    mjImageApiUrl: "https://www.midjourney.com/api/app/job-status", // MJ 根据id查询图片详情
    notionAuth: "notionAuth", // notion 鉴权常量
    notionDatabaseIdMJ: "notionDatabaseIdMJ", // notion midjourney数据库id定义常量
    notionDatabaseIdSD: "notionDatabaseIdSD", // notion stable-diffusion数据库id定义常量
    civitaiApiKey: "civitaiApiKey", // civitai api key常量
    civitaiImageApiUrl: "https://civitai.com/api/v1/images", // civitai查图片API
    civitaiModelUrlPrefix: "https://civitai.com/models/", // 模型网页前缀
};
