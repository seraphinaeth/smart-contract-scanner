class VulnerabilityScanner {
  constructor(code, parsed) {
    this.code = code;
    this.parsed = parsed;
    this.lines = code.split('\n');
    this.vulnerabilities = [];
  }

  checkReentrancy() {
    const reentrancyPatterns = [
      /\.call\(/,
      /\.send\(/,
      /\.transfer\(/
    ];
    
    this.lines.forEach((line, index) => {
      reentrancyPatterns.forEach(pattern => {
        if (pattern.test(line) && !line.includes('require(') && !line.includes('assert(')) {
          this.vulnerabilities.push({
            type: 'Reentrancy Risk',
            line: index + 1,
            severity: 'HIGH',
            description: 'External call detected - check for reentrancy protection',
            code: line.trim()
          });
        }
      });
    });
  }

  checkAccessControl() {
    const publicFunctions = this.parsed.functions.filter(f => 
      f.visibility === 'public' && !f.content.includes('modifier')
    );
    
    publicFunctions.forEach(func => {
      if (func.name !== 'constructor' && !func.content.includes('onlyOwner')) {
        this.vulnerabilities.push({
          type: 'Access Control',
          line: func.line,
          severity: 'MEDIUM',
          description: 'Public function without access control modifier',
          code: func.content
        });
      }
    });
  }

  checkIntegerOverflow() {
    const mathOperations = ['+', '-', '*'];
    
    this.lines.forEach((line, index) => {
      mathOperations.forEach(op => {
        if (line.includes(op) && line.includes('uint') && !line.includes('SafeMath')) {
          this.vulnerabilities.push({
            type: 'Integer Overflow',
            line: index + 1,
            severity: 'HIGH',
            description: 'Arithmetic operation without overflow protection',
            code: line.trim()
          });
        }
      });
    });
  }

  checkGasOptimization() {
    this.lines.forEach((line, index) => {
      if (line.includes('for (') && line.includes('.length')) {
        this.vulnerabilities.push({
          type: 'Gas Optimization',
          line: index + 1,
          severity: 'LOW',
          description: 'Cache array length to save gas in loops',
          code: line.trim()
        });
      }
      
      if (line.includes('storage') && line.includes('memory')) {
        this.vulnerabilities.push({
          type: 'Gas Optimization',
          line: index + 1,
          severity: 'LOW',
          description: 'Consider storage vs memory usage for gas efficiency',
          code: line.trim()
        });
      }
    });
  }

  checkTimestampDependence() {
    const timestampPatterns = [
      /block\.timestamp/,
      /now/
    ];
    
    this.lines.forEach((line, index) => {
      timestampPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          this.vulnerabilities.push({
            type: 'Timestamp Dependence',
            line: index + 1,
            severity: 'MEDIUM',
            description: 'Avoid using block.timestamp for critical logic',
            code: line.trim()
          });
        }
      });
    });
  }

  scan() {
    this.checkReentrancy();
    this.checkAccessControl();
    this.checkIntegerOverflow();
    this.checkGasOptimization();
    this.checkTimestampDependence();
    
    return this.vulnerabilities;
  }
}

module.exports = VulnerabilityScanner;