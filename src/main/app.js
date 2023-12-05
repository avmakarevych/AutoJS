const puppeteer = require('puppeteer-extra');
const readline = require('readline');
const { loadProfile, createRandomProfile, getProfileList } = require('../profile/profileManager');
const { applyProfileToPage } = require('../utils/browserSettings');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startPuppeteer(accountName) {
    const profile = loadProfile(accountName);

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-blink-features=AutomationControlled']
    });


    const page = await browser.newPage();
    await applyProfileToPage(page, profile);
    const pages = await browser.pages();

    if (pages.length > 1) {
        await pages[0].close();
    }
    await page.goto('https://fingerprint.com/demo/');
}

function askForProfile() {
    const profiles = getProfileList();
    console.log('Available profiles:');
    profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile}`);
    });

    rl.question('Enter the number of the profile to use, or type "new" to create a new profile: ', answer => {
        if (answer.toLowerCase() === 'new') {
            rl.question('Enter a name for the new profile: ', newProfileName => {
                if (newProfileName) {
                    const profile = createRandomProfile(newProfileName);
                    console.log(`New profile created: ${newProfileName}`);
                    startPuppeteer(newProfileName);
                } else {
                    console.log('Profile name cannot be empty. Please try again.');
                    askForProfile();
                }
                rl.close();
            });
        } else {
            const index = parseInt(answer, 10) - 1;
            if (index >= 0 && index < profiles.length) {
                startPuppeteer(profiles[index]);
            } else {
                console.log('Invalid selection. Please try again.');
                askForProfile();
            }
        }
    });
}

askForProfile();
