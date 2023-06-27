import "../styles/withdraw.css";
import { Alchemy, AssetTransfersCategory, AssetTransfersResponse, AssetTransfersResult, } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { efforceAddress, scanBaseUrl } from "../react-app-env";
import { ContractEvent } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";

export const TransactionsHistory = (props: {
    close: () => void,
    alchemy: Alchemy,
    walletAddress: string,
    transferEventData: ContractEvent<Record<string, any>>[] | undefined
    parseNumber: (n: BigNumber) => string
}) => {
    const {
        close,
        alchemy,
        walletAddress,
        transferEventData,
        parseNumber
    } = props;
    const [transactions, setTransactions] = useState([] as AssetTransfersResult[]);

    useEffect(() => {
        if (walletAddress !== "") {
            alchemy.core.getAssetTransfers({
                fromBlock: "0x0",
                toAddress: walletAddress,
                fromAddress: efforceAddress,
                category: [AssetTransfersCategory.ERC20],
            }).then((data: AssetTransfersResponse) => {
                setTransactions(data.transfers);
            });
        }
    }, [walletAddress, transferEventData]);

    return <div className="container">
        <h3 className="pointer" onClick={close}>Back</h3>
        {
            transactions.reverse().map((transaction: AssetTransfersResult) => <p className={"pointer"}>
                • <u onClick={() => window.open(`${scanBaseUrl}/tx/${transaction.hash}`)}>{transaction.hash}</u> ({parseNumber(BigNumber.from(transaction.rawContract.value))} USDT)
            </p>)
        }
    </div>;
}
