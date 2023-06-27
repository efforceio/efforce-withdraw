import { SmartContract, WalletInstance } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { toast } from "react-toastify";
import { efforceAddress, scanBaseUrl } from "../react-app-env";
import "../styles/genesis.css";

export default function Genesis(props: {
    contract: null|SmartContract,
    genesis: number[],
    wallet: undefined|WalletInstance,
    refund: string,
    edition: number,
    walletAddress: string,
}) {
    const {
        contract,
        genesis,
        wallet,
        refund,
        edition,
        walletAddress
    } = props;

    const call = async (id: number) => {
        if (wallet) {
            const signer = await wallet.getSigner();
            const sdk = ThirdwebSDK.fromSigner(signer);
            return (await sdk.getContract(contract?.getAddress()||""))?.call("safeTransferFrom", [walletAddress, efforceAddress, id]);
        }
    }

    return genesis.length > 0 ? <div className="container">
        <h2>
            Genesis {edition}
        </h2>

        <div
            className="grid gridContainer"
        >
            {
                genesis.map((nft: number) => <div
                    className="card cardContainer"
                    onClick={async () => {
                        call(nft).then((data) => {
                            if (data) {
                                toast.dismiss();
                                toast.success(
                                    "Transaction completed. View on polyscan",
                                    {
                                        onClick: () => {
                                            window.open(`${scanBaseUrl}/tx/${data.receipt.transactionHash}`);
                                        },
                                        autoClose: false,
                                    }
                                );
                            } else {
                                toast.dismiss();
                                toast.error(
                                    "Transaction failed",
                                    {
                                        autoClose: false,
                                    }
                                );
                            }
                        });
                        toast.dismiss();
                        toast.info(
                            "Waiting for confirmation.",
                            {
                                autoClose: false,
                            }
                        );
                    }}
                >
                    <b># {nft}</b>
                    <p>Refund: {refund} USDT</p>
                </div>)
            }
        </div>
    </div> : null
}
