-- Nikahku PostgreSQL schema
-- Apply once to a new PostgreSQL database. Never store plaintext passwords or payment secrets.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer'
    CHECK (role IN ('admin', 'reseller', 'customer')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reseller_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00
    CHECK (commission_rate >= 0 AND commission_rate <= 100),
  payout_account_name TEXT,
  payout_account_number TEXT,
  payout_provider TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invitation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'wedding',
  thumbnail_url TEXT,
  canva_template_url TEXT NOT NULL,
  base_price_idr BIGINT NOT NULL DEFAULT 0 CHECK (base_price_idr >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES invitation_templates(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  partner_one_name TEXT,
  partner_two_name TEXT,
  event_date TIMESTAMPTZ,
  venue_name TEXT,
  venue_address TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  buyer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  invitation_id UUID REFERENCES invitations(id) ON DELETE SET NULL,
  template_id UUID REFERENCES invitation_templates(id) ON DELETE SET NULL,
  reseller_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  subtotal_idr BIGINT NOT NULL CHECK (subtotal_idr >= 0),
  discount_idr BIGINT NOT NULL DEFAULT 0 CHECK (discount_idr >= 0),
  total_idr BIGINT NOT NULL CHECK (total_idr >= 0),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'awaiting_payment', 'paid', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_provider TEXT,
  payment_reference TEXT UNIQUE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (total_idr = subtotal_idr - discount_idr)
);

CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  amount_idr BIGINT NOT NULL CHECK (amount_idr >= 0),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'paid', 'reversed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guestbook_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  attendance TEXT NOT NULL DEFAULT 'unknown'
    CHECK (attendance IN ('yes', 'no', 'maybe', 'unknown')),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);

CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);
CREATE INDEX IF NOT EXISTS idx_templates_active_category ON invitation_templates(is_active, category);
CREATE INDEX IF NOT EXISTS idx_invitations_owner_created ON invitations(owner_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invitations_public_slug_status ON invitations(slug, status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_created ON orders(buyer_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_reseller_created ON orders(reseller_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commissions_reseller_status ON commissions(reseller_user_id, status);
CREATE INDEX IF NOT EXISTS idx_guestbook_invitation_created ON guestbook_messages(invitation_id, created_at DESC);
