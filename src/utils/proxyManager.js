import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proxyFilePath = path.join(
  __dirname,
  "..",
  "..",
  "UserData",
  "proxyList.txt",
);

function getProxies() {
  const proxyData = fs.readFileSync(proxyFilePath, "utf8");
  return proxyData.split("\n").filter(Boolean); // Remove any empty lines
}

function updateProxies(proxies) {
  fs.writeFileSync(proxyFilePath, proxies.join("\n"));
}

function parseProxy(proxyString) {
  const [host, port, login, password] = proxyString.split(":");
  return { host, port, login, password };
}

function saveProxyForAccount(accountName, proxy) {
  const accountDir = path.join(__dirname, "..", "Accounts", accountName);
  if (!fs.existsSync(accountDir)) {
    fs.mkdirSync(accountDir, { recursive: true });
  }
  const configFilePath = path.join(accountDir, "config.txt");
  fs.writeFileSync(configFilePath, proxy);
}

function assignProxyToProfile(accountName) {
  const proxies = getProxies();
  const proxyToAssign = parseProxy(proxies.shift());
  updateProxies(proxies);

  return proxyToAssign;
}

export {
  getProxies,
  updateProxies,
  parseProxy,
  saveProxyForAccount,
  assignProxyToProfile,
};
