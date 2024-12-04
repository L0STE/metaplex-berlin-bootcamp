import { createSignerFromKeypair, signerIdentity, generateSigner, some, sol } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createCollection, mplCore } from '@metaplex-foundation/mpl-core'
import { create, addConfigLines, mplCandyMachine, fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

/// Create a Umi instance with the devnet endpoint and finalized commitment
const umi = createUmi("https://api.devnet.solana.com", "finalized");

/// Read the wallet.json file
let wallet = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

/// Use the newly generated wallet to create a signer and use it as the identity and payer for Umi
const signer = createSignerFromKeypair(umi, umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet)));
umi.use(signerIdentity(signer)).use(mplCore()).use(mplCandyMachine());

(async () => {
    /// Generate the Collection KeyPair
    // const collection = ???

    /// Generate the collection
    // const createCollectionTx = ???

    /// Deserialize the Signature from the Transaction
    // console.log(`\nCollection Created: https://solana.fm/tx/${base58.deserialize(createCollectionTx.signature)[0]}?cluster=devnet-alpha`);

    /// Generate the Candy Machine KeyPair
    // const candyMachine = ???

    /// Generate the Candy Machine with the Collection
    // const createIx = ???

    /// Send and Confirm the Transaction
    // await createIx.sendAndConfirm(umi)
    // console.log("\nCandy Machine Created: ", await fetchCandyMachine(umi, candyMachine.publicKey))
    
    /// Add Config Line Settings to the Candy Machine    
    // const addConfigLinesIx = ???

    /// Deserialize the Signature from the Transaction
    // console.log(`\nConfig Lines Added: https://solana.fm/tx/${base58.deserialize(addConfigLinesIx.signature)[0]}?cluster=devnet-alpha`);
})();