import { createAppSlice } from "@/lib/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { AccountBalanceInfo } from "@wepin/sdk-js";

export const balanceSlice = createAppSlice({
  name: "wepin-balance",
  initialState: [] as AccountBalanceInfo[],
  reducers: (create) => ({
    setBalances: create.reducer(
      (state, action: PayloadAction<AccountBalanceInfo[]>) => {
        state = action.payload;
      }
    ),
  }),
  selectors: {
    selectBalances: (state: AccountBalanceInfo[]) => state,
  },
});

export const { setBalances } = balanceSlice.actions;

export const { selectBalances } = balanceSlice.selectors;
