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
    // Generate the Collection KeyPair
    const collection = generateSigner(umi)
    console.log("\nCollection Address: ", collection.publicKey.toString())

    // Generate the collection
    const createCollectionTx = await createCollection(umi, {
        collection,
        name: 'Collection',
        uri: 'https://example.com/my-collection.json',
        plugins: [
            {
                type: "PermanentFreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority"}
            },
        ]
    }).sendAndConfirm(umi)

    // Deserialize the Signature from the Transaction
    const createCollectionSignature = base58.deserialize(createCollectionTx.signature)[0];
    console.log(`\nCollection Created: https://solana.fm/tx/${createCollectionSignature}?cluster=devnet-alpha`);

    // Generate the Asset KeyPair
    const asset = generateSigner(umi);
    console.log("\nAsset Address: ", asset.publicKey.toString())

    // Generate the Asset
    const createAssetTx = await create(umi, {
        name: 'Asset',
        uri: 'https://example.com/my-asset.json',
        collection,
        asset,
        plugins: [
            {
                type: "Attributes",
                attributeList: [
                    {
                        key: "key",
                        value: "value"
                    }
                ]
            }
        ]
    }).sendAndConfirm(umi)

    // Deserialize the Signature from the Transaction
    const createAssetSignature = base58.deserialize(createCollectionTx.signature)[0];
    console.log(`\nAsset Created: https://solana.fm/tx/${createAssetSignature}?cluster=devnet-alpha`);

})();