import { launch } from "chrome-launcher";
import chromium from "chromium";
import CDP from "chrome-remote-interface";
import axios from "axios";
import puppeteer from "puppeteer-extra";
import Xvfb from "xvfb";
import { applyProfileToPage } from "./browserSettings.js";

async function puppeteerConnect(browser, browserWSEndpoint, profile) {
  try {
    const browser = await puppeteer.connect({ browserWSEndpoint });

    browser.on("targetcreated", async (target) => {
      const page = await target.page(); // Convert target to page
      if (page) {
        applyProfileToPage(browser, page, profile); // Apply profile only if it's a valid page
      }
    });

    return browser;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const puppeteerRealBrowser = ({
  proxy = {},
  action = "default",
  headless = false,
  executablePath = "default",
  profile,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      var xvfbsession = null;
      var chromePath = chromium.path;

      if (executablePath !== "default") {
        chromePath = executablePath;
      }

      const chromeFlags = ["--no-sandbox"];

      if (headless === true && process.platform !== "linux") {
        chromeFlags.push("--headless");
      }

      if (proxy && proxy.host && proxy.host.length > 0) {
        chromeFlags.push(`--proxy-server=${proxy.host}:${proxy.port}`);
      }

      if (process.platform === "linux") {
        try {
          var xvfbsession = new Xvfb({
            silent: true,
            xvfb_args: ["-screen", "0", "1280x720x24", "-ac"],
          });
          xvfbsession.startSync();
        } catch (err) {
          console.log(err.message);
        }
      }

      var chrome = await launch({
        chromePath,
        chromeFlags,
      });
      var cdpSession = await CDP({ port: chrome.port });

      const { Network, Page, Runtime, Target } = cdpSession;

      await Runtime.enable();
      await Network.enable();
      await Page.enable();
      await Page.setLifecycleEventsEnabled({ enabled: true });

      await Target.setDiscoverTargets({ discover: true });

      var data = await axios
        .get("http://127.0.0.1:" + chrome.port + "/json/version")
        .then((response) => {
          response = response.data;
          return {
            browserWSEndpoint: response.webSocketDebuggerUrl,
            agent: response["User-Agent"],
          };
        })
        .catch((err) => {
          throw new Error(err.message);
        });

      if (action !== "default") {
        const closeSession = async () => {
          try {
            if (cdpSession) {
              await cdpSession.close();
            }
            if (chrome) {
              await chrome.kill();
            }

            if (xvfbsession && xvfbsession !== null) {
              try {
                xvfbsession.stopSync();
                xvfbsession = null;
              } catch (err) {}
            }
          } catch (err) {}
          return true;
        };

        var smallResponse = {
          userAgent: data.agent,
          browserWSEndpoint: data.browserWSEndpoint,
          closeSession: closeSession,
          chromePath: chromePath,
        };
        resolve(smallResponse);
        return smallResponse;
      }

      let browser = await puppeteer.connect({
        targetFilter: (target) => !!target.url(),
        browserWSEndpoint: data.browserWSEndpoint,
      });
      browser = await puppeteerConnect(
        browser,
        data.browserWSEndpoint,
        profile,
      );

      browser.close = async () => {
        if (cdpSession) {
          await cdpSession.close();
        }
        if (chrome) {
          await chrome.kill();
        }

        if (xvfbsession && xvfbsession !== null) {
          try {
            xvfbsession.stopSync();
            xvfbsession = null;
          } catch (err) {}
        }
      };

      const pages = await browser.pages();
      const page = pages[0];
      await page.authenticate({
        username: proxy.login,
        password: proxy.password,
      });
      await page.setUserAgent(data.agent);
      await page.setViewport({
        width: 1920,
        height: 1080,
      });
      resolve({
        browser: browser,
        page: page,
      });
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  });
};

export default puppeteerRealBrowser;
