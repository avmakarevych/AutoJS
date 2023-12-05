const puppeteer = require('puppeteer-extra');
const readline = require('readline');
const { loadProfile, createRandomProfile, getProfileList } = require('../profile/profileManager');
const { applyProfileToPage } = require('../utils/browserSettings');
const { saveCookies, loadCookies } = require('../utils/cookiesManager');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startPuppeteer(accountName) {
    const profile = loadProfile(accountName);
    const { host, port } = profile.proxy;

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: ['--enable-automation'],
        args: [
            '--disable-blink-features=AutomationControlled',
            `--proxy-server=${host}:${port}`
        ]
    });


    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            const newPage = await target.page();
            if (newPage) {
                await applyProfileToPage(newPage, profile);
            }
        }
    });

    const page = await browser.newPage();

    const cookies = loadCookies(accountName);
    if (cookies.length > 0) {
        await page.setCookie(...cookies);
    }

    if (profile.proxy && profile.proxy.login && profile.proxy.password) {
        await page.authenticate({
            username: profile.proxy.login,
            password: profile.proxy.password
        });
    }
    const pages = await browser.pages();

    if (pages.length > 1) {
        await pages[0].close();
    }

    await page.goto('https://fingerprint.com/demo/');

    rl.question('Do you want to save cookies for this profile? (yes/no) ', async (answer) => {
        if (answer.toLowerCase().startsWith('y')) {
            const finalCookies = await page.cookies();
            saveCookies(accountName, finalCookies);
            console.log('Cookies have been saved.');
        } else {
            console.log('Cookies were not saved.');
        }

        rl.close();
        await browser.close();
    });
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
