import React, { useState } from 'react';
import { SCHEMA_TABLES } from '../data/laravelCodeSnippets';
import { SchemaTable } from '../types/saas';
import { Key, Link as LinkIcon, Database, ArrowRight, ShieldCheck, Check, Copy } from 'lucide-react';

export const ErdViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<SchemaTable>(SCHEMA_TABLES[0]);
  const [copiedSql, setCopiedSql] = useState(false);

  const generateFullSql = () => {
    return `-- ====================================================
-- SCHEMA MYSQL SAAS UNDANGAN DIGITAL
-- Dialect: MySQL 8.0+ / InnoDB / utf8mb4_unicode_ci
-- ====================================================

CREATE TABLE \`users\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`phone_number\` VARCHAR(20) NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('super_admin', 'reseller', 'customer') DEFAULT 'customer',
  \`reseller_id\` BIGINT UNSIGNED NULL,
  \`created_at\` TIMESTAMP NULL,
  \`updated_at\` TIMESTAMP NULL,
  INDEX \`idx_users_role\` (\`role\`),
  FOREIGN KEY (\`reseller_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`themes\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`preview_image\` VARCHAR(255) NOT NULL,
  \`blade_view_path\` VARCHAR(255) NOT NULL,
  \`price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP NULL,
  \`updated_at\` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`orders\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`user_id\` BIGINT UNSIGNED NOT NULL,
  \`reseller_id\` BIGINT UNSIGNED NULL,
  \`theme_id\` BIGINT UNSIGNED NOT NULL,
  \`total_amount\` DECIMAL(12,2) NOT NULL,
  \`reseller_commission\` DECIMAL(12,2) DEFAULT 0.00,
  \`payment_status\` ENUM('pending', 'paid', 'failed', 'expired') DEFAULT 'pending',
  \`snap_token\` VARCHAR(255) NULL,
  \`payment_url\` TEXT NULL,
  \`payment_method\` VARCHAR(50) NULL,
  \`paid_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NULL,
  \`updated_at\` TIMESTAMP NULL,
  INDEX \`idx_orders_status\` (\`payment_status\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`reseller_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`theme_id\`) REFERENCES \`themes\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`invitations\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` BIGINT UNSIGNED NOT NULL,
  \`user_id\` BIGINT UNSIGNED NOT NULL,
  \`theme_id\` BIGINT UNSIGNED NOT NULL,
  \`slug\` VARCHAR(100) NOT NULL UNIQUE,
  \`title\` VARCHAR(255) NOT NULL,
  \`groom_name\` VARCHAR(150) NOT NULL,
  \`groom_parents\` VARCHAR(255) NULL,
  \`bride_name\` VARCHAR(150) NOT NULL,
  \`bride_parents\` VARCHAR(255) NULL,
  \`event_date\` DATETIME NOT NULL,
  \`venue_name\` VARCHAR(255) NOT NULL,
  \`venue_address\` TEXT NULL,
  \`google_maps_url\` TEXT NULL,
  \`music_url\` VARCHAR(255) NULL,
  \`gallery_photos\` JSON NULL,
  \`bank_accounts\` JSON NULL,
  \`is_published\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP NULL,
  \`updated_at\` TIMESTAMP NULL,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`theme_id\`) REFERENCES \`themes\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`guests\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`invitation_id\` BIGINT UNSIGNED NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`slug\` VARCHAR(150) NOT NULL,
  \`phone_number\` VARCHAR(25) NULL,
  \`rsvp_status\` ENUM('attending', 'not_attending', 'uncertain', 'pending') DEFAULT 'pending',
  \`rsvp_pax\` INT DEFAULT 1,
  \`wishes_message\` TEXT NULL,
  \`checked_in_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NULL,
  \`updated_at\` TIMESTAMP NULL,
  INDEX \`idx_invitation_slug\` (\`invitation_id\`, \`slug\`),
  FOREIGN KEY (\`invitation_id\`) REFERENCES \`invitations\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`payments\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` BIGINT UNSIGNED NOT NULL,
  \`transaction_id\` VARCHAR(100) NULL,
  \`transaction_status\` VARCHAR(50) NOT NULL,
  \`raw_response\` JSON NOT NULL,
  \`created_at\` TIMESTAMP NULL,
  \`updated_at\` TIMESTAMP NULL,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(generateFullSql());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Overview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl font-bold text-white">Entity Relationship Diagram (ERD) & Database Schema</h2>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Struktur tabel terenkapsulasi untuk arsitektur SaaS Undangan Digital Multi-Role dengan relasi integritas referensial kuat.
            </p>
          </div>
          <button
            onClick={handleCopySql}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {copiedSql ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">SQL Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Salin Raw DDL MySQL (All Tables)</span>
              </>
            )}
          </button>
        </div>

        {/* Visual Relational Overview Flow */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SCHEMA_TABLES.map((table) => {
            const isSelected = selectedTable.name === table.name;
            return (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table)}
                className={`p-3.5 rounded-xl border text-left transition ${
                  isSelected
                    ? 'bg-rose-500/10 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-200">{table.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{table.columns.length} col</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {table.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Relational Flow Diagram Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-xl">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-pink-400" />
          Peta Alur Relasi Antar Tabel (Relational Architecture)
        </h3>

        <div className="min-w-[700px] flex items-center justify-between gap-4 py-4 px-2">
          {/* USERS */}
          <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-4 flex-1 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold text-indigo-400">users</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">1</span>
            </div>
            <p className="text-[11px] text-slate-400">Role: Super Admin, Reseller, Customer</p>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">1 Reseller ➔ N Customers</div>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

          {/* ORDERS */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 flex-1 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold text-amber-400">orders</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">N</span>
            </div>
            <p className="text-[11px] text-slate-400">Pemesanan & Midtrans Snap Token</p>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">FK: user_id, theme_id</div>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

          {/* INVITATIONS */}
          <div className="bg-slate-900 border border-rose-500/40 rounded-xl p-4 flex-1 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold text-rose-400">invitations</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">1:1</span>
            </div>
            <p className="text-[11px] text-slate-400">Konten Mempelai & Web Undangan</p>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">FK: order_id (Auto Publish)</div>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

          {/* GUESTS */}
          <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 flex-1 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold text-emerald-400">guests</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">N</span>
            </div>
            <p className="text-[11px] text-slate-400">Buku Tamu, RSVP & Scan QR</p>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">FK: invitation_id</div>
          </div>
        </div>
      </div>

      {/* Selected Table Detail Column Inspection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-rose-500/20 text-rose-400 font-mono text-sm font-bold rounded-lg border border-rose-500/30">
              TABLE: {selectedTable.name}
            </div>
            <span className="text-slate-400 text-xs sm:text-sm">
              {selectedTable.description}
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            InnoDB / UTF8MB4
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Nama Kolom</th>
                <th className="py-3 px-4">Tipe Data</th>
                <th className="py-3 px-4">Atribut / Kunci</th>
                <th className="py-3 px-4">Keterangan & Logika Bisnis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {selectedTable.columns.map((col) => (
                <tr key={col.name} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-200 flex items-center gap-2">
                    {col.isPrimary && (
                      <span title="Primary Key">
                        <Key className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />
                      </span>
                    )}
                    {col.isForeign && (
                      <span title="Foreign Key">
                        <LinkIcon className="w-3.5 h-3.5 text-sky-400 inline shrink-0" />
                      </span>
                    )}
                    <span>{col.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-400 text-xs">
                    {col.type}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {col.isPrimary && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                        PRIMARY KEY
                      </span>
                    )}
                    {col.isForeign && (
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                        FK ➔ {col.foreignRef}
                      </span>
                    )}
                    {col.nullable && (
                      <span className="ml-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        NULLABLE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-xs">
                    {col.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security & Design Best Practices Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Best Practice Keamanan:</strong> Gunakan UUID atau BigInteger auto-increment dengan slug unik acak untuk URL undangan guna mencegah <em>Insecure Direct Object Reference (IDOR)</em> dan scraping massal.
          </span>
        </div>
      </div>

    </div>
  );
};
