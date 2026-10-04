import React, { useState } from 'react';
import { CODE_SNIPPETS, SCHEMA_TABLES } from '../data/laravelCodeSnippets';
import { X, Copy, Check, Terminal, FileCode } from 'lucide-react';

export const DeveloperArchitectureDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeFileId, setActiveFileId] = useState(CODE_SNIPPETS[0].id);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [tab, setTab] = useState<'code' | 'schema'>('code');

  if (!isOpen) return null;

  const activeFile = CODE_SNIPPETS.find((f) => f.id === activeFileId) || CODE_SNIPPETS[0];

  const handleCopySingle = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyAll = () => {
    const all = CODE_SNIPPETS.map(
      (f) => `// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.code}\n\n`
    ).join('\n');
    navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#36322e]/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-4xl h-full bg-[#f7f5f0] border-l border-[#e8e4dc] shadow-2xl flex flex-col text-[#36322e]">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#e8e4dc] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#faf9f6] text-[#9c614b] border border-[#e8e4dc]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-[#36322e]">Arsitektur Laravel 11 Backend</h2>
              <p className="text-[11px] text-[#766e65]">Migrations, Models, Routing, Midtrans & WhatsApp Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#faf9f6] text-xs text-[#36322e] border border-[#e8e4dc] shadow-2xs transition flex items-center gap-1.5"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-[#55705d]" /> : <Copy className="w-3.5 h-3.5 text-[#9c614b]" />}
              <span>{copiedAll ? 'Tersalin' : 'Salin Semua'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[#faf9f6] text-[#766e65] hover:text-[#36322e]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subnav */}
        <div className="px-4 py-2 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center gap-2 text-xs">
          <button
            onClick={() => setTab('code')}
            className={`px-3.5 py-1 rounded-full transition ${
              tab === 'code' ? 'bg-[#b77a64] text-white font-medium shadow-sm' : 'text-[#706a61]'
            }`}
          >
            File Kode ({CODE_SNIPPETS.length})
          </button>
          <button
            onClick={() => setTab('schema')}
            className={`px-3.5 py-1 rounded-full transition ${
              tab === 'schema' ? 'bg-[#b77a64] text-white font-medium shadow-sm' : 'text-[#706a61]'
            }`}
          >
            Skema MySQL ({SCHEMA_TABLES.length})
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {tab === 'code' ? (
            <>
              {/* File List */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#e8e4dc] bg-[#faf8f5] p-2 overflow-y-auto space-y-1">
                {CODE_SNIPPETS.map((f) => {
                  const isSel = f.id === activeFileId;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFileId(f.id)}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 transition ${
                        isSel
                          ? 'bg-white text-[#b77a64] font-medium shadow-sm'
                          : 'text-[#706a61] hover:bg-white/60 hover:text-[#2c2825]'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{f.name.split('/').pop()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Code Box */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="px-4 py-2 border-b border-[#f0ece3] bg-[#faf8f5] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#706a61] truncate">{activeFile.path}</span>
                  <button
                    onClick={handleCopySingle}
                    className="text-[#b77a64] hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedFile ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFile ? 'Disalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-auto font-mono text-xs text-[#2c2825] leading-relaxed">
                  <pre>
                    <code>{activeFile.code}</code>
                  </pre>
                </div>
              </div>
            </>
          ) : (
            /* Schema List */
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {SCHEMA_TABLES.map((table) => (
                <div key={table.name} className="p-4 rounded-2xl bg-white border border-[#e8e4dc] space-y-2 shadow-sm">
                  <div className="font-mono text-xs font-bold text-[#b77a64]">TABLE: {table.name}</div>
                  <p className="text-xs text-[#706a61]">{table.description}</p>
                  <div className="overflow-x-auto pt-1">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-[#f0ece3] text-[#8a8275]">
                          <th className="py-1 px-2">Column</th>
                          <th className="py-1 px-2">Type</th>
                          <th className="py-1 px-2">Key</th>
                          <th className="py-1 px-2">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f7f5f0]">
                        {table.columns.map((c) => (
                          <tr key={c.name}>
                            <td className="py-1 px-2 font-bold text-[#2c2825]">{c.name}</td>
                            <td className="py-1 px-2 text-[#b77a64]">{c.type}</td>
                            <td className="py-1 px-2 text-[#8a8275]">{c.isPrimary ? 'PK' : c.isForeign ? 'FK' : '-'}</td>
                            <td className="py-1 px-2 text-[#706a61] font-sans">{c.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
