import { createAppSlice } from "@/lib/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { Account } from "@wepin/sdk-js";

export interface AccountsSliceState {
  accounts: Account[];
}

const initialState: AccountsSliceState = {
  accounts: [],
};

export const accountsSlice = createAppSlice({
  name: "wepin-accounts",
  initialState,
  reducers: (create) => ({
    setAccounts: create.reducer((state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    }),
  }),
  selectors: {
    selectAccounts: (state: AccountsSliceState) => state.accounts,
  },
});

export const { setAccounts } = accountsSlice.actions;

export const { selectAccounts } = accountsSlice.selectors;
