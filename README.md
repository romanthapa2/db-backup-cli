# Backlash

A powerful and flexible CLI tool for managing database backups and restoration.

## Overview

Backlash is a cross-platform command-line utility designed to simplify database backup and restoration tasks. It supports multiple database types including MongoDB and MySQL, with a modular architecture that makes it easy to add support for additional database systems.

## Features

- **Multiple Database Support**: Works with MongoDB and MySQL databases
- **Configuration Management**: Simple setup with interactive prompts for easy configuration
- **Scheduled Backups**: Run ad-hoc backups or schedule them with your system's scheduler
- **Backup Logging**: Detailed logs of all backup and restore operations
- **Error Handling**: Robust error handling and detailed reporting

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/backlash.git
cd backlash

# Install dependencies
npm install

# Install globally (optional)
npm install -g .
```

## Usage

### Configuration

Before you can start using Backlash, you need to configure your database connection:

```bash
# Using locally installed version
npm start configure

# Using globally installed version
backlash configure
```

The configuration wizard will guide you through the setup process, asking for:
- Database type (MongoDB, MySQL)
- Connection details (host, port, username, password)
- Database name
- Backup location

### Backing Up a Database

```bash
# Using locally installed version
npm start backup

# Using globally installed version
backlash backup
```

### Restoring a Database

```bash
# Using locally installed version
npm start restore

# Using globally installed version
backlash restore
```

## Configuration File

Backlash stores your database configuration in `backup-config.json` in the project root. A typical configuration looks like:

```json
{
  "type": "mongodb",
  "uri": "mongodb://localhost:27017",
  "database": "mydb",
  "backupDir": "./backup"
}
```

## Requirements

- Node.js 14.0 or higher
- For MongoDB backups: MongoDB Database Tools must be installed
- For MySQL backups: MySQL client tools must be installed

## Project Structure

```
backlash/
├── cli.js               # Main CLI entry point
├── commands/            # Command implementations
│   ├── backup.js        # Backup command logic
│   ├── configure.js     # Configuration command logic
│   └── restore.js       # Restore command logic
├── lib/                 # Core functionality
│   ├── backups/         # Database-specific backup implementations
│   │   ├── baseBackup.js    # Base backup class
│   │   ├── mongodbBackup.js # MongoDB backup implementation
│   │   └── mySqlBackup.js   # MySQL backup implementation
│   ├── databaseConnection.js # Connection testing
│   ├── getConfig.js     # Configuration handling
│   └── logger.js        # Logging system
├── backup/              # Default backup storage directory
└── backup-config.json   # Configuration file
```

## Logs

Backup and restore activities are logged to `backup-log.txt` in the project root.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
