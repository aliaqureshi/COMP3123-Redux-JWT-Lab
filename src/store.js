
import { configureStore, createSlice } from "@reduxjs/toolkit";

// 0. State
const initialState = {
    count: 0,
    token: null,
    username: null
};

const appSlice = createSlice({
    name: "app",
    initialState,

    // 2. Reducers
    reducers: {
        increment: (state) => {
            state.count += 1;
        },

        decrement: (state) => {
            state.count -= 1;
        },

        reset: (state) => {
            state.count = 0;
        },

        login: (state, action) => {
            state.token = action.payload.token;
            state.username = action.payload.username;
        },

        logout: (state) => {
            state.token = null;
            state.username = null;
            state.count = 0;
        }
    }
});

// 3. Actions
export const {
    increment,
    decrement,
    reset,
    login,
    logout
} = appSlice.actions;

// 1. Store
export const store = configureStore({
    reducer: {
        app: appSlice.reducer
    }
});

// 5. Subscribe
store.subscribe(() => {
    const { count, username } = store.getState().app;
    console.log("Redux state updated:", { count, username });
});
