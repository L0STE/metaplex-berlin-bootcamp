import { generateSigner, createSignerFromKeypair, signerIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createCollection, create, mplCore } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

/// Create a Umi instance with the devnet endpoint and finalized commitment
const umi = createUmi("https://api.devnet.solana.com", "finalized");

/// Read the wallet.json file
let wallet = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

/// Use the newly generated wallet to create a signer and use it as the identity and payer for Umi
const signer = createSignerFromKeypair(umi, umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet)));
umi.use(signerIdentity(signer)).use(mplCore());

(async () => {
    /// Generate the Collection KeyPair
    // const collection = ???
    // console.log("\nCollection Address: ", collection.publicKey.toString())

    /// Generate the collection with the PermanentFreezeDelegate plugin
    // const createCollectionTx = ???

    /// Deserialize the Signature from the Transaction
    // console.log(`\nCollection Created: https://solana.fm/tx/${base58.deserialize(createCollectionTx.signature)[0]}?cluster=devnet-alpha`);

    /// Generate the Asset KeyPair
    // const asset = ???
    // console.log("\nAsset Address: ", asset.publicKey.toString())

    /// Generate the Asset with the Attributes plugin
    // const createAssetTx = ???

    /// Deserialize the Signature from the Transaction
    // console.log(`\nAsset Created: https://solana.fm/tx/${base58.deserialize(createAssetTx.signature)[0]}?cluster=devnet-alpha`);
})();