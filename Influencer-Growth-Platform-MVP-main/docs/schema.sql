-- Influencer Network Database Schema
-- Compatible with Supabase (PostgreSQL)
-- Generated for the cyber-style influencer platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    level INTEGER DEFAULT 1 CHECK (level BETWEEN 1 AND 6),
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    referred_by VARCHAR(50) REFERENCES users(referral_code),
    total_balance DECIMAL(12, 2) DEFAULT 0,
    task_earnings DECIMAL(12, 2) DEFAULT 0,
    referral_earnings DECIMAL(12, 2) DEFAULT 0,
    referral_count INTEGER DEFAULT 0,
    referral_bonus_rate DECIMAL(5, 2) DEFAULT 5.00,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'banned')),
    kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(20) DEFAULT 'not_submitted' CHECK (kyc_status IN ('not_submitted', 'pending', 'approved', 'rejected')),
    avatar_url TEXT,
    used_passcode VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC Documents table
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    id_type VARCHAR(50) NOT NULL CHECK (id_type IN ('national_id', 'drivers_license', 'passport', 'voters_card', 'residence_permit')),
    id_number VARCHAR(100) NOT NULL,
    document_front_url TEXT,
    document_back_url TEXT,
    selfie_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Passcodes table
CREATE TABLE passcodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 6),
    used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id)
);

-- Tasks table (global task definitions)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'twitter', 'snapchat', 'facebook', 'telegram', 'whatsapp', 'custom')),
    title VARCHAR(255) NOT NULL,
    reward DECIMAL(10, 2) NOT NULL,
    link TEXT NOT NULL,
    instructions TEXT NOT NULL,
    target_level INTEGER CHECK (target_level BETWEEN 1 AND 6),
    target_user_id UUID REFERENCES users(id),
    is_broadcast BOOLEAN DEFAULT FALSE,
    is_custom BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- User Tasks (assigned tasks to users)
CREATE TABLE user_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'completed', 'rejected')),
    submitted_handle VARCHAR(255),
    submitted_proof_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id, user_id)
);

-- Withdrawals table
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    method VARCHAR(50) NOT NULL CHECK (method IN ('bank', 'crypto', 'mobile_money')),
    details JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membership Tiers reference table
CREATE TABLE membership_tiers (
    level INTEGER PRIMARY KEY CHECK (level BETWEEN 1 AND 6),
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    task_reward_min DECIMAL(10, 2) NOT NULL,
    task_reward_max DECIMAL(10, 2) NOT NULL,
    referral_bonus_percent DECIMAL(5, 2) NOT NULL,
    referrals_required INTEGER NOT NULL,
    features JSONB NOT NULL,
    color VARCHAR(50) NOT NULL
);

-- Insert default membership tiers
INSERT INTO membership_tiers (level, name, price, task_reward_min, task_reward_max, referral_bonus_percent, referrals_required, features, color) VALUES
(1, 'Starter', 5, 0.20, 0.50, 5, 5, '["5 referrals required", "Basic tasks", "5% referral bonus", "Standard support"]', 'zinc'),
(2, 'Bronze', 10, 0.50, 1.00, 7, 8, '["8 referrals required", "More tasks", "7% referral bonus", "Priority support"]', 'amber'),
(3, 'Silver', 20, 1.00, 2.00, 10, 10, '["10 referrals required", "Premium tasks", "10% referral bonus", "Weekly bonuses"]', 'slate'),
(4, 'Gold', 50, 2.00, 5.00, 12, 15, '["15 referrals required", "VIP tasks", "12% referral bonus", "Daily bonuses"]', 'yellow'),
(5, 'Platinum', 100, 5.00, 10.00, 15, 20, '["20 referrals required", "Elite tasks", "15% referral bonus", "24/7 support"]', 'cyan'),
(6, 'Diamond', 200, 10.00, 25.00, 20, 30, '["30 referrals required", "Exclusive tasks", "20% referral bonus", "Brand partnerships"]', 'purple');

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_passcodes_code ON passcodes(code);
CREATE INDEX idx_passcodes_used ON passcodes(used);
CREATE INDEX idx_tasks_platform ON tasks(platform);
CREATE INDEX idx_tasks_target_level ON tasks(target_level);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_status ON user_tasks(status);
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE passcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins can do anything with users" ON users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Users can read their own KYC documents
CREATE POLICY "Users can read own KYC" ON kyc_documents
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own KYC documents
CREATE POLICY "Users can insert own KYC" ON kyc_documents
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can manage all KYC documents
CREATE POLICY "Admins can manage all KYC" ON kyc_documents
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Users can read their assigned tasks
CREATE POLICY "Users can read own tasks" ON user_tasks
    FOR SELECT USING (user_id = auth.uid());

-- Users can update their own task submissions
CREATE POLICY "Users can update own task submissions" ON user_tasks
    FOR UPDATE USING (user_id = auth.uid());

-- Users can read their own withdrawals
CREATE POLICY "Users can read own withdrawals" ON withdrawals
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert withdrawal requests
CREATE POLICY "Users can request withdrawals" ON withdrawals
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can manage all data
CREATE POLICY "Admins can manage tasks" ON tasks
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage user_tasks" ON user_tasks
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage withdrawals" ON withdrawals
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage passcodes" ON passcodes
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
