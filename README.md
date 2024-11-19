# slp-audit-test

# **Creating SPL Token 22 Program on Solana**

This project exposes the core smart contract business logic to facilitate audits, omitting sensitive inputs. The code is a vanilla SPL Token creation deployed with Solana's Token 22 Program, adding Metadata, Mint, and transferring the Token to another Wallet using the Solana blockchain. 

## **Table of Contents**

- [**Installation**](#installation)
- [**Usage**](#usage)
- [**Dependencies**](#dependencies)
- [**License**](#license)

## **Installation**

Have Node.js installed on your machine. Once you have Node.js, you can clone the repository and install the dependencies.

```bash
git clone [GitHub](https://github.com/ill-prod/slp-audit-test)

npm install
```

## **Usage**
To run the project, use the following command:

```bash
npm run start
```
This will execute the index.ts file using npx tsx.

## **Dependencies**
The project relies on the following dependencies:

`@solana-developers/helpers:` A set of helper functions for Solana development.

`@solana/spl-token:` A library for working with SPL tokens on the Solana blockchain.

`@solana/spl-token-metadata:` A library for managing token metadata.

`@solana/web3.js:` The Solana Web3 SDK for interacting with the Solana blockchain.

## **License**

This project is licensed under the MIT License.
