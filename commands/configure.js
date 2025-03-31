import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { input, select, password } from "@inquirer/prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG_PATH = path.join(__dirname, "../backup-config.json");

/**
 * Prompt the user for database connection settings based on the selected database type.
 * @param {string} dbType - The selected database type.
 * @returns {Promise<Object>} - The database configuration object.
 */
async function getDatabaseConfig(dbType) {
  switch (dbType) {
    case "mysql":
    case "postgresql":
      return {
        host: await input({ message: "Enter host:", default: "localhost" }),
        port: await input({
          message: `Enter port:`,
          default: dbType === "mysql" ? "3306" : "5432",
          required:true
        }),
        user: await input({ message: "Enter username:" }),
        password: await password({ message: "Enter password:" }),
        database: await input({ message: "Enter database name:" }),
        backupDir: await input({
          message: "Enter the path to save backup files:",
          default: "./backup",
          required: true,
        }),
      };

    case "sqlite":
      return {
        filepath: await input({
          message: "Enter SQLite file path:",
          default: "./database.sqlite",
          required:true
        }),
        databaseName: await input({
          message: "Enter database name:",
          required: true,
        }),
        backupDir: await input({
          message: "Enter the path to save backup files:",
          default: "./backup",
          required: true,
        }),
      };

    case "mongodb":
      return {
        uri: await input({
          message: "Enter MongoDB connection URI:",
          default: "mongodb://localhost:27017",
          required:true
        }),
        database: await input({ message: "Enter database name:",required:true }),
        backupDir: await input({
          message: "Enter backup directory:",
          default: "./backup",
          required:true
        }),
      };

    default:
      throw new Error("Unsupported database type.");
  }
} 

/**
 * Save the database configuration to a JSON file.
 * @param {string} dbType - The selected database type.
 * @param {Object} config - The database configuration object.
 */
function saveConfig(dbType, config) {
  const data = JSON.stringify({ type: dbType, ...config }, null, 2);
  fs.writeFileSync(CONFIG_PATH, data);
  console.log(`Configuration saved to ${CONFIG_PATH}`);
}

export default (program) => {
  program
    .command("configure")
    .description("Configure database connection settings")
    .action(async () => {
      try {
        // Prompt user to select database type
        const dbType = await select({
          message: "Select database type",
          choices: [
            { name: "MySQL", value: "mysql" },
            { name: "PostgreSQL", value: "postgresql" },
            { name: "SQLite", value: "sqlite" },
            { name: "MongoDB", value: "mongodb" },
          ],
          required:true
        });

        // Get database config based on selection
        const config = await getDatabaseConfig(dbType);

        // Save configuration to file
        saveConfig(dbType, config);
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    });
};
