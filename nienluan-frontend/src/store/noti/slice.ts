import {createSlice} from '@reduxjs/toolkit';

type Notification = {
    message: string;
    type: 'success' | 'error' | 'info';
};

const initialState: Notification | null = null;

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action) => {
            return action.payload;
        },
        clearNotification: () => {
            return null;
        },
    },
});

export const {showNotification, clearNotification} = notificationSlice.actions;
export default notificationSlice.reducer;
