"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const promises_1 = __importDefault(require("fs/promises"));
const spl_token_2 = require("@solana/spl-token");
const spl_token_metadata_1 = require("@solana/spl-token-metadata");
// Define the extensions to be used by the mint
const extensions = [
    spl_token_1.ExtensionType.MetadataPointer,
];
// Calculate the length of the mint
const mintLen = (0, spl_token_1.getMintLen)(extensions);
// Generates a unique filename using a timestamp
function generateUniqueFilename(prefix) {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    return `${prefix}_${timestamp}.json`;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('mainnet-beta'), 'confirmed');
        let payer;
        const secretKey = JSON.parse(yield promises_1.default.readFile('keys/payer-vProd.json', 'utf8'));
        payer = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(secretKey));
        console.log("Wallet Address (Public Key):", payer.publicKey.toBase58());
        const mintKeypair = web3_js_1.Keypair.generate();
        const mintFile = generateUniqueFilename('keys/mintKeypair-vProd');
        yield promises_1.default.writeFile(mintFile, JSON.stringify(Array.from(mintKeypair.secretKey)));
        const mint = mintKeypair.publicKey;
        console.log("Mint public key: ", mint.toBase58());
        const decimals = 6;
        const metadata = {
            mint: mint,
            name: "we are liiiive2",
            symbol: "WAL2",
            uri: "https://gateway.pinata.cloud/ipfs/QmYdVJRgioW5ytWqVXHd48Taot4DCeucor4Eb7ecGF6P75",
            additionalMetadata: [["description", "Only Possible On Solana"]],
        };
        const mintLen = (0, spl_token_1.getMintLen)(extensions);
        const metadataLen = spl_token_1.TYPE_SIZE + spl_token_1.LENGTH_SIZE + (0, spl_token_metadata_1.pack)(metadata).length;
        const mintLamports = yield connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
        const mintTransaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mint,
            space: mintLen,
            lamports: mintLamports,
            programId: spl_token_1.TOKEN_2022_PROGRAM_ID,
        }), (0, spl_token_1.createInitializeMetadataPointerInstruction)(mint, payer.publicKey, mint, spl_token_1.TOKEN_2022_PROGRAM_ID), (0, spl_token_1.createInitializeMintInstruction)(mint, decimals, payer.publicKey, // Set mintAuthority to payer's public key
        null, // No freezeAuthority
        spl_token_1.TOKEN_2022_PROGRAM_ID), (0, spl_token_metadata_1.createInitializeInstruction)({
            programId: spl_token_1.TOKEN_2022_PROGRAM_ID,
            mint: mint,
            metadata: metadata.mint,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: payer.publicKey,
            updateAuthority: payer.publicKey
        }));
        yield (0, web3_js_1.sendAndConfirmTransaction)(connection, mintTransaction, [payer, mintKeypair], undefined);
        console.log("Mint created: ", mint.toBase58());
        //Transfer the token 
        const mintAmount = BigInt(1000000000);
        const sourceAccount = yield (0, spl_token_1.createAccount)(connection, payer, mint, payer.publicKey, undefined, undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
        console.log("Source account: ", sourceAccount.toBase58());
        //Mint the token to the payers account
        yield (0, spl_token_1.mintTo)(connection, payer, mint, sourceAccount, payer.publicKey, mintAmount, [], undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
        //Now nullify authorities by setting them to null
        yield (0, spl_token_1.setAuthority)(connection, payer, mint, payer.publicKey, // Current authority must sign off
        spl_token_1.AuthorityType.MintTokens, null, // Set mintAuthority to null
        [], // Signing accounts
        undefined, // Confirm options
        spl_token_1.TOKEN_2022_PROGRAM_ID);
        console.log("Mint authority and update authority set to null.");
        //Reciever of the token
        const account = web3_js_1.Keypair.generate();
        const accountFile = generateUniqueFilename('keys/account-vProd');
        yield promises_1.default.writeFile(accountFile, JSON.stringify(Array.from(account.secretKey)));
        const destinationAccount = yield (0, spl_token_1.createAccount)(connection, payer, mint, payer.publicKey, account, undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
        console.log('Destination account: ', destinationAccount.toBase58());
        const transferAmount = BigInt(1000000000);
        //Transfer the token with the fee
        yield (0, spl_token_2.transferChecked)(connection, payer, sourceAccount, mint, destinationAccount, payer, transferAmount, decimals, [], undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
        console.log("Token transferred");
    });
}
main();
