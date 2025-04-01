import { BaseBackup } from "./baseBackup.js";
import { testMongoDBConnection } from "../databaseConnection.js";
import { mkdir, readdir } from "fs/promises";
import { resolve } from "path";

export class MongoDBBackup extends BaseBackup {
  async createBackup() {
    this.startSpinner("Creating MongoDB backup...");

    const connection = await testMongoDBConnection(this.config, this.spinner);
    if (!connection) return;

    // Convert backup directory to absolute path
    const backupDir = resolve(process.cwd(), this.config.backupDir);
    console.log("Backup directory:", backupDir);
    
    // Ensure backup directory exists
    try {
      await mkdir(backupDir, { recursive: true });
      console.log("Backup directory created/verified");
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    // Create a subdirectory for the database
    const dbBackupDir = resolve(backupDir, this.config.database);
    try {
      await mkdir(dbBackupDir, { recursive: true });
      console.log("Database backup directory created/verified");
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    const command = `mongodump --uri="${this.config.uri}" --db="${this.config.database}" --out="${dbBackupDir}" --gzip`;
    console.log("Executing backup command:", command);
    
    const { info } = await this.executeCommand(
      command,
      "MongoDB backup successful",
      "MongoDB backup failed"
    );

    // Verify backup contents
    try {
      const files = await readdir(dbBackupDir);
      console.log("Database backup directory contents:", files);
      if (files.length === 0) {
        throw new Error("Database backup directory is empty after backup operation");
      }
    } catch (error) {
      console.error("Error verifying backup contents:", error);
      throw error;
    }

    return { info };
  }

  async restoreBackup() {
    this.startSpinner("Restoring MongoDB backup...");

    const connection = await testMongoDBConnection(this.config, this.spinner);
    if (!connection) return;

    // Convert backup directory to absolute path
    const backupDir = resolve(process.cwd(), this.config.backupDir);
    const dbBackupDir = resolve(backupDir, this.config.database);
    console.log("Restore backup directory:", dbBackupDir);

    // Verify backup exists before restore
    try {
      const files = await readdir(dbBackupDir);
      console.log("Database backup directory contents before restore:", files);
      if (files.length === 0) {
        throw new Error("Database backup directory is empty before restore operation");
      }
    } catch (error) {
      console.error("Error verifying backup contents before restore:", error);
      throw error;
    }

    const command = `mongorestore --gzip --uri="${this.config.uri}" "${dbBackupDir}"`;
    console.log("Executing restore command:", command);
    
    const { info } = await this.executeCommand(
      command,
      "MongoDB backup restored successfully",
      "Failed to restore MongoDB backup"
    );
    return { info };
  }
}