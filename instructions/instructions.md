# Project Overview

Your goal is to build a Next.js application that allows users to review the CV files using gemini api. The application should provide a clean, user-friendly interface for uploading PDF or DOCX Files, displaying CV Review Result.

Technologies Used: 
- Next.js 15 for the framewerk
- TypeScript far type safety 
- Tallwind CSS for styling
- Gemini API for CV Review
- Sonner for teast notifications

# Core Functionalities

## 1. File Upload
- Single file upload interface with drag-and-drop support
- Immediate file processing upon selection
- File type validation (PDF, DOCX)
- File size validation (max 20MB)
- Landing state indication during upload and processing 
- Error handling with user-friendly notifications

## 2. CV anylizer
- Automatic anylizer Gemini API

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name)
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "Panduan Penulisan CV yang Baik untuk Sistem ATS\nTampilan Umum\n\nFoto: Tidak disarankan mencantumkan foto pada CV.\nPanjang CV: Idealnya, CV hanya 1–2 halaman.\nBahasa: Gunakan bahasa Inggris untuk mempermudah pembacaan oleh sistem ATS.\nFont: Pilih font standar seperti Arial, Helvetica, Times New Roman, atau Calibri dengan ukuran minimal 11.\nDesain: Gunakan desain sederhana dengan hanya dua warna, hitam dan putih.\nStruktur dan Format\n\nStruktur: CV harus terorganisir secara jelas, dengan urutan:\nBiografi singkat\nKontak\nPengalaman kerja\nPendidikan\nKemampuan (skills)\nMargin: Pastikan margin konsisten, antara 0,5–1 inci.\nFormat File: Simpan CV dalam format .doc, .docx, atau .pdf.\nKonten Utama\n\nKontak: Cantumkan nama, alamat email, nomor telepon, dan profil LinkedIn (jika ada) di bagian atas CV.\nRingkasan Diri: Tuliskan ringkasan diri secara singkat, mencerminkan keahlian utama dan tujuan karier.\nWork Experience:\nCantumkan pengalaman kerja yang relevan dengan posisi yang dilamar.\nGunakan format kronologis terbalik (dari pengalaman terbaru ke yang lama).\nPendidikan:\nCantumkan pendidikan terakhir, minimal dari SMA atau universitas.\nPencapaian:\nSertakan prestasi seperti lomba atau beasiswa.\nPastikan pencapaian relevan dengan posisi yang dilamar.\nSertifikasi:\nHanya tampilkan sertifikasi yang kredibel dan relevan.\nSelektif dalam mencantumkan sertifikasi agar tidak memenuhi halaman.\nProyek dan Teknologi:\nCantumkan proyek yang pernah dikerjakan, lengkap dengan teknologi atau aplikasi yang digunakan.\nPengalaman Organisasi:\nSebutkan pengalaman organisasi, terutama jika pernah memegang posisi sebagai pemimpin.\nTips Tambahan\n\nKata Kunci: Gunakan kata kunci yang sesuai dengan deskripsi pekerjaan untuk meningkatkan peluang lolos sistem ATS.\nAngka dan Data: Jika memungkinkan, gunakan data kuantitatif untuk menunjukkan pencapaian.\nKonsistensi Format: Pastikan format, gaya penulisan, dan tanda baca konsisten di seluruh dokumen.\n\nberikan persentase ats cv ini. berikan hal yang sudah baik, hal yang perlu ditingkatkan, juga saran dan cv ini ats atau tidak",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("CV AL-MAN RAFFLI SAPUTRA (2) - Al-man Raffli Saputra _Morina.pdf", "application/pdf"),
  ];

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(files);

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: ""},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_FILE_HERE");
  console.log(result.response.text());
}

run();

- Server-side processing with temporary file storage
- Word count analysis
- Real-time status updates
- Comprehensive error handling toast 

## 3. Result Display
- Clean presentation anylizer results
- Formatted text display with proper whitespace handling
- Error State handling with user feedback

