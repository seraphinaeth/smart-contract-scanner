#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const SolidityParser = require('./parser');

program
  .name('smart-contract-scanner')
  .description('Security scanner for Ethereum smart contracts')
  .version('0.1.0')
  .argument('<file>', 'Solidity contract file to scan')
  .action((file) => {
    console.log(chalk.blue('🔍 Smart Contract Scanner v0.1.0'));
    console.log(chalk.gray('Scanning:', file));
    
    if (!fs.existsSync(file)) {
      console.error(chalk.red('Error: File not found'));
      process.exit(1);
    }
    
    const content = fs.readFileSync(file, 'utf8');
    console.log(chalk.green('✓ File loaded successfully'));
    
    const parser = new SolidityParser(content);
    const parsed = parser.extractCode();
    
    console.log(chalk.blue('\n📊 Code Analysis:'));
    console.log(chalk.gray(`  Lines of code: ${parsed.totalLines}`));
    console.log(chalk.gray(`  Contracts found: ${parsed.contracts.length}`));
    console.log(chalk.gray(`  Functions found: ${parsed.functions.length}`));
    
    if (parsed.contracts.length > 0) {
      console.log(chalk.blue('\n📝 Contracts:'));
      parsed.contracts.forEach(contract => {
        console.log(chalk.cyan(`  - ${contract.name} (line ${contract.line})`));
      });
    }
    
    console.log(chalk.yellow('\n⚠️  Vulnerability scanning in progress...'));
  });

program.parse();