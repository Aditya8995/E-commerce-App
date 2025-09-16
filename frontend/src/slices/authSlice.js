import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));

            const savedAddress = localStorage.getItem(`shippingAddress_${action.payload._id}`);
            state.shippingAddress = savedAddress ? JSON.parse(savedAddress) : {};
        },
        logout: (state) => {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("cartItems");
            state.userInfo = null;
            state.shippingAddress = {}; 
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
