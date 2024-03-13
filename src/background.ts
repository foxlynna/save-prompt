import { Utils } from './util';
import { MidjourneyManager } from './midjourney';
import { CivitaiManager } from './civitai';
import { config } from './config';

const utils = new Utils();

// 右击菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "savePrompt",
    title: "save-prompt",
    contexts: ["image"]
  });
});

// 点击菜单
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "savePrompt" && info.srcUrl && tab !== undefined && tab.id !== undefined && tab.url !== undefined) {
    const midjourneyManager = new MidjourneyManager();
    const civitaiManager = new CivitaiManager();
    const imageUrl: string = info.srcUrl;
    const tabUrl: string = tab.url;
    if (tabUrl.includes("midjourney")) {
      midjourneyManager.processMj(imageUrl, tabUrl);
    }
    if (tabUrl.includes("civitai")) {
      // 从网页提取postId和CheckpointId
      chrome.tabs.sendMessage(tab.id, { action: "extractPostIdAndCheckpointId" }, function (response) {
        console.log(response.param);
        civitaiManager.processCivitai(imageUrl, tabUrl, response.param);

      });
    }
  }
});



