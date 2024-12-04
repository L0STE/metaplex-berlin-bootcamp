import { createSignerFromKeypair, signerIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { burn, fetchAsset, fetchCollection, updateCollectionPlugin, mplCore } from '@metaplex-foundation/mpl-core'
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
    /// Pass and Fetch the Asset
    // const assetPublicKey = ???
    // const asset = ???
    // console.log("Asset", asset);

    /// Pass and Fetch the Collection
    // const collectionPublicKey = ???
    // const collection = ???

    /// Update the Collection Plugin to Unfreeze the Asset
    // const updateTx = ???

    /// Deserialize the Signature from the Transaction
    // console.log(`\nCollection ${collectionPublicKey.toString()} updated: https://solana.fm/tx/${base58.deserialize(updateTx.signature)[0]}?cluster=devnet-alpha`);

    /// Burn the Asset
    // const burnTx = ???

    /// Deserialize the Signature from the Transaction
    // console.log(`\nAsset ${assetPublicKey.toString()} burned: https://solana.fm/tx/${base58.deserialize(burnTx.signature)[0]}?cluster=devnet-alpha`);
})();