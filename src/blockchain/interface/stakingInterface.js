// import web3 from "../web3";
import ABI from "../abi/staking.json";
import WalletConnectProvider from "@walletconnect/web3-provider";
import detectEthereumProvider from "@metamask/detect-provider";

const Web3 = require("web3");

export const stakingAddress = "0x247051d9636eFC04e5B095D241b59f654439EBEf";

async function stakingInterface(walletType) {
  let web3;

  if (walletType === "Trust_wallet") {
    const provider = new WalletConnectProvider({
      rpc: {
        // 56: "https://bsc-dataseed.binance.org/",

        97: "https://speedy-nodes-nyc.moralis.io/1d19a6082204e3ecd8dcf0b9/bsc/testnet",
      },
      // network: "binance",
      // chainId: 56,
      infuraId: null,
    });
    await provider.enable();

    web3 = new Web3(provider);
  } else if (walletType === "Metamask") {
    const provider = await detectEthereumProvider();
    web3 = new Web3(provider);
  } else {
    const provider = new Web3.providers.HttpProvider(
      "https://speedy-nodes-nyc.moralis.io/1d19a6082204e3ecd8dcf0b9/bsc/testnet"
    );
    // const provider = new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/");
    web3 = new Web3(provider);
  }

  return new web3.eth.Contract(ABI.abi, stakingAddress);
}

export default stakingInterface;
