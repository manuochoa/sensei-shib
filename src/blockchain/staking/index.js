import web3 from "../web3";
import stakingInterface, {
  stakingAddress,
} from "../interface/stakingInterface";
import tokenInterface from "../interface/tokenInterface";

export const stake = async (_amount, _class, userAddress, walletType) => {
  try {
    console.log("stake", _amount, _class, userAddress, walletType);
    let instance = await stakingInterface(walletType);
    let amount = web3.utils.toWei(_amount.toString(), "Gwei");
    let receipt;
    if (_class === 0) {
      receipt = await instance.methods
        .enterLevel0(amount)
        .send({ from: userAddress });
    } else if (_class === 1) {
      receipt = await instance.methods
        .enterLevel1(amount)
        .send({ from: userAddress });
    } else if (_class === 2) {
      receipt = await instance.methods
        .enterVip(amount)
        .send({ from: userAddress });
    }

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const withdraw = async (_amount, _class, userAddress, walletType) => {
  try {
    let instance = await stakingInterface(walletType);
    let amount = web3.utils.toWei(_amount.toString(), "Gwei");

    let receipt;
    if (_class === 0) {
      receipt = await instance.methods
        .withdrawLevel0(amount)
        .send({ from: userAddress });
    } else if (_class === 1) {
      receipt = await instance.methods
        .withdrawLevel1(amount)
        .send({ from: userAddress });
    } else if (_class === 2) {
      receipt = await instance.methods
        .withdrawVip(amount)
        .send({ from: userAddress });
    }

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const getDepositData = async (userAddress) => {
  try {
    let instance = await stakingInterface();
    let level0 = await instance.methods.level0Balance(userAddress).call();
    let level1 = await instance.methods.level1Balance(userAddress).call();
    let vip = await instance.methods.vipBalance(userAddress).call();

    level0.earnings = await instance.methods
      .getInterest(userAddress, 0, level0.balance)
      .call();
    level1.earnings = await instance.methods
      .getInterest(userAddress, 1, level1.balance)
      .call();
    vip.earnings = await instance.methods
      .getInterest(userAddress, 2, vip.balance)
      .call();

    return [level0, level1, vip];
  } catch (error) {
    console.log(error);
  }
};

export const approveStake = async (userAddress, walletType) => {
  try {
    let instance = await tokenInterface(
      walletType,
      "0x751A446350852Ab064fBA6c66B1103285787E325"
    );
    let amount = web3.utils.toWei("1000000000000000000");
    let receipt = await instance.methods
      .approve(stakingAddress, amount)
      .send({ from: userAddress });

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const checkAllowance = async (userAddress) => {
  try {
    let instance = await tokenInterface(
      "",
      "0x751A446350852Ab064fBA6c66B1103285787E325"
    );
    let receipt = await instance.methods
      .allowance(userAddress, stakingAddress)
      .call();

    return receipt > 0;
  } catch (error) {
    console.log(error);
  }
};

export const tokenBalance = async (userAddress) => {
  try {
    let instance = await tokenInterface(
      "",
      "0x751A446350852Ab064fBA6c66B1103285787E325"
    );
    let receipt = await instance.methods.balanceOf(userAddress).call();

    return receipt;
  } catch (error) {
    console.log(error);
  }
};
