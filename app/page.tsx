"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Menu, ArrowRight, Lock, Zap, User, MapPin, 
  Calendar, Hash, Search, Shield, Server, Users, Terminal, Gitlab, X,
  BookOpen, HelpCircle, FileText
} from "lucide-react";
import * as motion from "motion/react-client";

export default function Home() {
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isStealth, setIsStealth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState<{text: string, type: 'info'|'success'|'error'|'data'}[]>([]);


  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length !== 16) {
      setError("❌ NIK harus 16 digit angka.");
      return;
    }
    
    setError("");
    setLoading(true);
    setResult(null);
    setTerminalLogs([{ text: `> Inisialisasi proses OSINT untuk NIK: ${nik}`, type: 'info' }]);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // Simulasi delay deployment log / proses terminal (total ~ 8-10 detik)
      await sleep(1500);
      setTerminalLogs(prev => [...prev, { text: "> Memvalidasi format NIK...", type: 'info' }]);
      
      await sleep(1500);
      setTerminalLogs(prev => [...prev, { text: "> Format valid. Memetakan provinsi...", type: 'info' }]);
      
      const res = await fetch("/api/cek-nik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik })
      });
      const data = await res.json();
      
      await sleep(1500);
      setTerminalLogs(prev => [...prev, { text: "> Memetakan kabupaten/kota...", type: 'info' }]);
      
      await sleep(1500);
      setTerminalLogs(prev => [...prev, { text: "> Memetakan kecamatan...", type: 'info' }]);
      
      await sleep(1500);
      setTerminalLogs(prev => [...prev, { text: "> Memetakan tanggal lahir dan jenis kelamin...", type: 'info' }]);
      
      await sleep(1500);
      setTerminalLogs(prev => [...prev, { text: "> Mengekstrak nomor unik...", type: 'info' }]);
      
      await sleep(1000);

      if (data.success) {
        setTerminalLogs(prev => [...prev, { text: "> Dekode berhasil. Mengompilasi laporan akhir...", type: 'success' }]);
        await sleep(500);
        setResult(data.data);
      } else {
        setTerminalLogs(prev => [...prev, { text: "> Proses dibatalkan: " + (data.error || "Terjadi kesalahan."), type: 'error' }]);
        setError(data.error || "Terjadi kesalahan.");
      }
    } catch (err) {
      setTerminalLogs(prev => [...prev, { text: "> Kesalahan jaringan internal.", type: 'error' }]);
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-white/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#141414]/80 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <Gitlab className="w-6 h-6 text-orange-500" fill="currentColor" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">CheckNik</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-[280px] h-full bg-[#0a0a0a] border-l border-white/10 p-6 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Gitlab className="w-5 h-5 text-orange-500" fill="currentColor" />
                </div>
                <span className="font-bold text-white text-sm tracking-tight">CheckNik</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-8 text-sm text-gray-300">
              <div className="space-y-4">
                <h4 className="font-mono text-[10px] tracking-widest text-gray-500 uppercase px-3">Pencarian</h4>
                <div className="flex flex-col gap-1">
                  <a href="#" className="flex items-center gap-3 hover:bg-white/5 hover:text-white px-3 py-2.5 rounded-lg transition-colors">
                    <Search className="w-4 h-4 text-gray-400" />
                    Pencarian balik NIK
                  </a>
                  <a href="#" className="flex items-center gap-3 hover:bg-white/5 hover:text-white px-3 py-2.5 rounded-lg transition-colors">
                    <User className="w-4 h-4 text-gray-400" />
                    Pencarian akun identitas
                  </a>
                  <a href="#" className="flex items-center gap-3 hover:bg-white/5 hover:text-white px-3 py-2.5 rounded-lg transition-colors">
                    <Server className="w-4 h-4 text-gray-400" />
                    Pencarian OSINT NIK
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-[10px] tracking-widest text-gray-500 uppercase px-3">Tentang</h4>
                <div className="flex flex-col gap-1">
                  <a href="#" className="flex items-center gap-3 hover:bg-white/5 hover:text-white px-3 py-2.5 rounded-lg transition-colors">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                    Apa itu CheckNik?
                  </a>
                  <a href="#" className="flex items-center gap-3 hover:bg-white/5 hover:text-white px-3 py-2.5 rounded-lg transition-colors">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    Panduan lapangan
                  </a>
                  <a href="#" className="flex items-center gap-3 hover:bg-white/5 hover:text-white px-3 py-2.5 rounded-lg transition-colors">
                    <FileText className="w-4 h-4 text-gray-400" />
                    FAQ
                  </a>
                </div>
              </div>
            </nav>
            
            <div className="mt-auto border-t border-white/10 pt-6">
              <a 
                href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-4 py-3 rounded-lg transition-colors font-medium text-xs text-center border border-emerald-500/20"
              >
                Join WhatsApp Channel
              </a>
            </div>
          </motion.div>
        </div>
      )}

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10 md:py-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center max-w-xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-mono text-gray-400">Live · Pengecekan identitas real-time</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4 leading-tight"
          >
            Satu NIK. <br /> Semua data di dalamnya.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-400 mb-8 max-w-md leading-relaxed"
          >
            CheckNik adalah alat OSINT identitas online gratis: masukkan NIK (Nomor Induk Kependudukan) untuk pencarian balik di seluruh data regional Indonesia, dalam satu laporan.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.3 }}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-1.5 mb-6"
          >
            <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-1.5">
              <input 
                type="text" 
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="Masukkan 16 digit NIK..."
                className="flex-1 bg-transparent border-none outline-none text-white px-3 py-2 text-sm placeholder:text-gray-600 font-mono"
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Cek"}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-3 text-xs text-gray-500"
          >
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setIsStealth(!isStealth)}
                className={`w-8 h-4.5 rounded-full transition-colors relative ${isStealth ? 'bg-white' : 'bg-[#2a2a2a]'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-[#141414] absolute top-0.5 transition-all ${isStealth ? 'left-4' : 'left-1'}`}></div>
              </button>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Mode Senyap
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              <span>Cari sekarang, periksa detail NIK dengan aman</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              <span>Pribadi & aman - Tidak ada data yang disimpan</span>
            </div>
          </motion.div>
        </section>

        {/* Result Terminal Section */}
        {error && !loading && terminalLogs.length === 0 && (
          <div className="max-w-2xl mx-auto mb-16 p-4 bg-red-950/30 border border-red-500/20 rounded-xl text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {(loading || result || terminalLogs.length > 0) && (
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-16 w-full"
          >
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-xs md:text-sm">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-[#1a1a1a]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-gray-500 ml-2 flex items-center gap-2 text-xs">
                  <Terminal className="w-3.5 h-3.5" />
                  osint-log-cek-nik
                </span>
              </div>
              {/* Terminal Body */}
              <div className="p-4 md:p-6 text-gray-300 min-h-[200px] max-h-[400px] overflow-y-auto space-y-2">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={`${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {log.text}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="animate-pulse">_</span>
                  </div>
                )}

                {result && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-4 border-t border-white/10 text-emerald-400 space-y-2">
                    <div className="text-white font-medium mb-3">{'>'} DATA_DITEMUKAN:</div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      <span className="text-gray-500">NIK</span>
                      <span className="md:col-span-3 text-white">{result.nik}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      <span className="text-gray-500">Tanggal_Lahir</span>
                      <span className="md:col-span-3 text-white">{result.tanggalLahir}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      <span className="text-gray-500">Jenis_Kelamin</span>
                      <span className="md:col-span-3 text-white">{result.jenisKelamin}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      <span className="text-gray-500">Provinsi</span>
                      <span className="md:col-span-3 text-white">{result.provinsi}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      <span className="text-gray-500">Kab_Kota</span>
                      <span className="md:col-span-3 text-white">{result.kabKota}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      <span className="text-gray-500">Kecamatan</span>
                      <span className="md:col-span-3 text-white">{result.kecamatan}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      <span className="text-gray-500">Kode_Pos</span>
                      <span className="md:col-span-3 text-white">{result.kodePos}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                      <span className="text-gray-500">No_Unik</span>
                      <span className="md:col-span-3 text-white">{result.noUnik}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Features Section */}
        <section className="mb-20">
          <div className="max-w-xl mb-10">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-3 leading-tight">
              Setiap detail yang ada di NIK, dalam satu laporan terkonsolidasi.
            </h2>
            <p className="text-sm text-gray-400">
              Di mana pun NIK tersebut terdaftar di Indonesia, disatukan dalam satu laporan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: User, title: "Info Pribadi", cat: "01" },
              { icon: MapPin, title: "Detail Lokasi", cat: "02" },
              { icon: Calendar, title: "Data Kelahiran", cat: "03" },
              { icon: Hash, title: "Kode Wilayah", cat: "04" },
            ].map((feature, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5 md:p-6 group hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                    <feature.icon className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 tracking-wider">KATEGORI / {feature.cat}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Explanation Section */}
        <section className="mb-20">
          <div className="max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6">
              CheckNik online: alat OSINT NIK dan pencarian balik gratis
            </h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>
                CheckNik adalah alat OSINT gratis yang berjalan sepenuhnya online, tanpa instalasi, tanpa API key, tanpa baris perintah. Tempel NIK apa pun dan CheckNik akan melakukan pencarian balik langsung untuk memecahkan kode nomor identitas 16 digit, lalu mengembalikan satu laporan tentang detail lokasi dan kelahiran yang terdaftar. Ini adalah alat OSINT online yang dapat Anda jalankan dari perangkat apa pun.
              </p>
              <p>
                Apakah Anda memerlukan OSINT NIK, pencarian identitas balik, pencarian lokasi, atau cara untuk menemukan tanggal lahir yang terkait dengan NIK, semuanya menggunakan mesin yang sama di satu tempat. Setiap pengecekan mem-parsing kode demografis publik, sehingga CheckNik dapat memverifikasi identitas tanpa pernah menyimpan data Anda di server kami.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
           {[
             { icon: Search, title: "Pencarian balik NIK", desc: "Jalankan pencarian balik NIK dari satu nomor dan temukan setiap wilayah yang terkait dengannya." },
             { icon: Server, title: "Pemeriksa OSINT NIK", desc: "Pemeriksa OSINT NIK lengkap di browser Anda: urai kode identitas secara instan." },
             { icon: Users, title: "Temukan data demografis", desc: "Temukan data demografis dalam hitungan detik. CheckNik menampilkan info regional di seluruh nusantara." },
           ].map((card, i) => (
             <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5 md:p-6">
               <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center border border-white/10 mb-4">
                 <card.icon className="w-3.5 h-3.5 text-gray-300" />
               </div>
               <h3 className="text-sm font-semibold text-white mb-2">{card.title}</h3>
               <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
             </div>
           ))}
        </section>

        {/* FAQ Section */}
        <section className="mb-20 max-w-2xl mx-auto md:mx-0">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
              Pertanyaan yang sering diajukan
            </h2>
            <p className="text-sm text-gray-400">
              Apa yang paling sering ditanyakan komunitas sebelum menggunakan alat ini.
            </p>
          </div>
          
          <div className="space-y-3">
            {[
              {
                q: "Apa yang dapat ditemukan CheckNik dari satu nomor NIK?",
                a: "CheckNik dapat mengurai NIK untuk menemukan informasi demografis publik seperti provinsi, kabupaten/kota, kecamatan, tanggal lahir, dan jenis kelamin yang terdaftar."
              },
              {
                q: "Bagaimana CheckNik mengetahui detail dari sebuah NIK?",
                a: "CheckNik menggunakan algoritma pemecahan kode standar berdasarkan struktur 16 digit NIK yang ditetapkan oleh pemerintah, mencocokkan kode wilayah dan tanggal lahir."
              },
              {
                q: "Apakah menggunakan CheckNik legal?",
                a: "Ya, sepenuhnya legal. CheckNik hanya memecahkan kode dari format angka yang Anda masukkan secara matematis, tanpa mengakses atau meretas database kependudukan (Dukcapil)."
              },
              {
                q: "Apakah CheckNik berfungsi di perangkat seluler?",
                a: "Ya, antarmuka web CheckNik dirancang responsif dan dapat digunakan dengan lancar di perangkat seluler maupun desktop."
              },
              {
                q: "Apakah saya memerlukan akun untuk mencari?",
                a: "Tidak, Anda tidak memerlukan akun. Alat ini sepenuhnya gratis, tanpa registrasi, dan tanpa API key."
              },
              {
                q: "Apakah pencarian saya disimpan?",
                a: "Tidak ada data yang disimpan. Proses dekode berjalan secara real-time dan log Anda akan langsung hilang setelah sesi berakhir, memastikan privasi penuh."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium text-white transition-colors hover:bg-white/5">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" className="w-4 h-4 text-gray-500"><path d="m6 9 6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-8 p-5 bg-[#1a1a1a] border border-emerald-500/20 rounded-xl flex items-center justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Gabung Saluran Developer</h3>
              <p className="text-xs text-gray-400">Dapatkan update terbaru, pembaruan fitur, dan diskusi seputar OSINT.</p>
            </div>
            <a 
              href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-5 py-2.5 rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
            >
              Join WhatsApp
            </a>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto bg-[#141414] pb-10">
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-5 h-5 flex items-center justify-center">
                 <Gitlab className="w-5 h-5 text-orange-500" fill="currentColor" />
               </div>
               <span className="font-bold text-white text-sm">CheckNik</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              CheckNik adalah alat OSINT identitas. Masukkan NIK dan cari tahu registrasi regionalnya langsung dari browser Anda.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-[10px] tracking-widest text-gray-600 mb-4 uppercase">Pencarian</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Pencarian balik NIK</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pencarian akun identitas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pencarian OSINT NIK</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Temukan orang dengan NIK</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-widest text-gray-600 mb-4 uppercase">Tentang CheckNik</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Apa itu CheckNik?</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CheckNik online</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Web vs CLI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Apakah ini aman?</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-widest text-gray-600 mb-4 uppercase">Panduan</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Cara membaca NIK</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NIK untuk Peneliti</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Panduan lapangan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex gap-3 text-gray-500">
            <span>SANN404 FORUM GROUP</span>
            <span>·</span>
            <span>Hanya untuk penelitian OSINT resmi.</span>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">Privasi</a>
          </div>
          <p className="text-gray-600">
            CheckNik adalah proyek independen.
          </p>
        </div>
      </footer>
    </div>
  );
}
