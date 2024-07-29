'use client';
import { useLiff } from '@/components/LiffProvider';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  InsertTableTestDocument,
  InsertTableTestMutation,
  InsertTableTestMutationVariables,
} from '../generated/graphql';

export default function Page() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [insertTableTest, { data, loading, error }] = useMutation<
    InsertTableTestMutation,
    InsertTableTestMutationVariables
  >(InsertTableTestDocument);
  const { liff, liffError, lineProfile } = useLiff();

  useEffect(() => {
    setId(uuidv4());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insertTableTest({ variables: { id, name } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <main>
        <h1>create-liff-app</h1>
        {liff && <p>LIFF init succeeded.</p>}
        {liffError && (
          <>
            <p>LIFF init failed.</p>
            <p>
              <code>{liffError}</code>
            </p>
          </>
        )}
        <a href="https://developers.line.biz/ja/docs/liff/" target="_blank" rel="noreferrer">
          LIFF Documentation
        </a>
      </main>
      <h1>Hello, Home page!</h1>
      <h2>{lineProfile?.displayName}さんこんにちは！</h2>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded shadow-md">
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {data && <p className="text-green-500">Success: {JSON.stringify(data)}</p>}
      </form>
    </div>
  );
}
