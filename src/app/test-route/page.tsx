'use client';

import React from 'react';
import Layout from '../../components/Layout';

export default function TestRoute() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Test Route Page
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          This is a test page to verify routing is working correctly.
        </p>
      </div>
    </Layout>
  );
} 