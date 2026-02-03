import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
            return NextResponse.json({ error: 'Only @gmail.com emails are accepted' }, { status: 400 });
        }

        // Add to Firestore 'subscriptions' collection
        await addDoc(collection(db, 'subscriptions'), {
            email: email.toLowerCase(),
            subscribedAt: serverTimestamp(),
            source: 'landing_page'
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Subscription error:', error);
        return NextResponse.json({
            error: 'Failed to subscribe',
            details: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
