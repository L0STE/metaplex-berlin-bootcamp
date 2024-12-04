import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, createSignerFromKeypair, signerIdentity, sol, Umi, transactionBuilder } from '@metaplex-foundation/umi'
import { transferTokens, mintTokensTo, createAssociatedToken, createMint, findAssociatedTokenPda, fetchToken, createMintWithAssociatedToken } from '@metaplex-foundation/mpl-toolbox';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

/// Create a Umi instance with the devnet endpoint and finalized commitment
const umi = createUmi("https://api.devnet.solana.com", "finalized");

/// Read the wallet.json file
let wallet = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

/// Use the newly generated wallet to create a signer and use it as the identity and payer for Umi
const signer = createSignerFromKeypair(umi, umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet)));
umi.use(signerIdentity(signer)).use(mplTokenMetadata());

(async () => {
    /// Use the airDropIfNecessary function to check the balance and airdrop if necessary
    await airdropIfNecessary(umi);

    /// Generate a new Mint
    // const mint = ???
    // console.log(`The mint Publickey is: ${mint.publicKey}`)

    /// Create a Mint and Mint 100 Tokens to the Identity
    // const createMintTx = await transactionBuilder().add(
    //     ???
    // ).add(
    //     ???
    // ).add(
    //     ???
    // ).sendAndConfirm(umi)

    // console.log(`Mint Created & Minted to Identity! https://solana.fm/tx/${base58.deserialize(createMintTx.signature)[0]}?cluster=devnet-alpha`);

    // console.log(`Balance of ${umi.identity.publicKey} after Mint: ${ ??? }`)

    /// Create a Mint and Mint 100 Tokens to the Identity (Optimized)
    // const createOptimizedMintTx = ???

    // console.log(`Optimized Mint Created & Minted to Identity! https://solana.fm/tx/${base58.deserialize(createOptimizedMintTx.signature)[0]}?cluster=devnet-alpha`);

    // Create a new Destination Keypair
    // const destination = ???

    // Transfer 50 Tokens to Destination
    // const transferTx = await transactionBuilder().add(
    //     ???
    // ).add(
    //     ???
    // ).sendAndConfirm(umi)

    // console.log(`Transferred 50 Tokens to Destination! https://solana.fm/tx/${base58.deserialize(transferTx.signature)[0]}?cluster=devnet-alpha`);

    // console.log(`Balance of ${destination} after Transfer: ${(await fetchToken(umi, findAssociatedTokenPda(umi, {mint: mint.publicKey, owner: destination}))).amount}`)
})();

async function airdropIfNecessary(umi: Umi) {
    if ((await umi.rpc.getBalance(umi.identity.publicKey)).basisPoints < sol(2).basisPoints) {
        // Airdrop some SOL to the new wallet
        await umi.rpc.airdrop(umi.identity.publicKey, sol(2))
    }
}