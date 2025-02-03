class SolidityParser {
  constructor(code) {
    this.code = code;
    this.lines = code.split('\n');
  }

  findFunctions() {
    const functions = [];
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*(public|private|external|internal)?\s*(payable|nonpayable|view|pure)?\s*(\{|returns)/i;
    
    this.lines.forEach((line, index) => {
      const match = line.match(functionRegex);
      if (match) {
        functions.push({
          name: match[1],
          line: index + 1,
          visibility: match[2] || 'public',
          mutability: match[3] || 'nonpayable',
          content: line.trim()
        });
      }
    });
    
    return functions;
  }

  findContracts() {
    const contracts = [];
    const contractRegex = /contract\s+(\w+)\s*(is\s+[\w\s,]+)?\s*\{/i;
    
    this.lines.forEach((line, index) => {
      const match = line.match(contractRegex);
      if (match) {
        contracts.push({
          name: match[1],
          line: index + 1,
          inheritance: match[2] || null
        });
      }
    });
    
    return contracts;
  }
  
  extractCode() {
    return {
      functions: this.findFunctions(),
      contracts: this.findContracts(),
      totalLines: this.lines.length
    };
  }
}

module.exports = SolidityParser;