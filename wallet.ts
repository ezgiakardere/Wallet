import * as fs from 'fs';
import { Keypair, Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

const walletFile = 'wallet.json';

async function createWallet() {
    const keypair = Keypair.generate();
    const publicKeyString = '...';

    const publicKey = new PublicKey(publicKeyString);

    const balance = await connection.getBalance(publicKey);

    const walletData = {
        publicKey: publicKey,
        secretKey: keypair.secretKey.toString(),
        balance: balance
    };

    fs.writeFileSync(walletFile, JSON.stringify(walletData, null, 2));
    console.log('Wallet created and saved to', walletFile);
}

async function checkBalance() {
    try {
        const walletData = JSON.parse(fs.readFileSync(walletFile, 'utf8'));
        const publicKey = walletData.publicKey;
        
        const balance = await connection.getBalance(publicKey);
        
        console.log('Balance for', publicKey, 'is', balance / 1000000000, 'SOL');
    } catch (error) {
        console.error('Error:', error);
    }
}

const command = process.argv[2];
switch (command) {
    case 'new':
        createWallet();
        break;

    case 'balance':
        checkBalance();
        break;
   
    default:
        console.log('Invalid command');
}
