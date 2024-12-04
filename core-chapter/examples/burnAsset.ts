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

    // Pass and Fetch the Asset
    const assetPublicKey = publicKey("E2C7YLg5qK4pwXgrzSLoSPxFMEdzGgEEd8FDJxTLShrA");
    const asset = await fetchAsset(umi, assetPublicKey);
    console.log("Asset", asset);

    const collectionPublicKey = publicKey("3ATsyfgTKvPCubrNmrnT1xLMfX6kPFdV5H6m3Lv6swZ4");
    const collection = await fetchCollection(umi, collectionPublicKey);  

    // Update the Collection Plugin to Unfreeze the Asset
    const updateTx = await updateCollectionPlugin(umi, {
        collection: collection.publicKey, 
        plugin: {
            type: "PermanentFreezeDelegate",
            frozen: false
        },
    }).sendAndConfirm(umi);

    // Deserialize the Signature from the Transaction
    console.log(`\nCollection ${collectionPublicKey.toString()} updated: https://solana.fm/tx/${base58.deserialize(updateTx.signature)[0]}?cluster=devnet-alpha`);

    // Burn the Asset
    const tx = await burn(umi, {
        asset,
        collection,
    }).sendAndConfirm(umi)

    // Deserialize the Signature from the Transaction
    const signature = base58.deserialize(tx.signature)[0];
    console.log(`\nAsset ${assetPublicKey.toString()} burned: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);

})();