const getConfig = require("../utils/getConfig.js");
 import { MongoDBBackup } from "../lib/backups/mongodbBackup.js";
 import { MySQLBackup } from "../lib/backups/mySqlBackup.js";
 
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
 
export default(program) => {
   program
     .command("backup")
     .description("Backup database")
     .allowUnknownOption(true)
     .action(async (_, options) => {
       const config = await getConfig();
 
       const backuoInstance = getBackupClass(config);
       await backuoInstance.createBackup();
     });
 };