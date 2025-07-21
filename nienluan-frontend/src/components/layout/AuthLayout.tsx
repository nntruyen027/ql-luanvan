import {ReactNode} from 'react';

export default function AuthLayout({children}: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
