const CHANNEL_ACCESS_TOKEN = "";
const OPENAI_API_KEY = "";

function doPost(e) {
  const replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  const userMessage = JSON.parse(e.postData.contents).events[0].message.text;

  const chatGptResponse = callChatGptChatCompletionsApi(userMessage);
  const imgUrl = chatGptResponse.data[0].url;

  
  const url = "https://api.line.me/v2/bot/message/reply";
  UrlFetchApp.fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [{
        "type": "image",
        "originalContentUrl": imgUrl,
        "previewImageUrl": imgUrl,
      }],
    }),
  });
}

function callChatGptChatCompletionsApi(userMessage) {
  const apiEndpoint = "https://api.openai.com/v1/images/generations";
  const payload = {
      "model": "dall-e-3",
      "prompt": userMessage,
      "n": 1,
      "size": "1024x1024"
  };

  const headers = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };

  const options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(apiEndpoint, options);
  return JSON.parse(response.getContentText());
}
