/**
 * Shim Usage Examples
 * 
 * Demonstrates how to use shims for framework-agnostic code
 * Works in both Vite and Next.js without changes
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigation, useParams, useSearchParams } from '@/shims/router';
import { Image, Head } from '@/shims/components';
import { env } from '@/shims/env';
import { apiClient } from '@/shims/api';

// ============================================================================
// Example 1: Navigation
// ============================================================================

export function NavigationExample() {
  const navigation = useNavigation();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Navigation Examples</h2>

      {/* Link Component */}
      <div>
        <Link href="/dashboard" className="text-indigo-600 hover:underline">
          Go to Dashboard
        </Link>
      </div>

      {/* Programmatic Navigation */}
      <button
        onClick={() => navigation.push('/profile')}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Navigate to Profile
      </button>

      {/* Replace Navigation */}
      <button
        onClick={() => navigation.replace('/login')}
        className="px-4 py-2 bg-gray-600 text-white rounded"
      >
        Replace with Login
      </button>

      {/* Back/Forward */}
      <div className="flex gap-2">
        <button onClick={() => navigation.back()} className="px-4 py-2 border rounded">
          ← Back
        </button>
        <button onClick={() => navigation.forward()} className="px-4 py-2 border rounded">
          Forward →
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 2: URL Params
// ============================================================================

export function ParamsExample() {
  // Type-safe params
  const { id, slug } = useParams<{ id: string; slug: string }>();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">URL Params Examples</h2>
      <div className="bg-gray-100 p-4 rounded">
        <p>ID: {id || 'Not found'}</p>
        <p>Slug: {slug || 'Not found'}</p>
      </div>

      <p className="text-sm text-gray-600">
        Current route must have :id and :slug params
      </p>
    </div>
  );
}

// ============================================================================
// Example 3: Search Params
// ============================================================================

export function SearchParamsExample() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const filter = searchParams.get('filter') || 'all';

  const updateSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery, page, filter });
  };

  const updatePage = (newPage: number) => {
    setSearchParams({ q: query, page: String(newPage), filter });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Search Params Examples</h2>

      {/* Display current params */}
      <div className="bg-gray-100 p-4 rounded">
        <p>Query: {query}</p>
        <p>Page: {page}</p>
        <p>Filter: {filter}</p>
      </div>

      {/* Update search */}
      <input
        type="text"
        value={query}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder="Search..."
        className="px-4 py-2 border rounded w-full"
      />

      {/* Pagination */}
      <div className="flex gap-2">
        <button
          onClick={() => updatePage(Number(page) - 1)}
          disabled={Number(page) <= 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => updatePage(Number(page) + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Image Component
// ============================================================================

export function ImageExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Image Examples</h2>

      {/* Standard image */}
      <div>
        <h3 className="font-semibold mb-2">Standard Image</h3>
        <Image
          src="/images/hero.jpg"
          alt="Hero Image"
          width={600}
          height={400}
          className="rounded-lg"
        />
      </div>

      {/* Priority image (above fold) */}
      <div>
        <h3 className="font-semibold mb-2">Priority Image (LCP)</h3>
        <Image
          src="/images/banner.jpg"
          alt="Banner"
          width={1200}
          height={300}
          priority
          className="rounded-lg w-full"
        />
      </div>

      {/* Fill container */}
      <div>
        <h3 className="font-semibold mb-2">Fill Container</h3>
        <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src="/images/background.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Head/Metadata
// ============================================================================

export function HeadExample() {
  return (
    <>
      <Head
        title="Example Page"
        description="This is an example page demonstrating shim usage"
        keywords="react, vite, nextjs, migration"
        ogTitle="Shim Examples - VHV Platform"
        ogDescription="Learn how to use shims for easy framework migration"
        ogImage="/images/og-example.jpg"
        canonical="https://example.com/examples"
      />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Head/Metadata Example</h2>
        <p className="text-gray-600">
          Check the page title and meta tags in browser DevTools
        </p>
      </div>
    </>
  );
}

// ============================================================================
// Example 6: Environment Variables
// ============================================================================

export function EnvExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Environment Variables Example</h2>

      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p><strong>API URL:</strong> {env.API_URL}</p>
        <p><strong>App Name:</strong> {env.APP_NAME}</p>
        <p><strong>Environment:</strong> {env.APP_ENV}</p>
        <p><strong>Version:</strong> {env.APP_VERSION}</p>
        <p><strong>Is Development:</strong> {env.isDevelopment ? 'Yes' : 'No'}</p>
        <p><strong>Is Production:</strong> {env.isProduction ? 'Yes' : 'No'}</p>
      </div>

      <p className="text-sm text-gray-600">
        These values come from .env.local file
      </p>
    </div>
  );
}

// ============================================================================
// Example 7: API Client
// ============================================================================

interface User {
  id: number;
  name: string;
  email: string;
}

export function ApiExample() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get<User[]>('/users', {
        params: { page: 1, limit: 10 },
      });
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (name: string, email: string) => {
    try {
      const { data } = await apiClient.post<User>('/users', {
        name,
        email,
      });
      setUsers([...users, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">API Client Example</h2>

      {/* Fetch Users */}
      <button
        onClick={fetchUsers}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Users'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Users List */}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>

      {/* Create User Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          createUser(
            formData.get('name') as string,
            formData.get('email') as string
          );
          e.currentTarget.reset();
        }}
        className="space-y-2"
      >
        <input
          name="name"
          placeholder="Name"
          required
          className="px-4 py-2 border rounded w-full"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="px-4 py-2 border rounded w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// Combined Example Page
// ============================================================================

export default function ShimExamplesPage() {
  const [activeExample, setActiveExample] = useState<string>('navigation');

  const examples = [
    { id: 'navigation', label: 'Navigation', component: NavigationExample },
    { id: 'params', label: 'URL Params', component: ParamsExample },
    { id: 'search', label: 'Search Params', component: SearchParamsExample },
    { id: 'image', label: 'Images', component: ImageExample },
    { id: 'head', label: 'Head/Meta', component: HeadExample },
    { id: 'env', label: 'Environment', component: EnvExample },
    { id: 'api', label: 'API Client', component: ApiExample },
  ];

  const ActiveComponent = examples.find((ex) => ex.id === activeExample)?.component || NavigationExample;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shim Usage Examples</h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            className={`px-4 py-2 rounded ${
              activeExample === example.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {example.label}
          </button>
        ))}
      </div>

      {/* Active Example */}
      <div className="bg-white border rounded-lg p-6">
        <ActiveComponent />
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> All these examples work in both Vite and Next.js without any code changes!
          Just update the shim implementations when you migrate.
        </p>
      </div>
    </div>
  );
}
