'use client';

import {ReactNode} from 'react';
import {Provider} from 'react-redux';
import { ConfigProvider } from 'antd';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from "@/store/store";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import viVN from 'antd/locale/vi_VN';

// Thiết lập cho dayjs
dayjs.locale('vi');

export default function Providers({children}: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <ConfigProvider locale={viVN}>
            {children}
            <ToastContainer position="bottom-left" autoClose={5000}/>
            </ConfigProvider>
        </Provider>
    );
}
