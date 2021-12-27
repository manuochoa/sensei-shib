import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import { Switch, Route, Redirect } from "react-router-dom";
import Swap from "./components/Swap";
import Liquidity from "./components/Liquidity";
import ConnectPopup from "./components/ConnectPopup";
import Allocation from "./components/Allocation/Allocation";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

function App() {
  const [popupShow, setPopupShow] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [walletType, setWalletType] = useState("");

  const connectMetamask = async () => {
    console.log("hola");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setUserAddress(accounts[0]);
      setWalletType("Metamask");

      window.localStorage.setItem("userAddress", accounts[0]);

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (chainId !== "0x38") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
      }

      window.ethereum.on("accountsChanged", function (accounts) {
        setUserAddress(accounts[0]);
      });

      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );

      setPopupShow(false);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const connectWalletConnect = async () => {
    console.log("hola");
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed.binance.org/",
        },
        network: "binance",
        chainId: 56,
        infuraId: null,
      });

      await provider.enable();

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();

      setUserAddress(accounts[0]);
      setWalletType("Trust_wallet");

      setPopupShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let user = window.localStorage.getItem("userAddress");
    console.log(user, "user");

    if (user) {
      connectMetamask();
    }
  }, []);

  return (
    <>
      <Header
        userAddress={userAddress}
        popupShow={popupShow}
        setUserAddress={setUserAddress}
        setPopupShow={setPopupShow}
      />
      <main className="main">
        <Switch>
          <Redirect path="/" to="/swap" exact />
          <Route path="/swap" exact>
            <Swap
              walletType={walletType}
              userAddress={userAddress}
              setPopupShow={setPopupShow}
            />
          </Route>
          <Route path="/liquidity" exact>
            <Liquidity
              walletType={walletType}
              userAddress={userAddress}
              setPopupShow={setPopupShow}
            />
          </Route>
          <Route path="/allocation" exact>
            <Allocation />
          </Route>
        </Switch>
      </main>
      <ConnectPopup
        connectMetamask={connectMetamask}
        connectWalletConnect={connectWalletConnect}
        popupShow={popupShow}
        setPopupShow={setPopupShow}
      />
    </>
  );
}

export default App;
