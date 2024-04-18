const puppeteer = require('puppeteer');
const readline = require('readline');

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    try {
        // Navigate to the website
        await page.goto('https://typing-speed.net/');

        // Extract text from spans within the div
        let characters = await page.evaluate(() => {
            const spanElements = Array.from(document.querySelectorAll('#text span'));
            return spanElements.map(span => span.textContent);
        });

        // Replace '_' with space
        characters = characters.map(char => char === '_' ? ' ' : char);

     
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Type "dumb" to start typing: ', async (answer) => {
            if (answer.trim().toLowerCase() === 'dumb') {
               
                await typeCharacters(page, characters);
                rl.close();
            } else {
                console.log('Invalid input. Type "dumb" to start typing.');
                rl.close();
            }
        });

       
        rl.input.on('keypress', async (key, data) => {
            if (data.name === 'dumb') {
                await typeCharacters(page, characters);
                rl.close();
            }
        });

    } finally {
        // Close the browser
        // await browser.close();
    }
}

async function typeCharacters(page, characters) {
    for (const character of characters) {
        await page.keyboard.press(character); 
    }
}

main().catch(console.error);
