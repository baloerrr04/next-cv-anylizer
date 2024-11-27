import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { feedback } = await request.json();
    const timestamp = new Date().toISOString();
    const feedbackEntry = `[${timestamp}] ${feedback}\n`;
    
    const filePath = path.join(process.cwd(), 'public', 'feedback.txt');
    fs.appendFileSync(filePath, feedbackEntry);
    
    return NextResponse.json({ message: 'Feedback saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ error:  error.message }, { status: 500 });
  }
}
