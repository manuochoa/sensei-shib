// import web3 from "../web3";
import ABI from "../abi/allocation.json";
import WalletConnectProvider from "@walletconnect/web3-provider";
import detectEthereumProvider from "@metamask/detect-provider";

const Web3 = require("web3");

export const contractAddress = "0x008F0bfD41B3999741E349597a635ea8cb01b20b";

async function allocationInterface(walletType) {
  let web3;

  if (walletType === "Trust_wallet") {
    const provider = new WalletConnectProvider({
      rpc: {
        56: "https://bsc-dataseed.binance.org/",

        // 97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      },
      network: "binance",
      chainId: 56,
      infuraId: null,
    });
    await provider.enable();

    web3 = new Web3(provider);
  } else if (walletType === "Metamask") {
    const provider = await detectEthereumProvider();
    web3 = new Web3(provider);
  } else {
    const provider = new Web3.providers.HttpProvider(
      "https://bsc-dataseed.binance.org/"
    );
    web3 = new Web3(provider);
  }

  return new web3.eth.Contract(ABI.abi, contractAddress);
}

export default allocationInterface;
