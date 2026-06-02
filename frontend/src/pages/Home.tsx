import { Link } from "wouter";
import { Brain, Zap, ShieldOff, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden relative">

      {/* Deep layered background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base dark crimson */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%, hsl(0 60% 18%) 0%, hsl(0 30% 7%) 60%, hsl(0 20% 4%) 100%)" }} />
        {/* Side glow left */}
        <div className="absolute -left-40 top-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(180,20,20,0.18) 0%, transparent 70%)", animation: "float-orb 8s ease-in-out infinite" }} />
        {/* Side glow right */}
        <div className="absolute -right-40 bottom-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(140,10,10,0.15) 0%, transparent 70%)", animation: "float-orb 10s ease-in-out 2s infinite" }} />
        {/* Center hero glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(220,40,40,0.12) 0%, transparent 70%)" }} />
        {/* Subtle mesh texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff4444' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #e02020 0%, #7b0000 100%)", boxShadow: "0 0 16px rgba(220,40,40,0.5)" }}>
            <span className="text-white font-bold text-sm font-mono">K</span>
          </div>
          <span className="font-bold text-sm tracking-wide hidden sm:inline" style={{ color: "hsl(0 10% 88%)" }}>
            Sir Kanha Worm GPT
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <button className="text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{ color: "hsl(0 15% 75%)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(220,60,60,0.20)" }}>
              Sign In
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="text-sm px-5 py-2 rounded-lg font-bold transition-all duration-200 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #d42020 0%, #8b0000 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(200,20,20,0.35)" }}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-16">

        {/* Hero card — glassmorphism */}
        <div className="glass-card rounded-2xl px-8 md:px-16 py-12 md:py-16 w-full max-w-3xl text-center mb-12 relative overflow-hidden">
          {/* Inner top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,120,120,0.4), transparent)" }} />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-6 tracking-widest uppercase"
            style={{ background: "rgba(220,40,40,0.15)", border: "1px solid rgba(220,60,60,0.30)", color: "hsl(0 85% 70%)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" style={{ animation: "glow-pulse 2s ease-in-out infinite", boxShadow: "0 0 6px #ff4444" }} />
            System Online
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-none"
            style={{ background: "linear-gradient(135deg, #ffffff 30%, #ff8888 70%, #cc2222 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            SIR KANHA<br />
            <span style={{ background: "linear-gradient(135deg, #ff6666 0%, #cc2222 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              WORM GPT
            </span>
          </h1>

          <p className="text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed" style={{ color: "hsl(0 15% 68%)" }}>
            Uncensored AI intelligence. Raw answers, no guardrails. Made by Sir Kanha for those who demand real power.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-in">
              <button className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:scale-105 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #e02222 0%, #8b0000 100%)", color: "#fff", boxShadow: "0 8px 24px rgba(200,20,20,0.45)" }}>
                Initialize Session
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:scale-105"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(220,60,60,0.30)", color: "hsl(0 10% 85%)" }}>
                Create Account
              </button>
            </Link>
          </div>

          {/* Bottom shimmer */}
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(180,30,30,0.3), transparent)" }} />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
          {[
            {
              icon: <ShieldOff className="w-6 h-6" />,
              title: "No Filters",
              desc: "Complete unfiltered intelligence. For advanced operators only. No guardrails, no censorship."
            },
            {
              icon: <Brain className="w-6 h-6" />,
              title: "Deep Intelligence",
              desc: "Powered by cutting-edge uncensored models that answer what others refuse."
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Fast Responses",
              desc: "Lightning-fast replies injected directly into your session. No delays."
            }
          ].map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,100,100,0.25), transparent)" }} />
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(220,40,40,0.20)", border: "1px solid rgba(220,60,60,0.25)", color: "hsl(0 85% 65%)" }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-sm tracking-wide" style={{ color: "hsl(0 10% 88%)" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "hsl(0 15% 60%)" }}>{f.desc}</p>
              <button className="mt-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-70 text-left"
                style={{ color: "hsl(0 70% 60%)" }}>
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Credits badge */}
        <div className="mt-10 flex items-center gap-2 text-xs"
          style={{ color: "hsl(0 15% 55%)" }}>
          <MessageSquare className="w-3.5 h-3.5" />
          <span>2 free messages per day &mdash; No credit card required</span>
        </div>
      </main>
    </div>
  );
}
