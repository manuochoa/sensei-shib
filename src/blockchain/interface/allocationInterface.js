// import web3 from "../web3";
import ABI from "../abi/allocation.json";
import WalletConnectProvider from "@walletconnect/web3-provider";
import detectEthereumProvider from "@metamask/detect-provider";

const Web3 = require("web3");

export const contractAddress = "0x0b836d21d35F799F6d947F4Ed1986aE8dd4F4D1a";

async function allocationInterface(walletType) {
  let web3;

  if (walletType === "Trust_wallet") {
    const provider = new WalletConnectProvider({
      rpc: {
        //56: "https://bsc-dataseed.binance.org/",

        97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      },
      network: "binance testnet",
      chainId: 97,
      infuraId: null,
    });
    await provider.enable();

    web3 = new Web3(provider);
  } else if (walletType === "Metamask") {
    const provider = await detectEthereumProvider();
    web3 = new Web3(provider);
  } else {
    const provider = new Web3.providers.HttpProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );
    web3 = new Web3(provider);
  }

  return new web3.eth.Contract(ABI.abi, contractAddress);
}

export default allocationInterface;
