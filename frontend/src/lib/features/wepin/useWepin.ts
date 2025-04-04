import { Account } from "@wepin/sdk-js";
import { prop, uniqBy } from "ramda";
import { getWepinSDK } from "./loginSlice";

export const initializeWepinSDK = async () => {
  const wepinSDK = getWepinSDK();

  if (!wepinSDK.isInitialized()) {
    await wepinSDK.init();
  }
};

export const statusSDK = async () => {
  const wepinSDK = getWepinSDK();
  await initializeWepinSDK();

  const status = await wepinSDK.getStatus();

  return status;
};

export const logoutSDK = async () => {
  const wepinSDK = getWepinSDK();
  await initializeWepinSDK();

  await wepinSDK.logout();
};

export const userLoginSDK = async () => {
  const wepinSDK = getWepinSDK();
  await initializeWepinSDK();

  const user = await wepinSDK.loginWithUI();

  return user;
};

export const accountsSDK = async () => {
  const wepinSDK = getWepinSDK();
  await initializeWepinSDK();

  const removeDuplicates = uniqBy(prop("network"));
  const accounts = removeDuplicates(await wepinSDK.getAccounts());

  return accounts;
};

export const balanceSDK = async (accounts: Account[]) => {
  const wepinSDK = getWepinSDK();
  await initializeWepinSDK();

  const balances = await wepinSDK.getBalance(accounts);

  return balances;
};

export const openWidgetSDK = async () => {
  const wepinSDK = getWepinSDK();
  await initializeWepinSDK();

  await wepinSDK.openWidget();
};
