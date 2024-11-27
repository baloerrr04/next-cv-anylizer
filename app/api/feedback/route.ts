import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { feedback } = await request.json();
    const timestamp = new Date().toISOString();
    const feedbackEntry = `[${timestamp}] ${feedback}\n`;
    
    const filePath = path.join(process.cwd(), 'public', 'feedback.txt');
    fs.appendFileSync(filePath, feedbackEntry);
    
    return NextResponse.json({ message: 'Feedback saved successfully' });
  } catch (err) {
    console.error('Error saving feedback:', err);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
