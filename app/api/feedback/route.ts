import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { feedback } = await request.json();
    const timestamp = new Date().toISOString();
    
    // Insert feedback into Supabase
    const { error } = await supabase
      .from('feedbacks')
      .insert([
        {
          feedback,
          created_at: timestamp
        }
      ]);

    if (error) throw error;
    
    return NextResponse.json({ message: 'Feedback saved successfully' });
  } catch (err) {
    console.error('Error saving feedback:', err);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
