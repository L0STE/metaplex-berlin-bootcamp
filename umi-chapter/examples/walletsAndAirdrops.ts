import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, createSignerFromKeypair, signerIdentity, sol, transactionBuilder } from '@metaplex-foundation/umi'
import { transferAllSol, transferSol } from '@metaplex-foundation/mpl-toolbox';
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

// Create a Umi instance with the devnet endpoint and finalized commitment
const umi = createUmi("https://api.devnet.solana.com", "finalized");

// Generate a new wallet
const newWallet = generateSigner(umi).secretKey;

// Save the secretKey array to wallet.json
fs.writeFileSync('wallet.json', JSON.stringify(Array.from(newWallet), null, 2));

// Use the newly generated wallet to create a signer and use it as the identity and payer for Umi
const signer = createSignerFromKeypair(umi, umi.eddsa.createKeypairFromSecretKey(new Uint8Array(newWallet)));
umi.use(signerIdentity(signer));

(async () => {
    // You might get rate limited if you try to airdrop too many times in a row, so check the balance first
    if ((await umi.rpc.getBalance(umi.identity.publicKey)).basisPoints < sol(2).basisPoints) {
        // Airdrop some SOL to the new wallet
        await umi.rpc.airdrop(umi.identity.publicKey, sol(2))
    }

    console.log(`Balance of ${umi.identity.publicKey} after airdrop: ${(await umi.rpc.getBalance(umi.identity.publicKey)).basisPoints}`);

    // Generate a new random wallet to send SOL to
    const toWallet = generateSigner(umi);

    // Transfer 1 SOL to the random address
    let transferTx = await transferSol(umi, {
        destination: toWallet.publicKey,
        amount: sol(1)
    }).sendAndConfirm(umi);

    console.log(`Transfer Completed: https://solana.fm/tx/${base58.deserialize(transferTx.signature)[0]}?cluster=localnet-solana`);

    // Transfer another 0.5 SOL to the random address and all back to the original wallet
    let tx = await transactionBuilder().add(transferSol(umi, {
        destination: toWallet.publicKey,
        amount: sol(0.5)
    })).add(transferAllSol(umi, {
        source: toWallet,
        destination: umi.identity.publicKey,
    })).buildAndSign(umi);

    tx = await toWallet.signTransaction(tx);

    console.log(`Lesson 1 Completed: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=localnet-solana`);
})();