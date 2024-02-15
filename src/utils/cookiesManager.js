import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cookiesDir = path.join(__dirname, "..", "..", "Profiles", "Cookies");

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
  try {
    const filePath = getCookiesFilePath(profileName);
    console.log(`Looking for cookies file at: ${filePath}`);
    if (fs.existsSync(filePath)) {
      const cookies = fs.readFileSync(filePath, "utf8");
      const parsedCookies = JSON.parse(cookies);
      return parsedCookies;
    }
  } catch (error) {
    console.error(`Could not load cookies for profile ${profileName}:`, error);
  }
  return [];
}

async function setCookiesForProfile(page, cookies) {
  for (const cookie of cookies) {
    await page.setCookie({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expires,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite ? cookie.sameSite : "Lax",
    });
  }
}

export { saveCookies, loadCookies, setCookiesForProfile };
