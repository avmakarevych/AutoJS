const fs = require('fs');
const path = require('path');

const cookiesDir = path.join(__dirname, '..', '..', 'Profiles', 'Cookies');

function getCookiesFilePath(profileName) {
    if (!fs.existsSync(cookiesDir)) {
        fs.mkdirSync(cookiesDir, { recursive: true });
    }
    return path.join(cookiesDir, `${profileName}-cookies.json`);
}

function saveCookies(profileName, cookies) {
    const filePath = getCookiesFilePath(profileName);
    fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2));
}

function loadCookies(profileName) {
    const filePath = getCookiesFilePath(profileName);
    try {
        if (fs.existsSync(filePath)) {
            const cookies = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(cookies);
        }
    } catch (error) {
        console.error(`Could not load cookies for profile ${profileName}:`, error);
    }
    return [];
}

module.exports = {
    saveCookies,
    loadCookies
};
