const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token obtained from BotFather
const bot = new TelegramBot('6875379832:AAEgB65lshZmTqX4jXBiAzW2fO-3MCQQZww', { polling: true });

bot.onText(/https?:\/\/\S+\.mp4/, async (msg, match) => {
    const chatId = msg.chat.id;
    const videoLink = match[0];
    
    try {
        const directDownloadLink = await generateDirectDownloadLink(videoLink);
        bot.sendMessage(chatId, `Direct Download Link: ${directDownloadLink}`);
    } catch (error) {
        console.error('Error generating direct download link:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error processing your request.');
    }
});

async function generateDirectDownloadLink(videoLink) {
    // For demonstration purposes, let's just echo back the video link
    return videoLink;
}

// Start the bot
console.log('Bot is running...');
