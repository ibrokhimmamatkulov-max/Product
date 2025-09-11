const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Telegram Bot
const TOKEN = process.env.TELEGRAM_TOKEN || '8240833093:AAHeVyHxpREzJKuBThYPk9qatTewIQA-lBA';
const CHAT_ID = process.env.CHAT_ID || '5568760903';
const bot = new TelegramBot(TOKEN, { polling: false });

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// CORS для Telegram Web App
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Web App routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is working!' });
});

// Products API
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: "1",
            name: "Яблоки",
            description: "Свежие яблоки",
            price: 100,
            category: "Фрукты",
            image: null
        },
        {
            id: "2", 
            name: "Хлеб",
            description: "Свежий хлеб",
            price: 50,
            category: "Выпечка",
            image: null
        }
    ];
    res.json(products);
});

// Order API
app.post('/api/order', async (req, res) => {
    try {
        const { customer, items, total } = req.body;
        
        let message = `🛒 НОВЫЙ ЗАКАЗ!\n\n`;
        message += `👤 Клиент: ${customer.name}\n`;
        message += `📞 Телефон: ${customer.phone}\n`;
        message += `🏠 Адрес: ${customer.address}\n\n`;
        message += `📦 Заказ:\n`;
        
        items.forEach(item => {
            message += `- ${item.name} x${item.quantity} - ${item.price * item.quantity} руб.\n`;
        });
        
        message += `\n💰 Итого: ${total} руб.`;

        await bot.sendMessage(CHAT_ID, message);
        res.json({ success: true, message: 'Order received' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Telegram Bot Command - ВАЖНО: URL должен быть вашим реальным!
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const webAppUrl = "https://product-store-race.onrender.com"; // ← ЗАМЕНИТЕ на ваш URL после деплоя
    
    bot.sendMessage(chatId, "Добро пожаловать в магазин! Нажмите кнопку ниже:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛒 Открыть магазин", web_app: { url: webAppUrl } }]
            ]
        }
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Telegram bot initialized`);
});
