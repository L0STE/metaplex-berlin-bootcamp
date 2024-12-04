import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, createSignerFromKeypair, signerIdentity, sol, transactionBuilder } from '@metaplex-foundation/umi'
import { transferAllSol, transferSol } from '@metaplex-foundation/mpl-toolbox';
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

/// Create a Umi instance with the devnet endpoint and finalized commitment
// const umi = ???

/// Generate a new wallet
// const newWallet = ???

/// Save the secretKey array to wallet.json
// fs.writeFileSync('wallet.json', JSON.stringify(Array.from(newWallet), null, 2));

// Use the newly generated wallet to create a signer and use it as the identity and payer for Umi
// const signer = ???

(async () => {
    /// Airdrop some SOL to the new wallet -> Create an airdropIfNecessary function or you'll get rate limited
    // ???

    // console.log(`Balance of ${umi.identity.publicKey} after airdrop: ${(await umi.rpc.getBalance(umi.identity.publicKey)).basisPoints}`);

    /// Generate a new random wallet to send SOL to
    // const toWallet = ???;

    /// Transfer 1 SOL to the random address
    // let transferTx = ???

    // console.log(`Transfer Completed: https://solana.fm/tx/${base58.deserialize(transferTx.signature)[0]}?cluster=localnet-solana`);

    /// Transfer another 0.5 SOL to the random address and all back to the original wallet
    // let tx = ???;

    /// Sign the transaction with the toWallet
    // ???

    // console.log(`Wallets and Airdrops Lesson Completed: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=localnet-solana`);
})();