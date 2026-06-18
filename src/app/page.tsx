'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Sparkles, Target, FlaskConical, Mail, ArrowRight, CheckCircle, TrendingUp, Zap, Users, BarChart3, MessageSquare, ChevronRight, Lightbulb, Search, PenLine, TestTube2, Activity } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const features = [
  {
    id: 'feat-strategy',
    icon: Sparkles,
    title: 'AI Strategy Builder',
    desc: 'Answer a few questions. Get a full GTM strategy — positioning, messaging, and a 90-day action plan.',
    span: 'col-span-2 row-span-1',
    accent: '#7C6FFF',
  },
  {
    id: 'feat-icp',
    icon: Target,
    title: 'ICP & Channel Finder',
    desc: 'Stop guessing who to target. GTM Fox maps your ideal customer profile and ranks channels by fit.',
    span: 'col-span-1 row-span-2',
    accent: '#F97316',
  },
  {
    id: 'feat-outreach',
    icon: Mail,
    title: 'Outreach Copy Generator',
    desc: 'Cold emails, LinkedIn DMs, and follow-ups — written in your voice, optimized for replies.',
    span: 'col-span-1 row-span-1',
    accent: '#34D399',
  },
  {
    id: 'feat-experiments',
    icon: FlaskConical,
    title: 'Experiment Tracker',
    desc: 'Run structured GTM experiments. Track what works and double down fast.',
    span: 'col-span-1 row-span-1',
    accent: '#60A5FA',
  },
];

const testimonials = [
  {
    id: 'test-1',
    quote: 'I spent 3 months guessing at GTM. GTM Fox helped me get my first 5 paying customers in 3 weeks.',
    name: 'Siddharth K.',
    role: 'Founder, FormPilot',
    initials: 'SK',
    color: '#7C6FFF',
  },
  {
    id: 'test-2',
    quote: 'The ICP finder alone saved me from targeting the wrong market for another 6 months. Worth every penny.',
    name: 'Priya M.',
    role: 'Co-founder, DataBridge',
    initials: 'PM',
    color: '#F97316',
  },
  {
    id: 'test-3',
    quote: 'My outreach reply rate went from 2% to 18% after using the copy generator. Insane ROI.',
    name: 'James T.',
    role: 'Founder, LaunchKit',
    initials: 'JT',
    color: '#34D399',
  },
];

const stats = [
  { id: 'stat-1', value: '2,400+', label: 'Founders using GTM Fox' },
  { id: 'stat-2', value: '18%', label: 'Avg outreach reply rate' },
  { id: 'stat-3', value: '3 weeks', label: 'Avg time to first customer' },
  { id: 'stat-4', value: '94%', label: 'Would recommend to a friend' },
];

const modules = [
  {
    id: 'mod-strategy',
    number: '01',
    icon: Lightbulb,
    title: 'AI Strategy Builder',
    tagline: 'Full GTM strategy in under 10 minutes.',
    description: 'Answer a short intake form and GTM Fox generates a complete go-to-market strategy — positioning, messaging, target segments, and a prioritised 90-day action plan.',
    accent: '#7C6FFF',
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    accentBorder: 'border-primary/30',
    chips: ['Positioning framework', '90-day action plan', 'Exportable strategy doc'],
    bullets: ['AI-generated positioning & messaging', 'Prioritised 90-day action plan', 'Export to PDF or share with your team'],
    stat: '3×',
    statLabel: 'more likely to hit first revenue milestone',
    href: '/ai-strategy-builder',
  },
  {
    id: 'mod-icp',
    number: '02',
    icon: Search,
    title: 'ICP & Channel Finder',
    tagline: 'Stop selling to everyone. Sell to the right ones.',
    description: 'Define your ideal customer profile with AI assistance, then get a ranked list of channels scored by fit — so you focus budget and effort where it actually converts.',
    accent: '#F97316',
    accentBg: 'bg-accent/10',
    accentText: 'text-accent',
    accentBorder: 'border-accent/30',
    chips: ['Ideal customer profile', 'Channel fit scores', 'Radar chart view'],
    bullets: ['Detailed ICP with firmographics & pain points', 'Channel fit scores (LinkedIn, email, events…)', 'Visual radar chart for quick comparison'],
    stat: '4×',
    statLabel: 'better reply rates vs. broad targeting',
    href: '/icp-channel-finder',
  },
  {
    id: 'mod-outreach',
    number: '03',
    icon: PenLine,
    title: 'Outreach Copy Generator',
    tagline: 'Write outreach that actually gets replies.',
    description: 'Generate cold emails, LinkedIn DMs, and follow-up sequences in your brand voice. Get three variants per request so you can A/B test without starting from scratch.',
    accent: '#34D399',
    accentBg: 'bg-positive/10',
    accentText: 'text-positive',
    accentBorder: 'border-positive/30',
    chips: ['Cold email sequences', 'LinkedIn DMs', '3 variants per request'],
    bullets: ['Cold email, LinkedIn DM & follow-up formats', '3 copy variants per generation', 'Saved history for reuse & iteration'],
    stat: '18%',
    statLabel: 'avg. reply rate vs. 2–4% industry norm',
    href: '/outreach-copy-generator',
  },
  {
    id: 'mod-experiments',
    number: '04',
    icon: TestTube2,
    title: 'Experiment Tracker',
    tagline: 'Run GTM experiments like a scientist.',
    description: 'Log hypotheses, track results, and measure ROI across every channel test. See what\'s working at a glance and double down on winners before budget runs out.',
    accent: '#60A5FA',
    accentBg: 'bg-info/10',
    accentText: 'text-info',
    accentBorder: 'border-info/30',
    chips: ['Hypothesis logging', 'ROI & cost-per-reply', 'PDF / CSV export'],
    bullets: ['Structured hypothesis & result logging', 'ROI, cost-per-reply & conversion metrics', 'Export reports as PDF or CSV'],
    stat: '2×',
    statLabel: 'faster to find best-performing channel',
    href: '/experiment-tracker',
  },
  {
    id: 'mod-dashboard',
    number: '05',
    icon: Activity,
    title: 'Progress Dashboard',
    tagline: 'Your entire GTM motion in one view.',
    description: 'Track your GTM Readiness Score, milestone progress, and AI-recommended next actions — all updated in real time as you complete work across the other four modules.',
    accent: '#7C6FFF',
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    accentBorder: 'border-primary/30',
    chips: ['Live GTM Score', 'Milestone tracker', 'AI next-action feed'],
    bullets: ['Live GTM Readiness Score (0–100)', 'Milestone tracker with completion timeline', 'AI-powered next-best-action recommendations'],
    stat: '60%',
    statLabel: 'more likely to hit 90-day milestones',
    href: '/gtm-momentum',
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-150px] w-[500px] h-[500px] rounded-full bg-accent/8 blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[30%] w-[400px] h-[400px] rounded-full bg-primary/6 blur-[80px]" />
      </div>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border/50' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AppLogo size={32} />
            <span className="font-bold text-[17px] text-foreground tracking-tight">GTM Fox</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#testimonials" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium">Stories</a>
            <a href="#pricing" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</a>
          </div>
          <Link
            href="/dashboard"
            className="btn-primary px-5 py-2.5 text-[13px] flex items-center gap-1.5"
          >
            Get started free
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>
      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-semibold mb-8 tracking-wide">
            <Zap size={12} />
            AI-powered GTM for first-time founders
          </div>

          <h1 className="text-[clamp(2.4rem,5.5vw,4.2rem)] font-extrabold leading-[1.08] tracking-tight mb-6">
            Stop guessing.<br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-[#9B59F5] to-[#F97316] bg-clip-text text-transparent">
                Start growing.
              </span>
            </span>
          </h1>

          <p className="text-[17px] text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            GTM Fox is your AI co-pilot for go-to-market. Build your strategy, find your customers, write outreach that converts — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="btn-primary px-7 py-3.5 text-[15px] flex items-center gap-2 shadow-btn-primary"
            >
              Get started free
            </Link>
            <a href="#features" className="px-7 py-3.5 text-[14px] font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg transition-all hover:border-primary/40 hover:bg-secondary/50">
              See how it works
            </a>
          </div>

          <p className="text-[12px] text-muted-foreground mt-4">Free to start · No credit card required</p>
        </div>

        {/* Hero dashboard preview */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10 pointer-events-none" style={{top: '60%'}} />
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden shadow-modal">
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-negative/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-positive/60" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-md bg-muted/50 flex items-center px-3">
                <span className="text-[11px] text-muted-foreground/60">gtmagent9262.builtwithrocket.new</span>
              </div>
            </div>
            {/* Mock dashboard content */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {[
                { label: 'GTM Score', value: '78/100', color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'Experiments', value: '12 active', color: 'text-positive', bg: 'bg-positive/10' },
                { label: 'Outreach Sent', value: '340 this week', color: 'text-info', bg: 'bg-info/10' },
                { label: 'Customers', value: '8 paying', color: 'text-accent', bg: 'bg-accent/10' },
              ]?.map((card) => (
                <div key={card?.label} className={`rounded-xl p-4 ${card?.bg} border border-border/30`}>
                  <p className="text-[11px] text-muted-foreground mb-1">{card?.label}</p>
                  <p className={`text-[18px] font-bold ${card?.color}`}>{card?.value}</p>
                </div>
              ))}
              <div className="col-span-3 rounded-xl bg-muted/30 border border-border/30 p-4 h-32 flex items-end gap-1">
                {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95, 88, 100]?.map((h, i) => (
                  <div key={`bar-${i}`} className="flex-1 rounded-t-sm bg-primary/40" style={{height: `${h * 0.9}%`}} />
                ))}
              </div>
              <div className="col-span-1 rounded-xl bg-muted/30 border border-border/30 p-4 h-32 flex flex-col justify-between">
                <p className="text-[11px] text-muted-foreground font-semibold">Next Action</p>
                <div className="space-y-1.5">
                  {['Follow up with 3 leads', 'Run pricing experiment', 'Update ICP profile']?.map((t) => (
                    <div key={t} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                      <p className="text-[10px] text-muted-foreground truncate">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats bar */}
      <section className="py-12 px-6 border-y border-border/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats?.map((s) => (
            <div key={s?.id} className="text-center">
              <p className="text-[2rem] font-extrabold text-foreground leading-none mb-1">{s?.value}</p>
              <p className="text-[12px] text-muted-foreground">{s?.label}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Features bento */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-bold uppercase tracking-widest text-primary mb-3">Everything you need</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-tight">
              Your entire GTM stack,<br />in one AI-powered workspace
            </h2>
          </div>

          {/* Asymmetric bento grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-4 auto-rows-[180px]">
            {/* Strategy - wide */}
            <div className="col-span-2 row-span-1 rounded-2xl bg-card border border-border/60 p-6 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/8 blur-[60px] group-hover:bg-primary/15 transition-all duration-500" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-foreground mb-1.5">AI Strategy Builder</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">Answer a few questions. Get a full GTM strategy — positioning, messaging, and a 90-day action plan tailored to your startup stage.</p>
                </div>
              </div>
            </div>

            {/* ICP - tall */}
            <div className="col-span-1 row-span-2 rounded-2xl bg-card border border-border/60 p-6 relative overflow-hidden group hover:border-accent/40 transition-all duration-300">
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-accent/8 blur-[50px] group-hover:bg-accent/15 transition-all duration-500" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                  <Target size={18} className="text-accent" />
                </div>
                <h3 className="text-[16px] font-bold text-foreground mb-2">ICP & Channel Finder</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">Stop guessing who to target. GTM Fox maps your ideal customer profile and ranks channels by fit score.</p>
                <div className="mt-auto space-y-2">
                  {['LinkedIn (92% fit)', 'Cold Email (87% fit)', 'Product Hunt (74% fit)']?.map((ch) => (
                    <div key={ch} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <CheckCircle size={12} className="text-positive flex-shrink-0" />
                      {ch}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Outreach */}
            <div className="col-span-1 row-span-1 rounded-2xl bg-card border border-border/60 p-5 relative overflow-hidden group hover:border-positive/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-positive/8 blur-[40px] group-hover:bg-positive/15 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-xl bg-positive/15 flex items-center justify-center mb-3">
                  <Mail size={16} className="text-positive" />
                </div>
                <h3 className="text-[14px] font-bold text-foreground mb-1">Outreach Copy Generator</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">Cold emails, LinkedIn DMs, and follow-ups — written in your voice.</p>
              </div>
            </div>

            {/* Experiments */}
            <div className="col-span-1 row-span-1 rounded-2xl bg-card border border-border/60 p-5 relative overflow-hidden group hover:border-info/40 transition-all duration-300">
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-info/8 blur-[40px] group-hover:bg-info/15 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-xl bg-info/15 flex items-center justify-center mb-3">
                  <FlaskConical size={16} className="text-info" />
                </div>
                <h3 className="text-[14px] font-bold text-foreground mb-1">Experiment Tracker</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">Run structured GTM experiments. Track what works and double down fast.</p>
              </div>
            </div>

            {/* GTM Momentum - wide bottom */}
            <div className="col-span-3 row-span-1 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary to-card border border-primary/20 p-6 flex items-center justify-between group hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <TrendingUp size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-foreground">GTM Momentum Dashboard</h3>
                  <p className="text-[13px] text-muted-foreground">See your progress in real-time. KPIs, milestones, and AI-suggested next actions — all in one view.</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                {[BarChart3, Users, MessageSquare]?.map((Icon, i) => (
                  <div key={`icon-${i}`} className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={16} className="text-primary/70" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Module Deep Dive */}
      <section id="modules" className="py-24 px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-bold uppercase tracking-widest text-primary mb-3">How it works</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-tight mb-4">
              Five modules. One complete<br />go-to-market system.
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">
              Each module solves a specific GTM problem. Together, they give you everything you need to find customers and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modules?.map((mod) => {
              const ModIcon = mod?.icon;
              return (
                <div
                  key={mod?.id}
                  className={`rounded-2xl bg-card border ${mod?.accentBorder} p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-300 group`}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl ${mod?.accentBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <ModIcon size={20} className={mod?.accentText} />
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${mod?.accentText} opacity-60`}>Module {mod?.number}</span>
                      <h3 className="text-[16px] font-extrabold text-foreground leading-tight">{mod?.title}</h3>
                      <p className={`text-[11px] font-semibold ${mod?.accentText} mt-0.5`}>{mod?.tagline}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{mod?.description}</p>

                  {/* What you get bullets */}
                  <ul className="space-y-1.5">
                    {mod?.bullets?.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[12px] text-foreground/80">
                        <CheckCircle size={12} className={`${mod?.accentText} flex-shrink-0 mt-0.5`} />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Stat widget */}
                  <div className={`rounded-xl ${mod?.accentBg} border ${mod?.accentBorder} px-4 py-3 flex items-center gap-3`}>
                    <span className={`text-[26px] font-extrabold leading-none ${mod?.accentText}`}>{mod?.stat}</span>
                    <span className={`text-[11px] leading-snug ${mod?.accentText} opacity-80`}>{mod?.statLabel}</span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={mod?.href}
                    className={`inline-flex items-center gap-1 text-[12px] font-semibold ${mod?.accentText} hover:opacity-70 transition-opacity mt-auto`}
                  >
                    Try {mod?.title}
                    <ChevronRight size={13} />
                  </Link>
                </div>
              );
            })}

            {/* Spanning card — "Start building" prompt */}
            <div className="md:col-span-2 rounded-2xl bg-card border border-primary/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[15px] font-extrabold text-foreground">Ready to build your GTM system?</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">Start with Module 01 — takes less than 10 minutes.</p>
              </div>
              <Link href="/ai-strategy-builder" className="btn-primary px-5 py-2.5 text-[13px] flex items-center gap-1.5 whitespace-nowrap shadow-btn-primary">
                Start for free <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-bold uppercase tracking-widest text-primary mb-3">Founder stories</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold">Real results from real founders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials?.map((t) => (
              <div key={t?.id} className="rounded-2xl bg-card border border-border/60 p-6 flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
                <p className="text-[14px] text-muted-foreground leading-relaxed italic mb-6">"{t?.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0" style={{backgroundColor: t?.color}}>
                    {t?.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{t?.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t?.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[12px] font-bold uppercase tracking-widest text-primary mb-3">Simple pricing</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold mb-4">Start free. Scale when you grow.</h2>
          <p className="text-[15px] text-muted-foreground mb-12">No credit card required. Upgrade only when GTM Fox has helped you get customers.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            {/* Free */}
            <div className="rounded-2xl bg-card border border-border/60 p-7">
              <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Free</p>
              <p className="text-[2.5rem] font-extrabold text-foreground leading-none mb-1">$0</p>
              <p className="text-[13px] text-muted-foreground mb-6">Forever free</p>
              <ul className="space-y-3 mb-8">
                {['AI Strategy Builder (3 sessions)', 'ICP Finder (1 profile)', 'Outreach Generator (10 copies/mo)', 'Experiment Tracker (5 experiments)']?.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <CheckCircle size={14} className="text-positive flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block w-full py-3 text-center rounded-lg border border-border text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors">
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl bg-card border border-primary/40 p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/10 blur-[60px]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-bold text-primary uppercase tracking-widest">Pro</p>
                  <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-bold">Most popular</span>
                </div>
                <p className="text-[2.5rem] font-extrabold text-foreground leading-none mb-1">$29</p>
                <p className="text-[13px] text-muted-foreground mb-6">per month</p>
                <ul className="space-y-3 mb-8">
                  {['Unlimited AI strategy sessions', 'Unlimited ICP profiles', 'Unlimited outreach copy', 'Unlimited experiments', 'GTM Momentum dashboard', 'Priority AI responses']?.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                      <CheckCircle size={14} className="text-positive flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className="btn-primary block w-full py-3 text-center text-[13px] shadow-btn-primary">
                  Start Pro free for 14 days
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-secondary to-card border border-primary/30 p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-[-50px] left-[-50px] w-48 h-48 rounded-full bg-primary/15 blur-[60px]" />
              <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 rounded-full bg-accent/10 blur-[60px]" />
            </div>
            <div className="relative z-10">
              <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold mb-4">Ready to get your first customers?</h2>
              <p className="text-[15px] text-muted-foreground mb-8">Join 2,400+ founders who stopped guessing and started growing with GTM Fox.</p>
              <Link
                href="/dashboard"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-[15px] shadow-btn-primary"
              >
                Get started free — it's free
              </Link>
              <p className="text-[12px] text-muted-foreground mt-4">No credit card · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AppLogo size={24} />
            <span className="font-bold text-[14px] text-foreground">GTM Fox</span>
          </div>
          <p className="text-[12px] text-muted-foreground">© 2026 GTM Fox. Built for first-time founders.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <Link href="/dashboard" className="text-[12px] text-primary font-semibold hover:underline">Go to app</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}