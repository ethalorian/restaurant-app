'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentConfirmation() {
  const searchParams = useSearchParams();
  const status = searchParams.get('redirect_status');

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Confirmation</h1>
      {status === 'succeeded' ? (
        <div>
          <p className="text-green-600 mb-4">Your payment was successful!</p>
          <p className="mb-4">Thank you for your purchase.</p>
        </div>
      ) : (
        <p className="text-red-600 mb-4">There was an issue with your payment. Please try again.</p>
      )}
      <Link href="/" className="text-blue-600 hover:underline">
        Return to Homepage
      </Link>
    </div>
  );
}