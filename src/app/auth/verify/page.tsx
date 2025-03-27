'use client';

import Link from 'next/link';
import Layout from '../../../components/Layout';

export default function VerifyEmail() {
  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-6">
            <svg className="mx-auto h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          
          <p className="text-gray-600 mb-6">
            We've sent you a verification link. Please check your email inbox and click on the link to complete your registration.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/auth/login" 
              className="block w-full py-2 px-4 rounded-md text-white font-medium bg-primary-600 hover:bg-primary-700"
            >
              Go to Login
            </Link>
            
            <Link 
              href="/" 
              className="block w-full py-2 px-4 rounded-md text-gray-700 font-medium bg-gray-100 hover:bg-gray-200"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 