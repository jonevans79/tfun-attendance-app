import { NextResponse } from 'next/server';
import axios from 'axios';
import { supabase } from '../../../lib/supabase';

const TFUN_API_URL = 'https://api.thefollowup.ninja/v1';

export async function POST(request) {
  try {
    const { subAccountId, accessToken } = await request.json();

    if (!subAccountId || !accessToken) {
      return NextResponse.json({ error: 'Missing subAccountId or accessToken' }, { status: 400 });
    }

    const response = await axios.get(`${TFUN_API_URL}/contacts`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { locationId: subAccountId },
    });

    const contacts = response.data.contacts || [];

    for (const contact of contacts) {
      const pin = Math.random().toString(36).slice(2, 8);
      await supabase.from('contacts').upsert({
        tfun_contact_id: contact.id,
        sub_account_id: subAccountId,
        pin,
        first_name: contact.firstName,
        last_name: contact.lastName,
      });
    }

    return NextResponse.json({ message: 'Contacts synced successfully', count: contacts.length });
  } catch (error) {
    console.error('Error syncing contacts:', error);
    return NextResponse.json({ error: 'Failed to sync contacts' }, { status: 500 });
  }
}