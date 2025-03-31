import getConfig from "../lib/getConfig.js";
import { MongoDBBackup } from "../lib/backups/mongodbBackup.js";
import { MySQLBackup } from "../lib/backups/mySqlBackup.js";
import { logActivity } from "../lib/logger.js";

function getBackupClass(config) {
  switch (config.type) {
    case "mongodb":
      return new MongoDBBackup(config);
    // Add cases for other databases
    case "mysql":
     return new MySQLBackup(config);
    default:
      throw new Error("Unsupported database type");
  }
}

export default (program) => {
  program
    .command("backup")
    .description("Backup database")
    .allowUnknownOption(true)
    .action(async (_, options) => {
      const config = await getConfig();

      const backuoInstance = getBackupClass(config);
      const startTime = Date.now();
       let status = "success";
       let error = null;
       let stderr = null;
 
       try {
        const { info } = await backupInstance.createBackup();
        console.log(info);
        stderr = info;
       } catch (err) {
         status = "failed";
         error = err;
       }
 
       const endTime = Date.now();
       logActivity({
        command: "backup",
         startTime: new Date(startTime),
         endTime: new Date(endTime),
         status,
         timeTaken: endTime - startTime,
         stderr,
         error,
       });
    });
};