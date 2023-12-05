const fs = require('fs');
const path = require('path');
const profilesDir = path.join(__dirname, '..', '..', 'Profiles');

const { randomizeWebGL } = require('./webGLConfig');
const {
    randomizeFromList,
    randomBoolean,
    randomChromeObject,
    randomPlugins,
    randomLanguages,
    randomMediaDevices,
    randomConsoleDebugBehavior,
    randomizeCanvasFingerprint,
    randomizeAudioContext
} = require('../utils/utils');

function createRandomProfile(profileName) {
    const dataDir = path.join(__dirname, '..', '..', 'data');
    const userAgents = readDataFromFile(path.join(dataDir, 'userAgents.txt')).split('\n');
    const screenResolutions = JSON.parse(readDataFromFile(path.join(dataDir, 'screenResolutions.json')));
    const timeZones = readDataFromFile(path.join(dataDir, 'timeZones.txt')).split('\n');
    const webGLConfig = randomizeWebGL();

    const profile = {
        userAgent: randomizeFromList(userAgents),
        screenResolution: randomizeFromList(screenResolutions),
        timezone: randomizeFromList(timeZones),
        webdriverFlag: false,
        chromeObject: randomChromeObject(),
        plugins: randomPlugins(),
        languages: randomLanguages(),
        webglVendor: webGLConfig.vendor,
        webglRenderer: webGLConfig.renderer,
        preventIframe: false,
        mediaDevices: randomMediaDevices(),
        canvasFingerprint: randomizeCanvasFingerprint(),
        audioContext: randomizeAudioContext(),
        consoleDebugBehavior: randomConsoleDebugBehavior()
    };

    saveProfile(profileName, profile);

    return profile;
}

function getProfileList() {
    return fs.readdirSync(profilesDir)
        .filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
}

function saveProfile(accountName, profile) {
    const profilePath = path.join(profilesDir, `${accountName}.json`);
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
}

function loadProfile(accountName) {
    const profilePath = path.join(profilesDir, `${accountName}.json`);
    if (fs.existsSync(profilePath)) {
        return JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    } else {
        console.log(`Profile for ${accountName} not found. Creating a new one.`);
        return createRandomProfile(accountName);
    }
}

function readDataFromFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading from ${filePath}:`, err);
        throw err;
    }
}

module.exports = {
    createRandomProfile,
    saveProfile,
    loadProfile,
    getProfileList
};
