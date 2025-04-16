'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Kiosk() {
  const [subAccountId, setSubAccountId] = useState('');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');

  async function handleCheckIn() {
    try {
      const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .select('id, first_name')
        .eq('pin', pin)
        .eq('sub_account_id', subAccountId)
        .single();

      if (contactError || !contact) {
        setMessage('Invalid PIN or Sub-Account ID');
        return;
      }

      const { error: attendanceError } = await supabase
        .from('attendance')
        .insert({
          contact_id: contact.id,
          sub_account_id: subAccountId,
          check_in_time: new Date().toISOString(),
        });

      if (attendanceError) {
        setMessage('Error logging attendance');
        return;
      }

      setMessage(`Check-in successful for ${contact.first_name}`);
      setPin('');
    } catch (error) {
      setMessage('Error during check-in');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">The Follow Up Ninja Attendance Kiosk</h1>
        <div className="mb-4">
          <label htmlFor="subAccountId" className="block text-sm font-medium text-gray-700">
            Sub-Account ID
          </label>
          <input
            type="text"
            id="subAccountId"
            value={subAccountId}
            onChange={(e) => setSubAccountId(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter Sub-Account ID"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
            PIN
          </label>
          <input
            type="text"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter PIN"
          />
        </div>
        <button
          onClick={handleCheckIn}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Check In
        </button>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}