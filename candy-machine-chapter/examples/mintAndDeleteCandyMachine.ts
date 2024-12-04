import { createSignerFromKeypair, signerIdentity, generateSigner, publicKey, some } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mintV1, deleteCandyMachine, fetchCandyMachine, mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

/// Create a Umi instance with the devnet endpoint and finalized commitment
const umi = createUmi("https://api.devnet.solana.com", "finalized");

/// Read the wallet.json file
let wallet = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

/// Use the newly generated wallet to create a signer and use it as the identity and payer for Umi
const signer = createSignerFromKeypair(umi, umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet)));
umi.use(signerIdentity(signer)).use(mplCandyMachine());

(async () => {
    /// Fetch the Candy Machine
    const candyMachine = publicKey("E3ufhka6wh9ZwxS53pyQdcKfEBM6zLfaYkd1zFgY58J");
    const candyMachineData = await fetchCandyMachine(umi, candyMachine);

    /// Generate the Asset KeyPair
    const asset = generateSigner(umi)

    /// Mint the Asset
    const mintIx = await mintV1(umi, {
        candyMachine,
        collection: candyMachineData.collectionMint,
        asset,
        mintArgs: {
            solPayment: some({ destination: umi.identity.publicKey }),
        },
    }).sendAndConfirm(umi)

    /// Deserialize the Signature from the Transaction
    console.log(`\nAsset Minted: https://solana.fm/tx/${base58.deserialize(mintIx.signature)[0]}?cluster=devnet-alpha`);

    /// Delete the Candy Machine
    const deleteIx = await deleteCandyMachine(umi, {
        candyMachine,
    }).sendAndConfirm(umi)

    /// Deserialize the Signature from the Transaction
    console.log(`\nCandy Machine Deleted: https://solana.fm/tx/${base58.deserialize(deleteIx.signature)[0]}?cluster=devnet-alpha`);
})();