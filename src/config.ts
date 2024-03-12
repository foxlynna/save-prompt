/**
 * 配置-常量
 */
export interface Constant {
    mjImageApiUrl: string;
}

export const config: Constant = {
    mjImageApiUrl: "https://www.midjourney.com/api/app/job-status", // MJ 根据id查询图片详情
};
