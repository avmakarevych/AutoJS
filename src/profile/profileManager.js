import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomizeWebGL } from "./webGLConfig.js";
import { assignProxyToProfile } from "../utils/proxyManager.js";
import {
  randomizeFromList,
  randomBoolean,
  randomChromeObject,
  randomPlugins,
  randomLanguages,
  randomMediaDevices,
  randomConsoleDebugBehavior,
  randomizeCanvasFingerprint,
  randomizeAudioContext,
  randomizeWebGLFingerprint,
  randomizeFontPreferences,
  randomizeFonts,
  randomizeFeatureControlData,
} from "../utils/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const profilesDir = path.join(__dirname, "..", "..", "Profiles");

function createRandomProfile(profileName) {
  const dataDir = path.join(__dirname, "..", "..", "data");
  const userAgents = readDataFromFile(
    path.join(dataDir, "userAgentsOld.txt"),
  ).split("\n");
  const screenResolutions = JSON.parse(
    readDataFromFile(path.join(dataDir, "screenResolutions.json")),
  );
  const timeZones = readDataFromFile(path.join(dataDir, "timeZones.txt")).split(
    "\n",
  );
  const webGLConfig = randomizeWebGL();
  const fontPreferences = randomizeFontPreferences();
  const fonts = randomizeFonts();
  const { host, port, login, password } = assignProxyToProfile(profileName);

  const profile = {
    proxy: {
      host,
      port,
      login,
      password,
    },
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
    consoleDebugBehavior: randomConsoleDebugBehavior(),
    webGLFingerprint: randomizeWebGLFingerprint(),
    fontPreferences: {
      value: fontPreferences,
    },
    fonts: {
      value: fonts,
    },
    featureControlData: randomizeFeatureControlData(),
  };

  saveProfile(profileName, profile);

  return profile;
}

function getProfileList() {
  return fs
    .readdirSync(profilesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));
}

function saveProfile(accountName, profile) {
  const profilePath = path.join(profilesDir, `${accountName}.json`);
  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
}

function loadProfile(accountName) {
  const profilePath = path.join(profilesDir, `${accountName}.json`);
  if (fs.existsSync(profilePath)) {
    return JSON.parse(fs.readFileSync(profilePath, "utf8"));
  } else {
    console.log(`Profile for ${accountName} not found. Creating a new one.`);
    return createRandomProfile(accountName);
  }
}

function readDataFromFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(`Error reading from ${filePath}:`, err);
    throw err;
  }
}

export { createRandomProfile, saveProfile, loadProfile, getProfileList };
