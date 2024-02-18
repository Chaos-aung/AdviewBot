const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token obtained from BotFather
const bot = new TelegramBot('6875379832:AAEgB65lshZmTqX4jXBiAzW2fO-3MCQQZww', { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Check if the message contains a URL
    if (msg.entities && msg.entities[0].type === 'url') {
        const url = msg.text;

        try {
            const directDownloadLink = await generateDirectDownloadLink(url);
            bot.sendMessage(chatId, `Direct Download Link: ${directDownloadLink}`);
        } catch (error) {
            console.error('Error generating direct download link:', error);
            bot.sendMessage(chatId, 'Sorry, there was an error processing your request.');
        }
    }
});

async function generateDirectDownloadLink(url) {
    // Fetch the HTML content of the URL
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract the direct download link
    // This is just a placeholder, you need to customize this logic based on the structure of the page
    const directDownloadLink = $('a[href^="https://example.com/download"]').attr('href');

    if (!directDownloadLink) {
        throw new Error('Direct download link not found');
    }

    return directDownloadLink;
}

// Start the bot
console.log('Bot is running...');
