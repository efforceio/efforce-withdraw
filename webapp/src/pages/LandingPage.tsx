import { ConnectWallet } from "@thirdweb-dev/react";
import "../styles/home.css";

export default function LandingPage() {
    return (
        <div className="container">
            <main className="main">
                <h1 className="title">
                    Claim your Efforce rewards!
                </h1>
                <p className="description">
                    Genesis pool contributors and Genesis NFT holders can now withdraw their rewards.<br />
                    Please connect the wallet you used to contribute to the Genesis Pool or where you keep your NFTs to see if you qualify to be rewarded.<br />
                    If you are a Genesis Pool contributor please be aware we moved our operations from Ethereum to Polygon, so make sure to have your Metamask wallet correctly configurated. You can find instructions on how to do it at <a href="https://academy.binance.com/en/articles/how-to-add-polygon-to-metamask" target="blank">this link</a>
                </p>
                <div className="connect">
                    <ConnectWallet dropdownPosition={{ side: 'bottom', align: 'center' }} />
                </div>
            </main>
        </div>
    );
}
