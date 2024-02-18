const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token obtained from BotFather
const bot = new TelegramBot('6875379832:AAEgB65lshZmTqX4jXBiAzW2fO-3MCQQZww', { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Check if the message contains a media (photo or video)
    if (msg.photo || msg.video) {
        try {
            const directDownloadLink = await generateDirectDownloadLink(msg);
            bot.sendMessage(chatId, `Direct Download Link: ${directDownloadLink}`);
        } catch (error) {
            console.error('Error generating direct download link:', error);
            bot.sendMessage(chatId, 'Sorry, there was an error processing your request.');
        }
    }
});

async function generateDirectDownloadLink(message) {
    let mediaFileId;
    let mediaType;

    // Determine the media type and get the file ID
    if (message.photo) {
        mediaType = 'photo';
        mediaFileId = message.photo[message.photo.length - 1].file_id;
    } else if (message.video) {
        mediaType = 'video';
        mediaFileId = message.video.file_id;
    } else {
        throw new Error('Unsupported media type');
    }

    // Get the file details using Telegram Bot API
    const fileInfo = await bot.getFile(mediaFileId);

    // Construct the direct download link using the file path from Telegram
    const directDownloadLink = `https://api.telegram.org/file/bot${bot.token}/${fileInfo.file_path}`;

    return directDownloadLink;
}


console.log('Bot is running...');
