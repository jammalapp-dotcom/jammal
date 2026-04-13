-- Jammal App - Initial Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- Enable PostGIS extension for geography coordinates
create extension if not exists "postgis";

-- 1. Users Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  role text not null check (role in ('customer', 'driver', 'broker', 'manager')),
  name text not null,
  name_ar text,
  phone text unique not null,
  email text,
  company text,
  company_ar text,
  wallet_balance integer default 0,
  rating numeric(3, 2) default 5.0,
  verified boolean default false,
  -- Driver specific
  vehicle_type text,
  vehicle_plate text,
  is_online boolean default false,
  current_location geography(Point, 4326),
  completed_trips integer default 0,
  -- Broker specific
  fleet_size integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Protect Users table with Row Level Security (RLS)
alter table public.users enable row level security;
-- Example Policy: Users can read all other users (for driver names etc), but only update themselves.
create policy "Users can view all users" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- 2. Shipments Table
create table public.shipments (
  id uuid default uuid_generate_v4() primary key,
  short_id text unique not null, -- e.g. SH-2024-001
  customer_id uuid references public.users(id) not null,
  driver_id uuid references public.users(id),
  
  pickup_city text not null,
  pickup_address text not null,
  delivery_city text not null,
  delivery_address text not null,
  
  cargo_category text not null,
  cargo_category_ar text not null,
  weight integer not null,
  description text,
  description_ar text,
  vehicle_type text not null,
  
  status text not null check (status in ('searching', 'assigned', 'pickup', 'en_route', 'delivered', 'cancelled')),
  pricing_mode text not null check (pricing_mode in ('bidding', 'instant')),
  
  estimated_price integer not null,
  final_price integer,
  distance integer not null,
  estimated_duration text,
  
  payment_status text default 'pending',
  tracking_progress numeric(3, 2) default 0,
  
  pickup_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shipments enable row level security;
create policy "Anyone can view searching shipments" on public.shipments for select using (status = 'searching');
create policy "Users can view related shipments" on public.shipments for select using (auth.uid() = customer_id or auth.uid() = driver_id);
create policy "Customers can insert their own shipments" on public.shipments for insert with check (auth.uid() = customer_id);

-- 3. Bids Table (For the bidding flow)
create table public.bids (
  id uuid default uuid_generate_v4() primary key,
  shipment_id uuid references public.shipments(id) on delete cascade not null,
  driver_id uuid references public.users(id) not null,
  amount integer not null,
  message text,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bids enable row level security;
create policy "Users can view related bids" on public.bids for select using (
  auth.uid() = driver_id or 
  auth.uid() in (select customer_id from public.shipments where id = shipment_id)
);

-- 4. Chat Messages Table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  shipment_id uuid references public.shipments(id) on delete cascade not null,
  sender_id uuid references public.users(id) not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;
create policy "Users can view and send messages for their shipments" on public.messages for all using (
  auth.uid() in (select customer_id from public.shipments where id = shipment_id) or
  auth.uid() in (select driver_id from public.shipments where id = shipment_id)
);
