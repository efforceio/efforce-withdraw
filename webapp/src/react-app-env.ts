import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Network } from "alchemy-sdk";

export const activeChain = "mumbai";
export const chainId = 80001;
export const sdk = new ThirdwebSDK(activeChain);
export const genesis1Address = "0x4649f6a68232785A582a095DCB899aedb0Ba9327";
export const genesis2Address = "0xD863E3805f0450c0dC7bCFD809FFcDbb28313269"
export const efforceAddress = "0x4D1072948E66eBceC234311CE5Ed15D623759c36";
export const currencyAddress = "0x29373f5A90A3606d3892869f1595A648CCDe0bE6";
export const decimals = 18;

export const alchemyConfig = {
    apiKey: "EkieZb4J7MHV2O_OuBI0zMRbpCJHfnDA",
    network: Network.MATIC_MUMBAI,
};

export const scanBaseUrl = "https://mumbai.polygonscan.com";
