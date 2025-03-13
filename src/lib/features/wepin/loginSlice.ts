import { createAppSlice } from "@/lib/createAppSlice";
import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WepinLogin } from "@wepin/login-js";

let wepinLoginInstance: WepinLogin | null = null;

export interface UserSliceState {
  isInitialized: boolean;
}

const initialState: UserSliceState = {
  isInitialized: false,
};

export const initializeWepinLogin = createAsyncThunk(
  "wepin-login/initialize",
  async (_, { dispatch }) => {
    if (typeof window !== "undefined") {
      const { WepinLogin } = await import("@wepin/login-js");
      wepinLoginInstance = new WepinLogin({
        appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID as string,
        appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY as string,
      });
      await wepinLoginInstance.init();
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
  }),
  selectors: {
    selectIsInitialized: (state: UserSliceState) => state.isInitialized,
  },
});

export const { setIsInitialized } = loginSlice.actions;

export const { selectIsInitialized } = loginSlice.selectors;

export const getWepinLoginInstance = () => wepinLoginInstance;
