import { Utils } from './util';
import { MidjourneyManager } from './midjourney';
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
  if (info.menuItemId === "savePrompt" && info.srcUrl && tab !== undefined && tab.id !== undefined) {
    const midjourneyManager = new MidjourneyManager();

    const imageUrl: string = info.srcUrl;
    utils.checkNotionMjDatabaseIdExists().then((exists: boolean) => {
      if (exists) {
        chrome.storage.local.get('notionDatabaseIdMJ', (result) => {
          if (chrome.runtime.lastError) {
            // 处理错误情况
            console.log(result.notionDatabaseIdMJ);
          } else {
            midjourneyManager.savePromptWithImage(imageUrl, config, result.notionDatabaseIdMJ);
          }
        });

      } else {
        console.log("notionDatabaseIdMJ not found.");
      }
    }).catch(error => {
      console.log('An error occurred:', error);
    })
  }
});



