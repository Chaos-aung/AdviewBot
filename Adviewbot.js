const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const bot = new TelegramBot('6705992889:AAHPiHZyRj-Ex1xGK8iZl1wgplEMQb3ZgYs', { polling: true });

// Replace 'BOT_CREATOR_ID' with the ID of the bot creator
const botCreatorId = 'BOT_CREATOR_ID';

// Dictionary to store user click counts
const userClickCounts = {};

// Dictionary to store whether the bot is waiting
const isBotWaiting = {};

// Function to handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Ad Bot! Click the button below to request an ad.', {
        reply_markup: {
            keyboard: [[{ text: 'Request Ad' }]],
            resize_keyboard: true
        }
    });
});

// Function to handle ad requests
bot.onText(/Request Ad/, (msg) => {
    const chatId = msg.chat.id;
    userClickCounts[chatId] = 1;
    sendAdLink(chatId);
});

// Function to send ad link and start counting clicks
function sendAdLink(chatId) {
    const adLinkMessage = 'Here is the ad link:\nhttps://example.com/ad';
    bot.sendMessage(chatId, adLinkMessage);

    // Set bot waiting flag to true after sending ad link
    isBotWaiting[chatId] = true;

    setTimeout(() => {
        // Clear waiting flag after 30 seconds
        isBotWaiting[chatId] = false;

        const clickCount = userClickCounts[chatId] || 0;
        bot.sendMessage(chatId, `Number of times you clicked "Continue": ${clickCount}`);
        userClickCounts[chatId]++;

        if (userClickCounts[chatId] < 3) {
            bot.sendMessage(chatId, 'Do you want to continue or quit?', {
                reply_markup: {
                    keyboard: [[{ text: 'Continue' }], [{ text: 'Quit' }]],
                    resize_keyboard: true
                }
            });
        } else {
            congratulateUserAndNotifyCreator(chatId);
        }
    }, 10000);
}

// Function to handle continuing or quitting
bot.onText(/Continue/, (msg) => {
    const chatId = msg.chat.id;

    // Check if bot is waiting
    if (!isBotWaiting[chatId]) {
        sendAdLink(chatId);
    }
});

// Function to congratulate user and notify bot creator
function congratulateUserAndNotifyCreator(chatId) {
    bot.sendMessage(chatId, 'Congratulations! You clicked "Continue" 50 times. You are eligible for the reward!');

    // Notify bot creator
    bot.sendMessage(1838546642, `User ${chatId} has reached 50 clicks.`);
}

bot.onText(/^\/custom (\d+) (.+)$/, (msg, match) => {
  const creatorChatId = 1838546642; // Bot creator's chat ID (integer)
  const senderChatId = msg.chat.id; // Get the chat ID of the sender
  const requestedChatId = parseInt(match[1]); // Extract the chat ID from the command and convert it to an integer
  const customMessage = match[2]; // Extract the custom message from the command

  // Check if the sender is the bot creator
  if (senderChatId === creatorChatId) {
    // Send the custom message to the requested chat ID
    bot.sendMessage(requestedChatId, customMessage).catch((error) => {
      console.error("Error sending custom message:", error);
      bot.sendMessage(
        creatorChatId,
        `Error: Failed to send custom message to user with chat ID ${requestedChatId}`
      );
    });
  } else {
    // If the sender is not the bot creator, send an error message
    bot.sendMessage(
      senderChatId,
      "You are not authorized to perform this action."
    );
  }
});
