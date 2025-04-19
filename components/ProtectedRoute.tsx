// app/components/ProtectedRoute.jsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/api/auth/signin');
        }
    }, [session, status, router]);

    if (status == 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <video
                    autoPlay
                    loop
                    muted
                    className="w-4/6 h-auto"
                    style={{ filter: "brightness(1.2)", objectFit: "contain" }}
                >
                    <source src="/Loading.webm" type="video/webm" />
                    Loading...
                </video>
            </div>
        );
    }

    return session ? children : null;
}