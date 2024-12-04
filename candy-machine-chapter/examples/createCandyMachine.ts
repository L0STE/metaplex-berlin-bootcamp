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
    const collection = generateSigner(umi)
    console.log("\nCollection Address: ", collection.publicKey.toString())

    /// Generate the collection
    const createCollectionTx = await createCollection(umi, {
        collection,
        name: 'Collection',
        uri: 'https://example.com/my-collection.json',
    }).sendAndConfirm(umi)

    /// Deserialize the Signature from the Transaction
    console.log(`\nCollection Created: https://solana.fm/tx/${base58.deserialize(createCollectionTx.signature)[0]}?cluster=devnet-alpha`);

    /// Generate the Candy Machine KeyPair
    const candyMachine = generateSigner(umi)
    console.log("\nCandy Machine Address: ", candyMachine.publicKey.toString())

    /// Generate the Candy Machine with the Collection
    const createIx = await create(umi, {
        candyMachine,
        collection: collection.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 10,
        configLineSettings: some({
            prefixName: 'Asset #',
            nameLength: 15,
            prefixUri: 'https://example.com/metadata/',
            uriLength: 29,
            isSequential: false,
        }),
        guards: {
            botTax: some({ lamports: sol(0.01), lastInstruction: true }),
            solPayment: some({ lamports: sol(0.1), destination: umi.identity.publicKey }),
        },
    })
    
    /// Send and Confirm the Transaction
    await createIx.sendAndConfirm(umi)
    console.log("\nCandy Machine Created: ", await fetchCandyMachine(umi, candyMachine.publicKey))
    
    /// Add Config Line Settings to the Candy Machine    
    const addConfigLinesIx = await addConfigLines(umi, {
        candyMachine: candyMachine.publicKey,
        index: 0,
        configLines: [
          { name: '1', uri: '1.json' },
          { name: '2', uri: '2.json' },
          { name: '3', uri: '3.json' },
          { name: '4', uri: '4.json' },
          { name: '5', uri: '5.json' },
          { name: '6', uri: '6.json' },
          { name: '7', uri: '7.json' },
          { name: '8', uri: '8.json' },
          { name: '9', uri: '9.json' },
          { name: '10', uri: '10.json' },
        ],
    }).sendAndConfirm(umi)

    /// Deserialize the Signature from the Transaction
    console.log(`\nConfig Lines Added: https://solana.fm/tx/${base58.deserialize(addConfigLinesIx.signature)[0]}?cluster=devnet-alpha`);
})();