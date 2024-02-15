import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function randomizeWebGL() {
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "webGLConfigurations.json",
  );
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const webGLConfigurations = JSON.parse(data);
    return webGLConfigurations[
      Math.floor(Math.random() * webGLConfigurations.length)
    ];
  } catch (err) {
    console.error("Error reading webGL configurations:", err);
    throw err;
  }
}

export { randomizeWebGL };
