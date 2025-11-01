import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard() {
    const { url } = usePage();

    useEffect(() => {
        // Redirect to admin dashboard
        window.location.href = '/admin';
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Redirecting to Admin Dashboard...</h1>
                <p className="text-muted-foreground">Please wait while we redirect you.</p>
            </div>
        </div>
    );
}
