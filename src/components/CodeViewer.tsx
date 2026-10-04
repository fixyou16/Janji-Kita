import React, { useState } from 'react';
import { CODE_SNIPPETS } from '../data/laravelCodeSnippets';
import { CodeFile } from '../types/saas';
import { Copy, Check, FileCode, Folder, CheckCircle2, Terminal, Info } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [activeFileId, setActiveFileId] = useState<string>(CODE_SNIPPETS[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeFile = CODE_SNIPPETS.find((f) => f.id === activeFileId) || CODE_SNIPPETS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { key: 'migration', label: '1. Database Migrations' },
    { key: 'model', label: '2. Eloquent Models' },
    { key: 'route', label: '3. Routes (web.php & api.php)' },
    { key: 'controller', label: '4. Controllers (Order & Webhook)' },
    { key: 'service', label: '5. Services (Midtrans & WhatsApp)' },
    { key: 'blade', label: '6. Frontend Blade Template' },
  ];

  const filteredSnippets = CODE_SNIPPETS.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* VS Code Quick Setup Command Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Panduan Instalasi Cepat di Terminal / VS Code</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Jalankan perintah ini di terminal project Laravel Anda untuk dependensi Payment & WhatsApp:
              </p>
            </div>
          </div>
          <div className="font-mono text-xs bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-rose-300 flex items-center gap-3 overflow-x-auto">
            <code>composer require midtrans/midtrans-php</code>
          </div>
        </div>
      </div>

      {/* Main Code Explorer: Sidebar + Code Editor View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: File Tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="mb-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari file atau fitur..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const filesInCat = filteredSnippets.filter((f) => f.category === cat.key);
                if (filesInCat.length === 0) return null;

                return (
                  <div key={cat.key} className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      <Folder className="w-3.5 h-3.5 text-rose-400" />
                      <span>{cat.label}</span>
                    </div>

                    <div className="space-y-1">
                      {filesInCat.map((file) => {
                        const isSelected = file.id === activeFileId;
                        return (
                          <button
                            key={file.id}
                            onClick={() => setActiveFileId(file.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                              isSelected
                                ? 'bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                              <span className="truncate font-mono">{file.name.split('/').pop()}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-950">
                              {file.language}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Highlights Card for Active File */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Sorotan Fitur & Keamanan</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeFile.description}
            </p>
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {activeFile.keyHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Code Box */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Code Header Bar */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-xs font-mono text-slate-300 ml-2 truncate font-semibold">
                {activeFile.path}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Salin kode file ini"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin File Ini</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 overflow-x-auto max-h-[680px] bg-slate-950 text-slate-200 text-xs font-mono leading-relaxed select-text">
            <pre className="overflow-x-auto whitespace-pre">
              <code>{activeFile.code}</code>
            </pre>
          </div>

          {/* Code Footer Bar */}
          <div className="bg-slate-900/60 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Laravel 11 / 12 Architecture • Best Practice PSR-12</span>
            <span>UTF-8</span>
          </div>

        </div>

      </div>

    </div>
  );
};
