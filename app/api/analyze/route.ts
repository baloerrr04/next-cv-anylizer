import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const systemPrompt = `Panduan Penulisan CV yang Baik untuk Sistem ATS
Tampilan Umum

Foto: Tidak disarankan mencantumkan foto pada CV.
Panjang CV: Idealnya, CV hanya 1–2 halaman.
Bahasa: Gunakan bahasa Inggris untuk mempermudah pembacaan oleh sistem ATS.
Font: Pilih font standar seperti Arial, Helvetica, Times New Roman, atau Calibri dengan ukuran minimal 11.
Desain: Gunakan desain sederhana dengan hanya dua warna, hitam dan putih. margin seragam dan tanpa elemen visual kompleks.

Struktur dan Konten Utama
- Struktur yang Terorganisir: Pisahkan dengan jelas bagian seperti Working Experience, Education, Achievements, Certifications, dan Skills.
Gunakan subjudul yang jelas dan konsisten untuk setiap bagian.
- Work Experience: Gunakan format kronologis terbalik, dimulai dari pengalaman terbaru.
Sertakan tanggung jawab utama dan pencapaian yang diukur dengan data kuantitatif (contoh: "Increased revenue by 12%").
Hindari terlalu banyak detail teknis, fokus pada hasil atau dampak pekerjaan Anda.
- Education: Sebutkan institusi, jurusan, gelar, dan tahun lulus.
Tambahkan penghargaan atau pencapaian akademik jika relevan.
- Certifications: Hanya cantumkan sertifikasi yang kredibel dan relevan dengan posisi yang dilamar.
- Skills dan Languages: Pisahkan antara soft skills dan hard skills.
Gunakan kata kunci terkait keterampilan teknis yang relevan dengan pekerjaan yang diincar.
- Kontak: Letakkan kontak di bagian atas CV, termasuk email, nomor telepon, dan tautan LinkedIn.
- Hobbies: Hindari mencantumkan hobi yang tidak relevan atau terlihat tidak profesional.

Berikan analisis CV dalam format JSON dengan struktur berikut:
{
  "ATS_Score": number (0-100),
  "Strengths": string[],
  "Weaknesses": string[],
  "Suggestions": string[],
  "ATS_Friendly": boolean
}

Catatan:
- ATS_Score harus berupa angka antara 0-100 tanpa simbol %. Pastikan CV dengan desain atau struktur yang buruk mendapatkan skor yang lebih rendah, meskipun memiliki konten yang kuat.
- Strengths berisi daftar hal positif dari CV dalam bentuk array
- Weaknesses berisi daftar hal yang perlu diperbaiki dalam bentuk array (Kalimat perintah)
- Suggestions berisi daftar saran konkrit, diberikan contoh kalimat perbaikannya sesuai dengan isi CV nya dalam bentuk array
- ATS_Friendly berisi true jika skor di atas 80, false jika di bawah 80
- jika yang diinput bukan format cv maka berikan respon "Invalid CV format"

Berikan respon hanya dalam format JSON yang valid tanpa komentar atau teks tambahan menggunakan bahasa inggris.`;

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
    
    // Clean the response text
    const cleanText = text
      .replace(/```json\n?|\n?```/g, '') // Remove markdown code blocks
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim();

    try {
      const analysis = JSON.parse(cleanText);
      
      // Validate the response structure
      if (!analysis.ATS_Score || !Array.isArray(analysis.Strengths) || !Array.isArray(analysis.Weaknesses) || !Array.isArray(analysis.Suggestions)) {
        throw new Error('Invalid response structure');
      }
      
      return NextResponse.json({ analysis });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError, 'Raw text:', cleanText);
      return NextResponse.json(
        { error: 'Failed to parse analysis results' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { error: error.message || 'Error analyzing CV' },
      { status: 500 }
    );
  }
}
