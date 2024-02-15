import puppeteerRealBrowser from "../utils/puppeteerRealBrowser.js";
import CDP from "chrome-remote-interface";
import readline from "readline";
import {
  loadProfile,
  createRandomProfile,
  getProfileList,
} from "../profile/profileManager.js";
import { applyProfileToPage } from "../utils/browserSettings.js";
import {
  saveCookies,
  loadCookies,
  setCookiesForProfile,
} from "../utils/cookiesManager.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function startPuppeteer(accountName) {
  const profile = loadProfile(accountName);
  try {
    const { browser, page } = await puppeteerRealBrowser({
      proxy: profile.proxy,
      profile: profile,
    });
    console.log(page);
    await applyProfileToPage(browser, page, profile);
    try {
      const cookies = await loadCookies(accountName);
      if (cookies && Array.isArray(cookies) && cookies.length > 0) {
        await setCookiesForProfile(page, cookies);
      } else {
        console.error("No cookies to set, but continuing execution.");
      }
    } catch (error) {
      console.error("Error setting cookies:", error);
    }
    //await page.goto('https://fingerprint.com/demo');
    //await page.goto('https://bot.sannysoft.com/');
    //await page.goto('https://browserleaks.com/canvas');

    await page.goto("https://demo.fingerprint.com/playground");
    rl.question(
      "Do you want to save cookies for this profile? (yes/no) ",
      async (answer) => {
        if (answer.toLowerCase().startsWith("y")) {
          const finalCookies = await page.cookies();
          saveCookies(accountName, finalCookies);
          console.log("Cookies have been saved.");
        } else {
          console.log("Cookies were not saved.");
        }

        rl.close();
        await browser.close();
      },
    );
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

function askForProfile() {
  const profiles = getProfileList();
  console.log("Available profiles:");
  profiles.forEach((profile, index) => {
    console.log(`${index + 1}. ${profile}`);
  });

  rl.question(
    'Enter the number of the profile to use, or type "new" to create a new profile: ',
    (answer) => {
      if (answer.toLowerCase() === "new") {
        rl.question("Enter a name for the new profile: ", (newProfileName) => {
          if (newProfileName) {
            const profile = createRandomProfile(newProfileName);
            console.log(`New profile created: ${newProfileName}`);
            startPuppeteer(newProfileName);
          } else {
            console.log("Profile name cannot be empty. Please try again.");
            askForProfile();
          }
          rl.close();
        });
      } else {
        const index = parseInt(answer, 10) - 1;
        if (index >= 0 && index < profiles.length) {
          startPuppeteer(profiles[index]);
        } else {
          console.log("Invalid selection. Please try again.");
          askForProfile();
        }
      }
    },
  );
}

askForProfile();
