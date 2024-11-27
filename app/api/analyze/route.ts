import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const systemPrompt = `Panduan Penulisan CV yang Baik untuk Sistem ATS
Tampilan Umum

Foto: Tidak disarankan mencantumkan foto pada CV.
Panjang CV: Idealnya, CV hanya 1–2 halaman.
Bahasa: Gunakan bahasa Inggris untuk mempermudah pembacaan oleh sistem ATS.
Font: Pilih font standar seperti Arial, Helvetica, Times New Roman, atau Calibri dengan ukuran minimal 11.
Desain: Gunakan desain sederhana dengan hanya dua warna, hitam dan putih.

Berikan analisis CV dalam format JSON dengan struktur berikut:
{
  "ATS_Score": number (0-100),
  "Strengths": string[],
  "Weaknesses": string[],
  "Suggestions": string[],
  "ATS_Friendly": boolean
}

Catatan:
- ATS_Score harus berupa angka antara 0-100 tanpa simbol %
- Strengths berisi daftar hal positif dari CV dalam bentuk array
- Weaknesses berisi daftar hal yang perlu diperbaiki dalam bentuk array (Kalimat perintah)
- Suggestions berisi daftar saran konkrit, diberikan contoh kalimat perbaikannya sesuai dengan isi CV nya dalam bentuk array
- ATS_Friendly berisi true jika skor di atas 80, false jika di bawah 80

Berikan respon dalam format JSON yang valid tanpa komentar atau teks tambahan menggunakan bahasa inggris.`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('cv') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Analyze the CV
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type,
          data: base64Data
        }
      },
      systemPrompt
    ]);

    const response = await result.response;
    const text = response.text();
    console.log('Raw response:', text);

    // Parse the text as JSON
    try {
      const analysis = JSON.parse(text.replace(/```json\n|\n```/g, ''));
      return NextResponse.json({ analysis });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { error: 'Error analyzing CV' },
      { status: 500 }
    );
  }
}
