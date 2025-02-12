#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const SolidityParser = require('./parser');
const VulnerabilityScanner = require('./scanner');
const SecurityReporter = require('./reporter');

program
  .name('smart-contract-scanner')
  .description('Security scanner for Ethereum smart contracts')
  .version('0.2.0')
  .argument('<file>', 'Solidity contract file to scan')
  .option('-o, --output <type>', 'output format (json|md)', 'console')
  .option('-r, --report <path>', 'save report to file')
  .action((file, options) => {
    console.log(chalk.blue('🔍 Smart Contract Scanner v0.2.0'));
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
    
    const scanner = new VulnerabilityScanner(content, parsed);
    const vulnerabilities = scanner.scan();
    
    console.log(chalk.blue('\n🔍 Security Analysis Results:'));
    
    if (vulnerabilities.length === 0) {
      console.log(chalk.green('✅ No vulnerabilities detected'));
    } else {
      console.log(chalk.red(`⚠️  Found ${vulnerabilities.length} potential issues:\n`));
      
      vulnerabilities.forEach((vuln, index) => {
        const severity = vuln.severity === 'HIGH' ? chalk.red(vuln.severity) : 
                        vuln.severity === 'MEDIUM' ? chalk.yellow(vuln.severity) : 
                        chalk.blue(vuln.severity);
        
        console.log(`${index + 1}. ${chalk.cyan(vuln.type)} [${severity}]`);
        console.log(`   Line ${vuln.line}: ${vuln.description}`);
        console.log(`   Code: ${chalk.gray(vuln.code)}\n`);
      });
    }
    
    if (options.report || options.output !== 'console') {
      const reporter = new SecurityReporter(vulnerabilities, parsed, path.basename(file));
      
      if (options.output === 'json') {
        const reportPath = options.report || `${path.basename(file, '.sol')}-report.json`;
        const savedPath = reporter.saveReport(reportPath);
        console.log(chalk.green(`\n✅ JSON report saved to: ${savedPath}`));
      }
      
      if (options.output === 'md') {
        const mdReport = reporter.generateMarkdownReport();
        const reportPath = options.report || `${path.basename(file, '.sol')}-report.md`;
        fs.writeFileSync(reportPath, mdReport);
        console.log(chalk.green(`\n✅ Markdown report saved to: ${reportPath}`));
      }
    }
  });

program.parse();