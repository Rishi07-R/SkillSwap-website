-- ==============================================================================
-- SkillSwap Database Schema (PostgreSQL for Supabase)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  avatar_url text,
  headline text,
  bio text,
  location text default 'Remote',
  timezone text default 'UTC',
  availability text default 'Flexible',
  rating numeric(3,2) default 5.00 check (rating >= 1.00 and rating <= 5.00),
  reviews_count integer default 0 check (reviews_count >= 0),
  exchanges_completed integer default 0 check (exchanges_completed >= 0),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 2. SKILLS DIRECTORY TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text not null,
  description text,
  icon_name text default 'Sparkles',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. USER SKILLS (Offered and Wanted)
-- ------------------------------------------------------------------------------
create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  skill_type text not null check (skill_type in ('offered', 'wanted')),
  proficiency_level text not null default 'Intermediate' check (proficiency_level in ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  years_of_experience integer default 1 check (years_of_experience >= 0),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_skill_unique unique (user_id, skill_id, skill_type)
);

-- ------------------------------------------------------------------------------
-- 4. EXCHANGE REQUESTS
-- ------------------------------------------------------------------------------
create table if not exists public.exchange_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  sender_offered_skill_id uuid not null references public.skills(id) on delete restrict,
  sender_wanted_skill_id uuid not null references public.skills(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint different_users_check check (sender_id <> receiver_id)
);

-- ------------------------------------------------------------------------------
-- 5. ACTIVE & COMPLETED EXCHANGES (SESSIONS)
-- ------------------------------------------------------------------------------
create table if not exists public.exchanges (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.exchange_requests(id) on delete set null,
  user_a_id uuid not null references public.profiles(id) on delete cascade,
  user_b_id uuid not null references public.profiles(id) on delete cascade,
  user_a_skill_id uuid not null references public.skills(id) on delete restrict,
  user_b_skill_id uuid not null references public.skills(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  meeting_link text,
  schedule_details text,
  shared_notes text,
  user_a_completed boolean default false,
  user_b_completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint different_exchange_participants check (user_a_id <> user_b_id)
);

-- ------------------------------------------------------------------------------
-- 6. REVIEWS & RATINGS
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  exchange_id uuid not null references public.exchanges(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_reviewer_per_exchange unique (exchange_id, reviewer_id),
  constraint reviewer_not_reviewee check (reviewer_id <> reviewee_id)
);

-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- ------------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'general' check (type in ('request_received', 'request_accepted', 'request_rejected', 'exchange_update', 'review_received', 'general')),
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
create index if not exists idx_profiles_rating on public.profiles (rating desc);
create index if not exists idx_user_skills_user_id on public.user_skills (user_id);
create index if not exists idx_user_skills_skill_id on public.user_skills (skill_id);
create index if not exists idx_user_skills_type on public.user_skills (skill_type);
create index if not exists idx_requests_receiver on public.exchange_requests (receiver_id, status);
create index if not exists idx_requests_sender on public.exchange_requests (sender_id, status);
create index if not exists idx_exchanges_participants on public.exchanges (user_a_id, user_b_id, status);
create index if not exists idx_reviews_reviewee on public.reviews (reviewee_id);
create index if not exists idx_notifications_user on public.notifications (user_id, is_read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.exchange_requests enable row level security;
alter table public.exchanges enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

-- PROFILES:
-- Public can read any profile
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- SKILLS:
-- Public can view skills directory
create policy "Skills are viewable by everyone"
  on public.skills for select
  using (true);

-- Authenticated users can insert new skills into directory
create policy "Authenticated users can create skills"
  on public.skills for insert
  to authenticated
  with check (true);

-- USER SKILLS:
-- Public can view all user skills
create policy "User skills are viewable by everyone"
  on public.user_skills for select
  using (true);

-- Users can insert their own skills
create policy "Users can insert their own skills"
  on public.user_skills for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own skills
create policy "Users can update their own skills"
  on public.user_skills for update
  to authenticated
  using (auth.uid() = user_id);

-- Users can delete their own skills
create policy "Users can delete their own skills"
  on public.user_skills for delete
  to authenticated
  using (auth.uid() = user_id);

-- EXCHANGE REQUESTS:
-- Users can see requests where they are sender or receiver
create policy "Users can view their own requests"
  on public.exchange_requests for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Users can create a request where they are the sender
create policy "Users can create requests"
  on public.exchange_requests for insert
  to authenticated
  with check (auth.uid() = sender_id and sender_id <> receiver_id);

-- Both sender and receiver can update request status (accept, reject, cancel)
create policy "Participants can update their requests"
  on public.exchange_requests for update
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- EXCHANGES:
-- Only participants can view their exchange
create policy "Participants can view their exchanges"
  on public.exchanges for select
  to authenticated
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- Participants or trigger can insert exchanges
create policy "Participants can create exchange"
  on public.exchanges for insert
  to authenticated
  with check (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- Participants can update their exchange (notes, completion, schedule)
create policy "Participants can update their exchanges"
  on public.exchanges for update
  to authenticated
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- REVIEWS:
-- Reviews are publicly viewable
create policy "Reviews are publicly viewable"
  on public.reviews for select
  using (true);

-- Only participant in completed exchange can write review
create policy "Eligible participants can write reviews"
  on public.reviews for insert
  to authenticated
  with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from public.exchanges e
      where e.id = exchange_id
      and (e.user_a_id = auth.uid() or e.user_b_id = auth.uid())
      and e.status = 'completed'
    )
  );

-- NOTIFICATIONS:
-- Users can only see and update their own notifications
create policy "Users can view own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC FUNCTIONS AND TRIGGERS
-- ==============================================================================

-- 1. Trigger to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_exchange_requests_updated_at
  before update on public.exchange_requests
  for each row execute function public.handle_updated_at();

create trigger set_exchanges_updated_at
  before update on public.exchanges
  for each row execute function public.handle_updated_at();

-- 2. Trigger on auth.users to auto-create profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, headline, bio)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'),
    coalesce(new.raw_user_meta_data->>'headline', 'Passionate Learner & Mentor'),
    coalesce(new.raw_user_meta_data->>'bio', 'Excited to share my expertise and learn new skills from fellow community members.')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Trigger to calculate new rating and exchange counts when a review is added
create or replace function public.handle_new_review()
returns trigger as $$
declare
  v_avg numeric(3,2);
  v_count integer;
begin
  select coalesce(avg(rating), 5.00), count(*)
  into v_avg, v_count
  from public.reviews
  where reviewee_id = new.reviewee_id;

  update public.profiles
  set rating = v_avg,
      reviews_count = v_count
  where id = new.reviewee_id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_created
  after insert on public.reviews
  for each row execute function public.handle_new_review();
