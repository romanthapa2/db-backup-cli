import path from "path";
import { promises as fs } from "fs";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH = path.join(__dirname, "../backup-config.json");

export default async function getConfig() {
  try {
    const data = await fs.readFile(CONFIG_PATH);
    return JSON.parse(data);
  } catch (error) {
    console.log(
      chalk.red(
        "Could not read config file. Make sure the file exists and the path is correct."
      )
    );
    console.log(
      chalk.yellow("Run `backlash configure` to create a new config file.")
    );
    process.exit(1);
  }
}