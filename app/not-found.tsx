import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#141414]">
      <h2 className="text-2xl font-bold mb-4">404 - Tidak Ditemukan</h2>
      <p className="text-gray-400 mb-8">Halaman yang Anda cari tidak ada.</p>
      <Link href="/" className="bg-white text-black px-6 py-2 rounded-lg font-medium">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
