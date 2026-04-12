// app/components/UserStatus.tsx
'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/app/actions/auth';

export function UserStatus() {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) setUserName(user.name);
        });
    }, []);

    if (!userName) return null;

    return <span className="text-sm text-gray-600">👤 {userName}</span>;
}