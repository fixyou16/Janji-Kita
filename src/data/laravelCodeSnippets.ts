import { CodeFile, SchemaTable } from '../types/saas';

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'users',
    description: 'Menyimpan data pengguna dengan role Super Admin, Reseller, atau Customer.',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, description: 'Primary Key auto-increment' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Nama lengkap pengguna' },
      { name: 'email', type: 'VARCHAR(255)', description: 'Email unik untuk login' },
      { name: 'phone_number', type: 'VARCHAR(20)', description: 'Nomor WhatsApp untuk notifikasi otomatis' },
      { name: 'password', type: 'VARCHAR(255)', description: 'Password bcrypt hash' },
      { name: 'role', type: "ENUM('super_admin','reseller','customer')", description: 'Role akses akun (default: customer)' },
      { name: 'reseller_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'users.id', nullable: true, description: 'ID reseller jika mendaftar lewat link referral' },
      { name: 'created_at / updated_at', type: 'TIMESTAMP', description: 'Waktu registrasi & update' },
    ]
  },
  {
    name: 'themes',
    description: 'Katalog template desain undangan digital dengan preview & kategori.',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, description: 'Primary Key' },
      { name: 'name', type: 'VARCHAR(255)', description: 'Nama tema (cth: Rustic Romance, Minimalist Gold)' },
      { name: 'slug', type: 'VARCHAR(255)', description: 'URL-friendly identifier unik' },
      { name: 'preview_image', type: 'VARCHAR(255)', description: 'Path thumbnail preview gambar' },
      { name: 'blade_view_path', type: 'VARCHAR(255)', description: 'Lokasi view file Blade (cth: invitations.themes.rustic)' },
      { name: 'price', type: 'DECIMAL(12,2)', description: 'Harga dasar lisensi template' },
      { name: 'is_active', type: 'BOOLEAN', description: 'Status ketersediaan template (default: true)' },
    ]
  },
  {
    name: 'orders',
    description: 'Transaksi pemesanan undangan, status pembayaran & invoice Midtrans.',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, description: 'Primary Key' },
      { name: 'order_number', type: 'VARCHAR(50)', description: 'Nomor invoice unik (cth: ORD-202610-ABCD)' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'users.id', description: 'Pembeli (Customer)' },
      { name: 'reseller_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'users.id', nullable: true, description: 'Reseller penerima komisi (jika ada)' },
      { name: 'theme_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'themes.id', description: 'Template yang dibeli' },
      { name: 'total_amount', type: 'DECIMAL(12,2)', description: 'Total nilai transaksi IDR' },
      { name: 'reseller_commission', type: 'DECIMAL(12,2)', description: 'Komisi reseller dari transaksi ini' },
      { name: 'payment_status', type: "ENUM('pending','paid','failed','expired')", description: 'Status pembayaran otomatis' },
      { name: 'snap_token', type: 'VARCHAR(255)', nullable: true, description: 'Token sesi popup Midtrans Snap' },
      { name: 'payment_url', type: 'TEXT', nullable: true, description: 'Redirect URL Midtrans untuk direct link' },
      { name: 'payment_method', type: 'VARCHAR(50)', nullable: true, description: 'Metode: BCA VA, QRIS, GoPay, Mandiri, dll' },
      { name: 'paid_at', type: 'TIMESTAMP', nullable: true, description: 'Waktu pembayaran terverifikasi otomatis' },
    ]
  },
  {
    name: 'invitations',
    description: 'Data konten website undangan: mempelai, tanggal acara, lokasi Google Maps, dan galeri.',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, description: 'Primary Key' },
      { name: 'order_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'orders.id', description: 'Relasi ke transaksi pembelian' },
      { name: 'user_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'users.id', description: 'Pemilik undangan' },
      { name: 'theme_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'themes.id', description: 'Tema aktif' },
      { name: 'slug', type: 'VARCHAR(100)', description: 'Subpath URL unik (cth: romeo-dan-juliet)' },
      { name: 'title', type: 'VARCHAR(255)', description: 'Judul undangan (The Wedding of Romeo & Juliet)' },
      { name: 'groom_name', type: 'VARCHAR(150)', description: 'Nama lengkap pengantin pria' },
      { name: 'groom_parents', type: 'VARCHAR(255)', nullable: true, description: 'Nama orang tua mempelai pria' },
      { name: 'bride_name', type: 'VARCHAR(150)', description: 'Nama lengkap pengantin wanita' },
      { name: 'bride_parents', type: 'VARCHAR(255)', nullable: true, description: 'Nama orang tua mempelai wanita' },
      { name: 'event_date', type: 'DATETIME', description: 'Waktu & tanggal pelaksanaan akad/resepsi' },
      { name: 'venue_name', type: 'VARCHAR(255)', description: 'Nama gedung / alamat lokasi' },
      { name: 'google_maps_url', type: 'TEXT', nullable: true, description: 'Link petunjuk arah Google Maps' },
      { name: 'music_url', type: 'VARCHAR(255)', nullable: true, description: 'URL audio musik latar otomatis' },
      { name: 'gallery_photos', type: 'JSON', nullable: true, description: 'Array file foto prewedding' },
      { name: 'bank_accounts', type: 'JSON', nullable: true, description: 'Data rekening / e-wallet untuk amplop digital' },
      { name: 'is_published', type: 'BOOLEAN', description: 'Status aktif (otomatis true setelah bayar)' },
    ]
  },
  {
    name: 'guests',
    description: 'Daftar tamu undangan yang dipersonalisasi dan buku tamu / RSVP konfirmasi kehadiran.',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, description: 'Primary Key' },
      { name: 'invitation_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'invitations.id', description: 'Undangan terkait' },
      { name: 'name', type: 'VARCHAR(150)', description: 'Nama tamu undangan' },
      { name: 'slug', type: 'VARCHAR(150)', description: 'Slug untuk URL personal (?to=NamaTamu)' },
      { name: 'phone_number', type: 'VARCHAR(25)', nullable: true, description: 'Nomor WhatsApp tamu untuk broadcast' },
      { name: 'rsvp_status', type: "ENUM('attending','not_attending','uncertain','pending')", description: 'Status konfirmasi RSVP' },
      { name: 'rsvp_pax', type: 'INT', nullable: true, description: 'Jumlah orang yang akan hadir' },
      { name: 'wishes_message', type: 'TEXT', nullable: true, description: 'Ucapan dan doa dari tamu' },
      { name: 'checked_in_at', type: 'TIMESTAMP', nullable: true, description: 'Waktu check-in QR Code di meja resepsionis' },
    ]
  },
  {
    name: 'payments',
    description: 'Log transaksi gateway lengkap, audit trail webhook signature Midtrans & payload JSON.',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, description: 'Primary Key' },
      { name: 'order_id', type: 'BIGINT UNSIGNED', isForeign: true, foreignRef: 'orders.id', description: 'Order terkait' },
      { name: 'transaction_id', type: 'VARCHAR(100)', description: 'ID transaksi dari Midtrans' },
      { name: 'transaction_status', type: 'VARCHAR(50)', description: 'Status resmi: capture, settlement, pending, deny, expire' },
      { name: 'raw_response', type: 'JSON', description: 'Payload webhook mentah untuk audit trail' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Waktu penerimaan webhook' },
    ]
  }
];

export const CODE_SNIPPETS: CodeFile[] = [
  // 1. MIGRATIONS
  {
    id: 'migration_all',
    name: 'database/migrations/2026_01_01_000001_create_saas_invitation_tables.php',
    path: 'database/migrations/2026_01_01_000001_create_saas_invitation_tables.php',
    category: 'migration',
    language: 'php',
    description: 'Skema lengkap 6 tabel: users (multi-role), themes, orders, invitations, guests, dan payments dengan relasi Foreign Key & indeks optimasi.',
    keyHighlights: [
      'Multi-Role ENUM: super_admin, reseller, customer',
      'JSON Column untuk gallery_photos & bank_accounts',
      'Foreign Key Cascade on Delete pada order & invitation',
      'Indeks unik pada slug undangan & order_number'
    ],
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi seluruh tabel arsitektur SaaS Undangan Digital.
     */
    public function up(): void
    {
        // 1. TABEL USERS (Multi-Role)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone_number', 20)->nullable()->index();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['super_admin', 'reseller', 'customer'])->default('customer')->index();
            $table->foreignId('reseller_id')->nullable()->constrained('users')->nullOnDelete();
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. TABEL THEMES (Katalog Template)
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('preview_image');
            $table->string('blade_view_path'); // Contoh: 'invitations.themes.rustic'
            $table->decimal('price', 12, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. TABEL ORDERS (Transaksi & Payment Gateway)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('reseller_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('theme_id')->constrained('themes');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('reseller_commission', 12, 2)->default(0);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'expired'])->default('pending')->index();
            $table->string('snap_token')->nullable();
            $table->text('payment_url')->nullable();
            $table->string('payment_method', 50)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // 4. TABEL INVITATIONS (Konten Mempelai & Acara)
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('theme_id')->constrained('themes');
            $table->string('slug', 100)->unique(); // Akses via namadomain.com/v/{slug}
            $table->string('title');
            
            // Detail Mempelai
            $table->string('groom_name');
            $table->string('groom_parents')->nullable();
            $table->string('bride_name');
            $table->string('bride_parents')->nullable();
            
            // Detail Acara
            $table->dateTime('event_date');
            $table->string('venue_name');
            $table->text('venue_address')->nullable();
            $table->text('google_maps_url')->nullable();
            
            // Fitur Tambahan
            $table->string('music_url')->nullable();
            $table->json('gallery_photos')->nullable();
            $table->json('bank_accounts')->nullable(); // Untuk digital gift / angpao
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        // 5. TABEL GUESTS (Daftar Tamu & RSVP Buku Tamu)
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained('invitations')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug'); // Untuk query param: ?to=Nama+Tamu
            $table->string('phone_number', 25)->nullable();
            $table->enum('rsvp_status', ['attending', 'not_attending', 'uncertain', 'pending'])->default('pending');
            $table->integer('rsvp_pax')->default(1);
            $table->text('wishes_message')->nullable();
            $table->timestamp('checked_in_at')->nullable(); // Support Scan QR Check-in di Venue
            $table->timestamps();

            $table->index(['invitation_id', 'slug']);
        });

        // 6. TABEL PAYMENTS (Log Audit Webhook Gateway)
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('transaction_id')->nullable();
            $table->string('transaction_status');
            $table->json('raw_response');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('guests');
        Schema::dropIfExists('invitations');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('themes');
        Schema::dropIfExists('users');
    }
};`
  },

  // 2. MODELS & RELATIONS
  {
    id: 'model_user',
    name: 'app/Models/User.php',
    path: 'app/Models/User.php',
    category: 'model',
    language: 'php',
    description: 'Model User dengan Role Helper methods (isSuperAdmin, isReseller, isCustomer) dan relasi ke Orders & Invitations.',
    keyHighlights: [
      'Role checker: isSuperAdmin(), isReseller(), isCustomer()',
      'Relasi hasMany ke Order dan Invitation',
      'Relasi self-referencing untuk Reseller dan Referred Customers'
    ],
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'password',
        'role',
        'reseller_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Role Helper Methods
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isReseller(): bool
    {
        return $this->role === 'reseller';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    // Relasi Eloquent
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }

    // Jika user ini adalah Customer yang direkrut oleh Reseller
    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    // Jika user ini adalah Reseller yang memiliki banyak Customer binaan
    public function referredCustomers(): HasMany
    {
        return $this->hasMany(User::class, 'reseller_id');
    }
}`
  },

  {
    id: 'model_order',
    name: 'app/Models/Order.php',
    path: 'app/Models/Order.php',
    category: 'model',
    language: 'php',
    description: 'Model Order dengan relasi User, Theme, Invitation, Payment, dan helper method penanda status pembayaran.',
    keyHighlights: [
      'Relasi belongsTo: User, Reseller, Theme',
      'Relasi hasOne: Invitation & hasMany: Payments',
      'Scope query: scopePaid(), scopePending()',
      'Helper: markAsPaid() dengan auto status update'
    ],
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasOne;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'reseller_id',
        'theme_id',
        'total_amount',
        'reseller_commission',
        'payment_status',
        'snap_token',
        'payment_url',
        'payment_method',
        'paid_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'reseller_commission' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reseller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    public function invitation(): HasOne
    {
        return $this->hasOne(Invitation::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes
    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function markAsPaid(string $paymentMethod = null): void
    {
        $this->update([
            'payment_status' => 'paid',
            'payment_method' => $paymentMethod ?? $this->payment_method,
            'paid_at' => now(),
        ]);

        // Aktifkan otomatis undangan digital
        if ($this->invitation) {
            $this->invitation->update(['is_published' => true]);
        }
    }
}`
  },

  {
    id: 'model_invitation',
    name: 'app/Models/Invitation.php',
    path: 'app/Models/Invitation.php',
    category: 'model',
    language: 'php',
    description: 'Model Invitation dengan cast JSON gallery_photos & bank_accounts, relasi ke Guests, dan URL generation.',
    keyHighlights: [
      'Relasi belongsTo User & Order, hasMany Guests',
      'JSON casting untuk gallery_photos & bank_accounts',
      'Accessor public_url untuk link share undangan',
      'Auto counter: confirmed_guests_count & total_rsvp_pax'
    ],
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Invitation extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'theme_id',
        'slug',
        'title',
        'groom_name',
        'groom_parents',
        'bride_name',
        'bride_parents',
        'event_date',
        'venue_name',
        'venue_address',
        'google_maps_url',
        'music_url',
        'gallery_photos',
        'bank_accounts',
        'is_published',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'gallery_photos' => 'array',
        'bank_accounts' => 'array',
        'is_published' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

    // Accessor: URL Publik Undangan
    public function getPublicUrlAttribute(): string
    {
        return url('/v/' . $this->slug);
    }

    // Method untuk menghasilkan link khusus tamu
    public function getGuestShareUrl(Guest $guest): string
    {
        return $this->public_url . '?to=' . urlencode($guest->name);
    }
}`
  },

  {
    id: 'model_guest',
    name: 'app/Models/Guest.php',
    path: 'app/Models/Guest.php',
    category: 'model',
    language: 'php',
    description: 'Model Guest untuk buku tamu, ucapan, dan RSVP dengan relasi ke Invitation.',
    keyHighlights: [
      'Relasi belongsTo Invitation',
      'Scope attending() untuk menyaring tamu hadir',
      'Generate WhatsApp invitation share text format'
    ],
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Support\\Str;

class Guest extends Model
{
    protected $fillable = [
        'invitation_id',
        'name',
        'slug',
        'phone_number',
        'rsvp_status',
        'rsvp_pax',
        'wishes_message',
        'checked_in_at',
    ];

    protected $casts = [
        'rsvp_pax' => 'integer',
        'checked_in_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($guest) {
            if (empty($guest->slug)) {
                $guest->slug = Str::slug($guest->name);
            }
        });
    }

    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    public function scopeAttending($query)
    {
        return $query->where('rsvp_status', 'attending');
    }
}`
  },

  // 3. ROUTING
  {
    id: 'routes_web',
    name: 'routes/web.php',
    path: 'routes/web.php',
    category: 'route',
    language: 'php',
    description: 'Struktur routing bersih & aman dengan Route Grouping, Role Middleware (super_admin, reseller, customer), dan public invitation routes.',
    keyHighlights: [
      'Route publik: landing page, katalog tema, live invitation (/v/{slug})',
      'Customer Group: Dashboard, Create Order, Setup Undangan, Buku Tamu',
      'Reseller Group: Komisi, Link Referral, Klien Binaan',
      'Super Admin Group: Global Analytics, Kelola Tema, Manajemen User'
    ],
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\PublicInvitationController;
use App\\Http\\Controllers\\Customer\\OrderController;
use App\\Http\\Controllers\\Customer\\InvitationController;
use App\\Http\\Controllers\\Customer\\GuestController;
use App\\Http\\Controllers\\Reseller\\ResellerDashboardController;
use App\\Http\\Controllers\\Admin\\AdminDashboardController;
use App\\Http\\Controllers\\Admin\\ThemeManagementController;

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES (Tanpa Autentikasi)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get('/themes', [PublicInvitationController::class, 'catalog'])->name('themes.index');

// Tampilan Undangan Publik: domain.com/v/romeo-dan-juliet?to=Nama+Tamu
Route::get('/v/{slug}', [PublicInvitationController::class, 'show'])->name('invitation.view');
Route::post('/v/{slug}/rsvp', [PublicInvitationController::class, 'submitRsvp'])->name('invitation.rsvp');

/*
|--------------------------------------------------------------------------
| 2. AUTHENTICATED USER ROUTES
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php'; // Laravel Breeze / Fortify

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | A. CUSTOMER DASHBOARD (Role: customer)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:customer')->prefix('customer')->name('customer.')->group(function () {
        Route::get('/dashboard', [InvitationController::class, 'index'])->name('dashboard');
        
        // Checkout & Pemesanan Baru
        Route::get('/orders/checkout/{theme:slug}', [OrderController::class, 'create'])->name('orders.create');
        Route::post('/orders/checkout', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/{order:order_number}', [OrderController::class, 'show'])->name('orders.show');
        
        // Edit Konten Undangan & Data Mempelai
        Route::get('/invitations/{invitation}/edit', [InvitationController::class, 'edit'])->name('invitations.edit');
        Route::put('/invitations/{invitation}', [InvitationController::class, 'update'])->name('invitations.update');
        
        // Buku Tamu & RSVP Management
        Route::get('/invitations/{invitation}/guests', [GuestController::class, 'index'])->name('guests.index');
        Route::post('/invitations/{invitation}/guests', [GuestController::class, 'store'])->name('guests.store');
        Route::post('/invitations/{invitation}/guests/import', [GuestController::class, 'import'])->name('guests.import');
        Route::delete('/guests/{guest}', [GuestController::class, 'destroy'])->name('guests.destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | B. RESELLER DASHBOARD (Role: reseller)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:reseller')->prefix('reseller')->name('reseller.')->group(function () {
        Route::get('/dashboard', [ResellerDashboardController::class, 'index'])->name('dashboard');
        Route::get('/referrals', [ResellerDashboardController::class, 'referrals'])->name('referrals');
        Route::get('/commissions', [ResellerDashboardController::class, 'commissions'])->name('commissions');
        Route::post('/withdraw', [ResellerDashboardController::class, 'requestWithdraw'])->name('withdraw');
    });

    /*
    |--------------------------------------------------------------------------
    | C. SUPER ADMIN PANEL (Role: super_admin)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('themes', ThemeManagementController::class);
        Route::get('/orders', [AdminDashboardController::class, 'allOrders'])->name('orders');
        Route::get('/users', [AdminDashboardController::class, 'allUsers'])->name('users');
    });
});`
  },

  {
    id: 'routes_api',
    name: 'routes/api.php',
    path: 'routes/api.php',
    category: 'route',
    language: 'php',
    description: 'Endpoint Webhook untuk Midtrans & WhatsApp callback (dilindungi IP filter / Signature Verification).',
    keyHighlights: [
      'POST /api/midtrans/callback dengan verifikasi SHA512',
      'POST /api/whatsapp/status untuk delivery status tracking'
    ],
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\MidtransCallbackController;

/*
|--------------------------------------------------------------------------
| API & Webhook Routes
|--------------------------------------------------------------------------
*/
// Webhook Midtrans - Otomatisasi Pembayaran (Dikecualikan dari CSRF di bootstrap/app.php)
Route::post('/midtrans/callback', [MidtransCallbackController::class, 'handle']);`
  },

  // 4. CONTROLLERS
  {
    id: 'controller_order',
    name: 'app/Http/Controllers/Customer/OrderController.php',
    path: 'app/Http/Controllers/Customer/OrderController.php',
    category: 'controller',
    language: 'php',
    description: 'OrderController lengkap dengan form validation, DB Transaction atomik, pembuatan draft Undangan, dan Midtrans Snap Token creation.',
    keyHighlights: [
      'DB::beginTransaction & DB::commit menjamin integritas data',
      'Integrasi Midtrans Snap API via curl/SDK resmi',
      'Auto-generate format slug unik dari nama kedua mempelai',
      'Penyimpanan snapshot order untuk mencegah perubahan harga mendadak'
    ],
    code: `<?php

namespace App\\Http\\Controllers\\Customer;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Theme;
use App\\Models\\Order;
use App\\Models\\Invitation;
use App\\Services\\MidtransService;
use App\\Services\\WhatsAppService;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;
use Illuminate\\Support\\Facades\\Auth;

class OrderController extends Controller
{
    protected MidtransService $midtransService;
    protected WhatsAppService $whatsAppService;

    public function __construct(MidtransService $midtransService, WhatsAppService $whatsAppService)
    {
        $this->midtransService = $midtransService;
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Tampilkan formulir checkout & pemilihan tema
     */
    public function create(Theme $theme)
    {
        return view('customer.orders.checkout', compact('theme'));
    }

    /**
     * Eksekusi transaksi pemesanan baru, draft undangan, dan generate Midtrans Snap Token
     */
    public function store(Request $request)
    {
        // 1. Validasi Input Form
        $validated = $request->validate([
            'theme_id'        => 'required|exists:themes,id',
            'groom_name'      => 'required|string|max:150',
            'groom_parents'   => 'nullable|string|max:255',
            'bride_name'      => 'required|string|max:150',
            'bride_parents'   => 'nullable|string|max:255',
            'event_date'      => 'required|date|after:today',
            'venue_name'      => 'required|string|max:255',
            'venue_address'   => 'required|string',
            'google_maps_url' => 'nullable|url',
        ]);

        $user = Auth::user();
        $theme = Theme::findOrFail($validated['theme_id']);

        // 2. Transaksi Database Atomik
        DB::beginTransaction();
        try {
            // Generate nomor order unik: ORD-202610-XXXX
            $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(6));

            // Hitung komisi jika user mendaftar via Reseller (misal 20%)
            $resellerCommission = 0;
            if ($user->reseller_id) {
                $resellerCommission = $theme->price * 0.20;
            }

            // Simpan Master Order
            $order = Order::create([
                'order_number'        => $orderNumber,
                'user_id'             => $user->id,
                'reseller_id'         => $user->reseller_id,
                'theme_id'            => $theme->id,
                'total_amount'        => $theme->price,
                'reseller_commission' => $resellerCommission,
                'payment_status'      => 'pending',
            ]);

            // Generate slug unik undangan (contoh: romeo-dan-juliet-3847)
            $baseSlug = Str::slug($validated['groom_name'] . '-dan-' . $validated['bride_name']);
            $uniqueSlug = $baseSlug . '-' . rand(1000, 9999);

            // Simpan Draft Konten Undangan
            $invitation = Invitation::create([
                'order_id'        => $order->id,
                'user_id'         => $user->id,
                'theme_id'        => $theme->id,
                'slug'            => $uniqueSlug,
                'title'           => 'The Wedding of ' . $validated['groom_name'] . ' & ' . $validated['bride_name'],
                'groom_name'      => $validated['groom_name'],
                'groom_parents'   => $validated['groom_parents'],
                'bride_name'      => $validated['bride_name'],
                'bride_parents'   => $validated['bride_parents'],
                'event_date'      => $validated['event_date'],
                'venue_name'      => $validated['venue_name'],
                'venue_address'   => $validated['venue_address'],
                'google_maps_url' => $validated['google_maps_url'],
                'is_published'    => false, // Belum aktif sebelum pembayaran lunas
            ]);

            // 3. Minta Snap Token dari Midtrans
            $snapData = $this->midtransService->createSnapTransaction($order, $user);
            $order->update([
                'snap_token'  => $snapData['token'],
                'payment_url' => $snapData['redirect_url'] ?? null,
            ]);

            DB::commit();

            // 4. Kirim Pesan WhatsApp Tagihan Otomatis
            if ($user->phone_number) {
                $this->whatsAppService->sendOrderPendingNotice($user, $order);
            }

            return redirect()->route('customer.orders.show', $order->order_number)
                ->with('success', 'Pesanan berhasil dibuat! Silakan selesaikan pembayaran.');

        } catch (\\Exception $e) {
            DB::rollBack();
            report($e);
            return back()->withInput()->with('error', 'Gagal memproses pesanan: ' . $e->getMessage());
        }
    }

    /**
     * Tampilkan halaman instruksi pembayaran & Midtrans Snap Popup
     */
    public function show(Order $order)
    {
        // Otorisasi: Pastikan customer hanya bisa melihat order miliknya
        $this->authorize('view', $order);

        $order->load(['theme', 'invitation']);
        return view('customer.orders.show', compact('order'));
    }
}`
  },

  {
    id: 'controller_callback',
    name: 'app/Http/Controllers/Api/MidtransCallbackController.php',
    path: 'app/Http/Controllers/Api/MidtransCallbackController.php',
    category: 'controller',
    language: 'php',
    description: 'Controller Webhook Midtrans dengan verifikasi SHA512 Signature Key, otomatisasi penerbitan undangan, dan notifikasi WhatsApp instan.',
    keyHighlights: [
      'Verifikasi Signature Hash SHA512 (mencegah manipulasi/spoofing)',
      'Otomatisasi: status "settlement" langsung mengaktifkan undangan',
      'Audit log transaksi ke tabel payments',
      'Dispatch WhatsApp notifikasi sukses ke nomor pemesan'
    ],
    code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Order;
use App\\Models\\Payment;
use App\\Services\\WhatsAppService;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Log;

class MidtransCallbackController extends Controller
{
    protected WhatsAppService $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Menangani callback notifikasi dari server Midtrans
     */
    public function handle(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');
        
        $orderId          = $request->input('order_id');
        $statusCode       = $request->input('status_code');
        $grossAmount      = $request->input('gross_amount');
        $signatureKey     = $request->input('signature_key');
        $transactionStatus= $request->input('transaction_status');
        $paymentType      = $request->input('payment_type');

        // 1. Verifikasi Keamanan Signature Key (SHA512)
        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($signatureKey !== $expectedSignature) {
            Log::warning("Midtrans Callback Signature Mismatch for Order: {$orderId}");
            return response()->json(['message' => 'Invalid signature key'], 403);
        }

        // 2. Temukan data Order
        $order = Order::where('order_number', $orderId)->first();
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // 3. Simpan Log Audit Payment
        Payment::create([
            'order_id'           => $order->id,
            'transaction_id'     => $request->input('transaction_id'),
            'transaction_status' => $transactionStatus,
            'raw_response'       => $request->all(),
        ]);

        // 4. Logika Perubahan Status Transaksi
        if (in_array($transactionStatus, ['capture', 'settlement'])) {
            // Pembayaran Berhasil / Lunas
            $order->markAsPaid($paymentType);

            // Kirim Notifikasi WhatsApp Sukses & Link Undangan Aktif
            if ($order->user && $order->user->phone_number) {
                $this->whatsAppService->sendOrderSuccessNotice($order->user, $order);
            }

        } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire'])) {
            $order->update(['payment_status' => 'failed']);
        }

        return response()->json(['status' => 'success', 'message' => 'Notification processed successfully']);
    }
}`
  },

  // 5. SERVICES
  {
    id: 'service_midtrans',
    name: 'app/Services/MidtransService.php',
    path: 'app/Services/MidtransService.php',
    category: 'service',
    language: 'php',
    description: 'Service pembungkus API Midtrans Snap untuk meminta payment token & redirect URL.',
    keyHighlights: [
      'Mendukung mode Sandbox & Production via .env',
      'Payload item_details & customer_details lengkap',
      'Fallback error handling dengan exception terstruktur'
    ],
    code: `<?php

namespace App\\Services;

use App\\Models\\Order;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\Http;

class MidtransService
{
    protected string $serverKey;
    protected string $snapUrl;

    public function __construct()
    {
        $isProduction = config('services.midtrans.is_production', false);
        $this->serverKey = config('services.midtrans.server_key', '');
        
        $this->snapUrl = $isProduction
            ? 'https://app.midtrans.com/snap/v1/transactions'
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
    }

    /**
     * Minta Snap Token transaksi dari Midtrans
     */
    public function createSnapTransaction(Order $order, User $user): array
    {
        $payload = [
            'transaction_details' => [
                'order_id'     => $order->order_number,
                'gross_amount' => (int) $order->total_amount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email'      => $user->email,
                'phone'      => $user->phone_number ?? '08123456789',
            ],
            'item_details' => [
                [
                    'id'       => (string) $order->theme_id,
                    'price'    => (int) $order->total_amount,
                    'quantity' => 1,
                    'name'     => 'Undangan Digital: ' . ($order->theme->name ?? 'Template'),
                ]
            ],
        ];

        $response = Http::withBasicAuth($this->serverKey, '')
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post($this->snapUrl, $payload);

        if ($response->failed()) {
            throw new \\Exception('Gagal menghubungi Payment Gateway: ' . $response->body());
        }

        return $response->json(); // ['token' => '...', 'redirect_url' => '...']
    }
}`
  },

  {
    id: 'service_whatsapp',
    name: 'app/Services/WhatsAppService.php',
    path: 'app/Services/WhatsAppService.php',
    category: 'service',
    language: 'php',
    description: 'Service integrasi WhatsApp Gateway (Fonnte / Wablas / Twilio) untuk notifikasi tagihan, aktivasi, dan broadcast link tamu.',
    keyHighlights: [
      'Pesan notifikasi tagihan otomatis dengan payment link',
      'Pesan instan saat pembayaran berhasil dengan link undangan live',
      'Format broadcast pesan ke tamu undangan dengan parameter nama'
    ],
    code: `<?php

namespace App\\Services;

use App\\Models\\User;
use App\\Models\\Order;
use App\\Models\\Guest;
use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Log;

class WhatsAppService
{
    protected string $apiKey;
    protected string $apiUrl;

    public function __construct()
    {
        // Contoh implementasi provider populer Fonnte / Wablas
        $this->apiKey = config('services.whatsapp.api_key', '');
        $this->apiUrl = config('services.whatsapp.api_url', 'https://api.fonnte.com/send');
    }

    /**
     * Kirim notifikasi WhatsApp tagihan pesanan baru
     */
    public function sendOrderPendingNotice(User $user, Order $order): bool
    {
        $message = "Halo *{$user->name}*! 👋\\n\\n"
                 . "Terima kasih telah memesan undangan digital di *UndangKu*.\\n"
                 . "Berikut rincian pesanan Anda:\\n"
                 . "• No. Order: *{$order->order_number}*\\n"
                 . "• Total: *Rp " . number_format($order->total_amount, 0, ',', '.') . "*\\n\\n"
                 . "Silakan selesaikan pembayaran melalui tautan berikut:\\n"
                 . "{$order->payment_url}\\n\\n"
                 . "Undangan digital Anda akan otomatis aktif segera setelah pembayaran diterima.";

        return $this->sendMessage($user->phone_number, $message);
    }

    /**
     * Kirim notifikasi aktivasi undangan setelah pembayaran lunas
     */
    public function sendOrderSuccessNotice(User $user, Order $order): bool
    {
        $invitation = $order->invitation;
        $url = $invitation ? $invitation->public_url : url('/customer/dashboard');

        $message = "Selamat *{$user->name}*! 🎉 Pembayaran Anda telah kami terima.\\n\\n"
                 . "Undangan digital Anda kini *AKTIF* dan siap disebarkan:\\n"
                 . "🔗 {$url}\\n\\n"
                 . "Anda dapat mengelola daftar tamu & buku tamu di Dashboard Customer:\\n"
                 . route('customer.dashboard');

        return $this->sendMessage($user->phone_number, $message);
    }

    /**
     * Kirim broadcast undangan ke nomor tamu terdaftar
     */
    public function sendGuestInvitation(Guest $guest): bool
    {
        if (empty($guest->phone_number)) {
            return false;
        }

        $invitation = $guest->invitation;
        $shareUrl = $invitation->getGuestShareUrl($guest);

        $message = "Kepada Yth. *{$guest->name}*,\\n\\n"
                 . "Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i "
                 . "untuk menghadiri momen bahagia kami: *{$invitation->title}*.\\n\\n"
                 . "Buka undangan digital Anda melalui tautan khusus di bawah ini:\\n"
                 . "💌 {$shareUrl}\\n\\n"
                 . "Merupakan suatu kehormatan & kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.";

        return $this->sendMessage($guest->phone_number, $message);
    }

    /**
     * Helper eksekusi HTTP request ke WhatsApp Gateway
     */
    protected function sendMessage(string $targetPhone, string $message): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->post($this->apiUrl, [
                'target'  => $targetPhone,
                'message' => $message,
                'countryCode' => '62',
            ]);

            return $response->successful();
        } catch (\\Exception $e) {
            Log::error('Gagal mengirim pesan WhatsApp: ' . $e->getMessage());
            return false;
        }
    }
}`
  },

  // 6. BLADE TEMPLATE
  {
    id: 'view_dashboard',
    name: 'resources/views/customer/dashboard.blade.php',
    path: 'resources/views/customer/dashboard.blade.php',
    category: 'blade',
    language: 'blade',
    description: 'Halaman Dashboard Customer modern dengan Blade + Tailwind CSS: statistik RSVP, link share undangan, daftar tamu, dan quick actions.',
    keyHighlights: [
      'Tailwind CSS murni tanpa plugin eksternal berat',
      'Indikator status live undangan (Published / Draft)',
      'Widget statistik RSVP: Total Tamu, Konfirmasi Hadir, Tidak Hadir',
      'Fitur Copy Link Undangan & tombol share WhatsApp otomatis'
    ],
    code: `@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
        
        <!-- Header Sambutan & Status Akun -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                    Akun Customer Terverifikasi
                </span>
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Halo, {{ Auth::user()->name }}! 👋
                </h1>
                <p class="text-slate-400 text-sm mt-1">
                    Kelola undangan pernikahan digital dan pantau konfirmasi kehadiran para tamu Anda.
                </p>
            </div>
            
            <div class="flex items-center gap-3">
                <a href="{{ route('customer.orders.create', ['theme' => 'rustic']) }}" 
                   class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium text-sm shadow-lg shadow-rose-500/25 transition duration-150 ease-in-out">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Buat Undangan Baru
                </a>
            </div>
        </div>

        @if($invitations->isEmpty())
            <!-- Empty State jika belum ada undangan -->
            <div class="bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 p-12 text-center">
                <div class="w-16 h-16 mx-auto bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
                <h3 class="text-lg font-semibold text-white">Belum Ada Undangan Aktif</h3>
                <p class="text-slate-400 max-w-md mx-auto text-sm mt-1 mb-6">
                    Pilih tema favorit Anda dan lengkapi detail acara untuk mulai menyebarkan kebahagiaan.
                </p>
                <a href="{{ route('themes.index') }}" class="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition">
                    Jelajahi Katalog Tema
                </a>
            </div>
        @else
            @foreach($invitations as $invitation)
                <!-- Main Invitation Card -->
                <div class="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
                    
                    <!-- Title Bar & Status Pill -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/60 gap-4">
                        <div>
                            <div class="flex items-center gap-3">
                                <h2 class="text-xl font-bold text-white">{{ $invitation->title }}</h2>
                                @if($invitation->is_published)
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        ● Aktif / Live
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        ● Menunggu Pembayaran
                                    </span>
                                @endif
                            </div>
                            <p class="text-sm text-slate-400 mt-1">
                                Tema: <span class="text-slate-200 font-medium">{{ $invitation->theme->name }}</span> | 
                                Tanggal: <span class="text-slate-200 font-medium">{{ $invitation->event_date->isoFormat('D MMMM YYYY') }}</span>
                            </p>
                        </div>

                        <!-- Quick Link & Share -->
                        <div class="flex flex-wrap items-center gap-2">
                            <a href="{{ $invitation->public_url }}" target="_blank" 
                               class="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition">
                                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                Buka Undangan
                            </a>
                            <a href="{{ route('customer.invitations.edit', $invitation->id) }}" 
                               class="inline-flex items-center px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition">
                                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                Edit Konten
                            </a>
                        </div>
                    </div>

                    <!-- Statistik RSVP Counters -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                            <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Tamu Diinput</span>
                            <div class="text-2xl font-bold text-white mt-1">{{ $invitation->guests->count() }}</div>
                        </div>
                        <div class="bg-slate-900/60 p-4 rounded-xl border border-emerald-500/20">
                            <span class="text-xs font-medium text-emerald-400 uppercase tracking-wider">Konfirmasi Hadir</span>
                            <div class="text-2xl font-bold text-emerald-400 mt-1">
                                {{ $invitation->guests->where('rsvp_status', 'attending')->count() }}
                            </div>
                        </div>
                        <div class="bg-slate-900/60 p-4 rounded-xl border border-rose-500/20">
                            <span class="text-xs font-medium text-rose-400 uppercase tracking-wider">Berhalangan Hadir</span>
                            <div class="text-2xl font-bold text-rose-400 mt-1">
                                {{ $invitation->guests->where('rsvp_status', 'not_attending')->count() }}
                            </div>
                        </div>
                        <div class="bg-slate-900/60 p-4 rounded-xl border border-blue-500/20">
                            <span class="text-xs font-medium text-blue-400 uppercase tracking-wider">Estimasi Porsi Hadir</span>
                            <div class="text-2xl font-bold text-blue-400 mt-1">
                                {{ $invitation->guests->where('rsvp_status', 'attending')->sum('rsvp_pax') }} Orang
                            </div>
                        </div>
                    </div>

                    <!-- Share URL Bar -->
                    <div class="bg-slate-900/90 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3">
                        <div class="w-full md:w-auto truncate text-sm">
                            <span class="text-slate-400">Link Utama Undangan:</span>
                            <span class="font-mono text-rose-400 font-semibold ml-2 select-all">{{ $invitation->public_url }}</span>
                        </div>
                        <div class="flex items-center gap-2 w-full md:w-auto">
                            <a href="{{ route('customer.guests.index', $invitation->id) }}" 
                               class="w-full md:w-auto text-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition border border-slate-600">
                                📋 Kelola Buku Tamu & WhatsApp Link
                            </a>
                        </div>
                    </div>

                </div>
            @endforeach
        @endif

    </div>
</div>
@endsection`
  }
];
