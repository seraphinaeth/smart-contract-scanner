const fs = require('fs');
const path = require('path');

class SecurityReporter {
  constructor(vulnerabilities, parsed, filename) {
    this.vulnerabilities = vulnerabilities;
    this.parsed = parsed;
    this.filename = filename;
  }

  generateSummary() {
    const severityCounts = {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };

    this.vulnerabilities.forEach(vuln => {
      severityCounts[vuln.severity]++;
    });

    return {
      totalVulns: this.vulnerabilities.length,
      severityCounts,
      contractsCount: this.parsed.contracts.length,
      functionsCount: this.parsed.functions.length,
      linesOfCode: this.parsed.totalLines
    };
  }

  generateJsonReport() {
    const summary = this.generateSummary();
    
    return {
      filename: this.filename,
      timestamp: new Date().toISOString(),
      summary,
      vulnerabilities: this.vulnerabilities,
      contracts: this.parsed.contracts,
      functions: this.parsed.functions
    };
  }

  saveReport(outputPath) {
    const report = this.generateJsonReport();
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    return outputPath;
  }

  generateMarkdownReport() {
    const summary = this.generateSummary();
    let md = `# Security Report: ${this.filename}\n\n`;
    
    md += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
    
    md += `## Summary\n`;
    md += `- Total Issues: ${summary.totalVulns}\n`;
    md += `- High Severity: ${summary.severityCounts.HIGH}\n`;
    md += `- Medium Severity: ${summary.severityCounts.MEDIUM}\n`;
    md += `- Low Severity: ${summary.severityCounts.LOW}\n`;
    md += `- Contracts: ${summary.contractsCount}\n`;
    md += `- Functions: ${summary.functionsCount}\n\n`;
    
    if (this.vulnerabilities.length > 0) {
      md += `## Issues Found\n\n`;
      this.vulnerabilities.forEach((vuln, index) => {
        md += `### ${index + 1}. ${vuln.type} (${vuln.severity})\n`;
        md += `**Line:** ${vuln.line}\n\n`;
        md += `**Description:** ${vuln.description}\n\n`;
        md += `**Code:**\n\`\`\`solidity\n${vuln.code}\n\`\`\`\n\n`;
      });
    }
    
    return md;
  }
}

module.exports = SecurityReporter;