import chalk from "chalk";
import { exec } from "child_process";
import { testMongoDBConnection } from "../databaseConnectors.js";
import ora from "ora";

export async function createMongoDBBackup(config) {
  try {
    let command = `mongodump --uri=${config.uri} --db=${config.databaseName} --out=${config.backupDir} --gzip`;
    await testMongoDBConnection(config);

    console.log(chalk.blue("Creating backup..."));
    console.log(chalk.blue("Executing command: ", command));

    exec(command, (error, _, stderr) => {
      if (error || !stderr) {
        console.log(
          spinner.fail(
            chalk.red("Error creating backup, Please check the Config values")
          )
        );
        return;
      }
      console.log(
        spinner.succeed(
          chalk.green("Backup created successfully at ", config.outputDir)
        )
      );
    });
  } catch (error) {
    spinner.fail(chalk.red("Error creating backup"));
  }
}

export async function restoreMongoDBBackup(config) {
  const spinner = ora("Restoring backup").start();

  try {
    const connection = await testMongoDBConnection(config, spinner);
    if (!connection) {
      return;
    }

    let command = `mongorestore --uri=${config.uri} --db=${config.databaseName} ${config.backupDir} --gzip`;

    exec(command, (error, _, stderr) => {
      if (error || !stderr) {
        spinner.fail(chalk.red("Failed to restore backup"));
        return;
      }
      spinner.succeed(chalk.green("Backup restored successfully"));
    });
  } catch (error) {
    spinner.fail(chalk.red("Failed to restore backup"));
  }
}
