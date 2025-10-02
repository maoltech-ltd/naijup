import api from "@/src/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types ---
export interface FxRates {
  fx_rates: Record<string, number>;
  crypto_rates_usd: Record<string, number>;
  crypto_rates_ngn: Record<string, number>;
  base_usd_rate: number;
}

interface MarketState {
  rates: FxRates | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// --- Initial State ---
const initialState: MarketState = {
  rates: null,
  status: "idle",
  error: null,
};

// --- Thunk ---
export const fetchFxRates = createAsyncThunk("market/fetchFxRates", async () => {
  const response = await api.get("v1/market/crawl-rates/");
  return response.data as FxRates;
});

// --- Slice ---
const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setRates: (state, action: PayloadAction<FxRates>) => {
      state.rates = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFxRates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFxRates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rates = action.payload;
      })
      .addCase(fetchFxRates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch FX rates.";
      });
  },
});

export const { setRates } = marketSlice.actions;
export default marketSlice.reducer;
