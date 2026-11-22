
const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.static(__dirname));

let dailyQuote = null;
let lastFetchDate = null;

app.get('/api/quote', async (req, res) => {
    try {
        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Europe/Athens'
        });

        if (!dailyQuote || lastFetchDate !== today) {
            const response = await fetch('https://zenquotes.io/api/today');

            if (!response.ok) {
                throw new Error(`ZenQuotes status: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data) || !data[0]?.q) {
                throw new Error('Invalid quote response');
            }

            dailyQuote = {
                quote: data[0].q,
                author: data[0].a,
                date: data[0].date
            };

            lastFetchDate = today;
        }

        res.json(dailyQuote);

    } catch (error) {
        console.error('Quote error:', error);
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

console.log('started');
