import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Network } from "alchemy-sdk";

export const activeChain = "polygon";
export const chainId = 137;
export const sdk = new ThirdwebSDK(
    activeChain,
    {
        clientId: "216ed3fbe75d1fcd0a18801cc29f1917",
    });
export const genesis1Address = "0xC849AD758bF4F69A087Ce0dF164b3a4F28f4B49C";
export const genesis2Address = "0x6cC885Ca0E488f42a9397f923C53B270E2a728de"
export const efforceAddress = "0x3Ce7Bd5b242796998B8B4d3389bAaeE6f6b50824";
export const currencyAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
export const decimals = 6;

export const alchemyConfig = {
    apiKey: "2c1ZP5xu2Tv8V7Bi3Cievt3bxUGz03s9",
    network: Network.MATIC_MAINNET,
};

export const scanBaseUrl = "https://polygonscan.com";
