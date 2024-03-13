import { CivitaiPageExtarctParam } from "./civitai";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractPostIdAndCheckpointId") {
        // 提取postId、checkpointId
        const param: CivitaiPageExtarctParam = extractPostIdAndCheckpointIdFromPage();
        sendResponse({ action: "extractPostIdAndCheckpointId", param: param });
    }
});

function extractPostIdAndCheckpointIdFromPage(): CivitaiPageExtarctParam {
    // 你之前实现的提取postId的逻辑
    const link1 = document.querySelector('a[href*="/posts/"]');
    const match1 = link1?.getAttribute('href')?.match(/\/posts\/(\d+)/);
    const link2 = document.querySelector('a[href*="/models/"]');
    const match2 = link2?.getAttribute('href')?.match(/\/models\/(\d+)/);
    let postId = null;
    let modelId = null;
    if (match1) {
        postId = match1[1];
    }
    if (match2) {
        modelId = match2[1];
    }
    return { postId, modelId };
}

