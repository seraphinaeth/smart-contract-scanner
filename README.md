# Smart Contract Scanner

A security scanner for Ethereum smart contracts that detects common vulnerabilities.

## Features
- **Reentrancy Detection** - Identifies potential reentrancy vulnerabilities
- **Integer Overflow/Underflow** - Detects unsafe arithmetic operations
- **Access Control** - Checks for missing access modifiers
- **Gas Optimization** - Suggests gas-saving improvements
- **Timestamp Dependence** - Warns about risky timestamp usage
- **Code Analysis** - Parses Solidity contracts and extracts key information

## Usage
```bash
# Scan a contract file
npm start examples/vulnerable.sol

# Or use node directly
node src/index.js examples/vulnerable.sol
```

## Installation
```bash
npm install
```

## Example Output
```
🔍 Smart Contract Scanner v0.1.0
Scanning: examples/vulnerable.sol
✓ File loaded successfully

📊 Code Analysis:
  Lines of code: 28
  Contracts found: 1
  Functions found: 5

📝 Contracts:
  - VulnerableContract (line 3)

🔍 Security Analysis Results:
⚠️  Found 3 potential issues:

1. Reentrancy Risk [HIGH]
   Line 14: External call detected - check for reentrancy protection
   Code: (bool success, ) = msg.sender.call{value: amount}("");
```