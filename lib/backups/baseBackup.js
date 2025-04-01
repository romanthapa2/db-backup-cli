import ora from "ora";
import chalk from "chalk";
import { exec } from "child_process";

export class BaseBackup {
  constructor(config) {
    this.config = config;
    this.spinner = ora();
  }

  startSpinner(message) {
    this.spinner.start(message);
  }

  succeed(message) {
    this.spinner.succeed(chalk.green(message));
  }

  fail(message) {
    this.spinner.fail(chalk.red(message));
  }

  async executeCommand(command, successMessage, failureMessage) {
    console.log("Executing command:", command); 
    try {
      const info = await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.log("Error:", error);
            console.log("stderr:", stderr);
            this.fail(failureMessage);
            reject(error);
          } else {
            this.succeed(successMessage);
            resolve(stderr || stdout);
          }
        });
      });

      return { info };
    } catch (error) {
      console.error("Command execution failed:", error);
      throw error; // Propagate the error to be handled by the caller
    }
  }
}
