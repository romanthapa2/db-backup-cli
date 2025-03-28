const { Command } = require("commander");
 const program = new Command();
 const packageJson = require("./package.json");
 require("./commands/configure")(program);
 require("./commands/backup")(program)
 
 program
   .name("backlash")
   .description(packageJson.description)
   .version(packageJson.version);
 
 program.parse(process.argv);