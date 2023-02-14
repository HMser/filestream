const TelegramBot = require('telegram-bot');

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Authenticate your bot using the API token
  const bot = new TelegramBot('YOUR_API_TOKEN');

  // Parse incoming requests from Telegram
  const body = await request.text();
  const update = JSON.parse(body);

  if (update.message) {
    // Handle incoming messages
    const chatId = update.message.chat.id;

    if (update.message.document) {
      // Handle incoming files
      const fileId = update.message.document.file_id;
      const fileInfo = await bot.getFile(fileId);

      const response = await fetch(fileInfo.fileLink, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${fileInfo.filePath}`,
        },
      });

      return response;
    } else {
      // Handle other incoming messages
      const text = update.message.text;
      bot.sendMessage(chatId, `You said: ${text}`);
    }
  }

  return new Response('OK');
}
