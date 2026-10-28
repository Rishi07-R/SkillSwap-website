-- ==============================================================================
-- SkillSwap Seed Data (Fictional Development Data)
-- ==============================================================================

-- 1. Insert Standard Skills Directory
insert into public.skills (id, name, category, description, icon_name) values
  ('11111111-1111-1111-1111-000000000001', 'React & Next.js', 'Software & Tech', 'Modern frontend web development with component architecture and hooks', 'Code'),
  ('11111111-1111-1111-1111-000000000002', 'Python Programming', 'Software & Tech', 'General-purpose programming, scripting, data handling and automation', 'Terminal'),
  ('11111111-1111-1111-1111-000000000003', 'Node.js & Backend', 'Software & Tech', 'Scalable server-side REST APIs, microservices, and databases', 'Server'),
  ('11111111-1111-1111-1111-000000000004', 'TypeScript', 'Software & Tech', 'Type-safe JavaScript for robust frontend and fullstack applications', 'FileCode'),
  ('11111111-1111-1111-1111-000000000005', 'Machine Learning & AI', 'Software & Tech', 'Neural networks, scikit-learn, prompt engineering, and LLM apps', 'Cpu'),
  ('11111111-1111-1111-1111-000000000006', 'UI/UX Design', 'Design & Creative', 'User research, wireframing, usability testing, and interaction design', 'Layout'),
  ('11111111-1111-1111-1111-000000000007', 'Figma & Design Systems', 'Design & Creative', 'Component libraries, auto-layout, prototypes, and handoff workflows', 'Figma'),
  ('11111111-1111-1111-1111-000000000008', '3D Modeling & Blender', 'Design & Creative', '3D asset creation, sculpting, materials, lighting, and rendering', 'Box'),
  ('11111111-1111-1111-1111-000000000009', 'Conversational Spanish', 'Languages', 'Latin American and European conversational fluency, grammar, and vocabulary', 'Languages'),
  ('11111111-1111-1111-1111-000000000010', 'Conversational German', 'Languages', 'German conversation, business terminology, and daily dialogue', 'Globe'),
  ('11111111-1111-1111-1111-000000000011', 'Product Management', 'Business & Marketing', 'Roadmapping, user story formulation, PRDs, and sprint prioritization', 'Briefcase'),
  ('11111111-1111-1111-1111-000000000012', 'SEO & Content Strategy', 'Business & Marketing', 'Keyword research, technical SEO audits, and content conversion funnels', 'TrendingUp'),
  ('11111111-1111-1111-1111-000000000013', 'Public Speaking & Pitching', 'Business & Marketing', 'Slide deck design, storytelling, stage presence, and confidence building', 'Mic'),
  ('11111111-1111-1111-1111-000000000014', 'Acoustic & Electric Guitar', 'Music & Arts', 'Chords, music theory, scales, rhythm, and fingerstyle technique', 'Music'),
  ('11111111-1111-1111-1111-000000000015', 'Music Production & Ableton', 'Music & Arts', 'Mixing, beat making, EQ, compression, and vocal processing', 'Radio')
on conflict (id) do nothing;

-- 2. Insert Profiles (Note: In production these link with auth.users)
insert into public.profiles (id, email, full_name, avatar_url, headline, bio, location, timezone, availability, rating, reviews_count, exchanges_completed) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'alex.rivera@example.com', 'Alex Rivera', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'Senior Full Stack Developer & Open Source Contributor', 'Passionate developer building web platforms for 7+ years. I love simplifying complex web concepts and want to elevate my design and language skills in exchange!', 'San Francisco, CA', 'PST (UTC-8)', 'Weeknights & Saturdays', 4.95, 12, 14),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'maya.lin@example.com', 'Maya Lin', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 'Principal Product Designer & Design System Lead', 'Design leader specializing in user research and scalable Figma systems. Looking for an experienced dev partner to help me master modern React component architecture.', 'Brooklyn, NY', 'EST (UTC-5)', 'Weekend Mornings', 4.98, 19, 21),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'elena.rostova@example.com', 'Elena Rostova', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', 'Polyglot Educator & Language Specialist', 'Fluent in 5 languages with 6 years experience coaching professionals. Excited to trade Spanish/German lessons for Python programming and AI workflow automation.', 'Austin, TX', 'CST (UTC-6)', 'Tuesdays & Thursdays', 4.92, 15, 18),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'david.chen@example.com', 'David Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 'Senior AI Engineer & Python Architect', 'Machine learning researcher and engineer. I can mentor you in Python, fine-tuning LLMs, or data pipelines in exchange for pitch training or conversational Spanish.', 'Seattle, WA', 'PST (UTC-8)', 'Sundays anytime', 4.88, 8, 9),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'sarah.jenkins@example.com', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', 'Music Producer, Sound Designer & Audio Engineer', 'Professional composer & sound producer with studio experience. Looking to learn product management frameworks and design to launch my audio creator startup.', 'Los Angeles, CA', 'PST (UTC-8)', 'Flexible afternoons', 5.00, 7, 7),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'marcus.thorne@example.com', 'Marcus Thorne', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', 'Growth Strategist & SEO Consultant', 'Scaled 4 startups to \$5M+ ARR via organic search, conversion architecture, and content engines. Looking to learn Node.js backend development.', 'Chicago, IL', 'CST (UTC-6)', 'Monday & Wednesday evenings', 4.85, 10, 11),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'priya.patel@example.com', 'Priya Patel', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', 'Principal Product Manager & Agile Coach', '10 years building high-impact tech products. Excited to mentor upcoming PMs in exchange for acoustic guitar lessons or Spanish conversation.', 'Toronto, Canada', 'EST (UTC-5)', 'Weekends', 4.90, 14, 16),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'liam.oconnor@example.com', 'Liam O''Connor', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', '3D Visual Artist & Motion Graphics Director', 'Specialized in 3D Blender assets, animation, and motion branding. Looking to learn React & TypeScript to turn interactive 3D scenes into WebGL experiences.', 'Dublin, Ireland', 'GMT (UTC+0)', 'Evenings GMT', 4.96, 6, 8)
on conflict (id) do nothing;

-- 3. Insert User Skills (Offered and Wanted)
insert into public.user_skills (user_id, skill_id, skill_type, proficiency_level, years_of_experience, notes) values
  -- Alex Rivera
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-000000000001', 'offered', 'Expert', 7, 'Specialized in clean React architecture, custom hooks, and Tailwind CSS.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-000000000003', 'offered', 'Advanced', 5, 'Building RESTful APIs and Postgres integrations.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-000000000004', 'offered', 'Advanced', 4, 'Fullstack TypeScript typing and best practices.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-000000000006', 'wanted', 'Beginner', 0, 'Want to master UI hierarchy, spacing systems, and typography.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-000000000007', 'wanted', 'Beginner', 0, 'Learn advanced Figma components, variants, and auto-layout.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-000000000009', 'wanted', 'Beginner', 0, 'Conversational Spanish for traveling and remote work.'),

  -- Maya Lin (Perfect reciprocal match with Alex!)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-000000000006', 'offered', 'Expert', 8, 'Product discovery, wireframing, user testing, and visual design.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-000000000007', 'offered', 'Expert', 6, 'Scalable design tokens, nested components, responsive layout grids.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-000000000001', 'wanted', 'Intermediate', 1, 'Want to bring Figma designs to life with React & CSS.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-000000000008', 'wanted', 'Beginner', 0, 'Curious about adding 3D Blender assets into design systems.'),

  -- Elena Rostova
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-000000000009', 'offered', 'Expert', 10, 'Fluent native coach. Focus on active dialogue, fluency, and idioms.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-000000000010', 'offered', 'Expert', 8, 'Structured grammar and business conversational German.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-000000000002', 'wanted', 'Beginner', 0, 'Looking to learn Python for data analysis and automating lesson plans.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-000000000012', 'wanted', 'Intermediate', 1, 'Want to improve online reach for my language coaching platform.'),

  -- David Chen
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-000000000002', 'offered', 'Expert', 8, 'Python mastery, asynchronous code, algorithms, data structures.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-000000000005', 'offered', 'Advanced', 5, 'Fine-tuning, HuggingFace, embeddings, vector databases.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-000000000013', 'wanted', 'Beginner', 0, 'Preparing for keynote speaking and tech conference presentations.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-000000000009', 'wanted', 'Beginner', 0, 'Spanish basics for an upcoming South America sabbatical.'),

  -- Sarah Jenkins
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-000000000014', 'offered', 'Advanced', 7, 'Fingerstyle, jazz chords, and modern acoustic song accompaniment.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-000000000015', 'offered', 'Expert', 9, 'Ableton Live workflows, vocal mixing, compression, and mastering.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-000000000011', 'wanted', 'Beginner', 0, 'Need help validating product roadmaps and user discovery.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-000000000006', 'wanted', 'Beginner', 0, 'UI design fundamentals for my audio sample marketplace.'),

  -- Marcus Thorne
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-000000000012', 'offered', 'Expert', 7, 'Enterprise SEO audits, semantic search optimization, organic growth.'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-000000000003', 'wanted', 'Beginner', 0, 'Want to write custom backend scrapers and Node.js microservices.'),

  -- Priya Patel
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '11111111-1111-1111-1111-000000000011', 'offered', 'Expert', 10, 'Product vision, prioritization frameworks, and stakeholder management.'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '11111111-1111-1111-1111-000000000014', 'wanted', 'Beginner', 0, 'Always wanted to learn acoustic guitar as a creative hobby.'),

  -- Liam O'Connor
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '11111111-1111-1111-1111-000000000008', 'offered', 'Expert', 6, 'Blender 3D modeling, lighting, geometry nodes, and render pipelines.'),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '11111111-1111-1111-1111-000000000001', 'wanted', 'Beginner', 0, 'Want to embed interactive 3D objects in React and WebGL.')
on conflict (user_id, skill_id, skill_type) do nothing;

-- 4. Sample Completed Exchange and Review
insert into public.exchanges (id, user_a_id, user_b_id, user_a_skill_id, user_b_skill_id, status, meeting_link, schedule_details, shared_notes, user_a_completed, user_b_completed, completed_at) values
  ('77777777-7777-7777-7777-777777777771', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-000000000001', '11111111-1111-1111-1111-000000000007', 'completed', 'https://meet.google.com/abc-swap-xyz', 'Completed 4 sessions over 2 weeks', 'Shared Figma files and React starter repository.', true, true, now() - interval '3 days')
on conflict (id) do nothing;

insert into public.reviews (exchange_id, reviewer_id, reviewee_id, rating, comment) values
  ('77777777-7777-7777-7777-777777777771', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'Alex is an exceptional tutor! He made React hooks and state management crystal clear. Highly recommend swapping skills with him!'),
  ('77777777-7777-7777-7777-777777777771', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 5, 'Maya revolutionized the way I structure UI components in Figma. Incredible design knowledge, patient teaching style, and structured exercises.')
on conflict (exchange_id, reviewer_id) do nothing;
