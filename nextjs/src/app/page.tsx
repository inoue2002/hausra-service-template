'use client';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { InsertTableTestDocument, InsertTableTestMutation, InsertTableTestMutationVariables } from '../generated/graphql';

const InsertTableTest: React.FC = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [insertTableTest, { data, loading, error }] = useMutation<InsertTableTestMutation, InsertTableTestMutationVariables>(InsertTableTestDocument);

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
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        {loading ? 'Loading...' : 'Submit'}
      </button>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && <p className="text-green-500">Success: {JSON.stringify(data)}</p>}
    </form>
  );
};

export default InsertTableTest;
