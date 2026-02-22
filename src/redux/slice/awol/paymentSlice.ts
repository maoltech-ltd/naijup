import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface PaymentState {
    payments: any[];
    status: string;
}

const initialState: PaymentState = {
    payments: [],
    status: "idle",
};

// ADD PAYMENT
export const addPayment = createAsyncThunk(
    "payments/add",
    async ({token, data}: {token: string, data: any}) => {
        const res = await api.post( "v1/awol/payments/add/", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
        });
    },
});

export default paymentSlice.reducer;
