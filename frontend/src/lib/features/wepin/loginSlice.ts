import { createAppSlice } from "@/lib/createAppSlice";
import { UserType } from "@/types/userType";
import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WepinSDK } from "@wepin/sdk-js";

let wepinSdk: WepinSDK;

export interface UserSliceState {
  isInitialized: boolean;
  isLoggedIn: boolean;
  userInfo: UserType | null;
}

const initialState: UserSliceState = {
  isInitialized: false,
  isLoggedIn: false,
  userInfo: null,
};

export const initializeWepinWidget = createAsyncThunk(
  "wepin-login/initialize",
  async (_, { dispatch }) => {
    if (typeof window !== "undefined") {
      const { WepinSDK } = await import("@wepin/sdk-js");
      wepinSdk = new WepinSDK({
        appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID as string,
        appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY as string,
      });

      await wepinSdk.init({
        type: "hide",
        defaultLanguage: "ko",
        defaultCurrency: "KRW",
      });
      dispatch(setIsInitialized(true));
    }
  }
);

export const loginSlice = createAppSlice({
  name: "wepin-login",
  initialState,
  reducers: (create) => ({
    setIsInitialized: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.isInitialized = action.payload;
      }
    ),
    setIsLoggedIn: create.reducer((state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    }),
    setUserInfo: create.reducer(
      (state, action: PayloadAction<UserType | null>) => {
        state.userInfo = action.payload;
      }
    ),
  }),
  selectors: {
    selectIsInitialized: (state: UserSliceState) => state.isInitialized,
    selectIsLoggedIn: (state: UserSliceState) => state.isLoggedIn,
    selectUserInfo: (state: UserSliceState) => state.userInfo,
  },
});

export const { setIsInitialized, setIsLoggedIn, setUserInfo } =
  loginSlice.actions;

export const { selectIsInitialized, selectIsLoggedIn, selectUserInfo } =
  loginSlice.selectors;

export const getWepinSDK = () => wepinSdk;
