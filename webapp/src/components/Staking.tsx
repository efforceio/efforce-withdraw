import { toast } from "react-toastify";
import { BigNumber } from "ethers";
import { WalletInstance } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { efforceAddress, scanBaseUrl } from "../react-app-env";

export const Staking = (props: {
    stackRefund: BigNumber,
    wallet: undefined|WalletInstance,
    stackRefundStr: string
}) => {
    const {
        stackRefund,
        wallet,
        stackRefundStr
    } = props;

    const call = async () => {
        if (wallet) {
            const signer = await wallet.getSigner();
            const sdk = ThirdwebSDK.fromSigner(signer);
            return (await sdk.getContract(efforceAddress)).call("receiveRefund", []);
        }
    }

    return stackRefund.gt(0) ? <div className="stakingContainer">
        <h2 className="cardHeader">
            Previous staking
        </h2>
        <div
            className="card pointer"
            onClick={async () => {
                if (wallet) {
                    call().then((data) => {
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
                    }, () => {
                        toast.dismiss();
                        toast.error(
                            "Transaction reverted",
                            {
                                autoClose: false,
                            }
                        );
                    });
                    toast.dismiss();
                    toast.info(
                        "Waiting for confirmation.",
                        {
                            autoClose: false,
                        }
                    );
                }
            }}
        >
            <p>Refund: {stackRefundStr} USDT</p>
        </div>
    </div> : null
}
