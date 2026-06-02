import { useState, useRef, useEffect } from "react";
import { useClerk, useUser } from "@clerk/react";
import { LogOut, Send, RotateCcw, Clock, Skull } from "lucide-react";
import {
  useGetChatHistory,
  useGetChatStatus,
  useSendMessage,
  useResetChat,
  getGetChatHistoryQueryKey,
  getGetChatStatusQueryKey,
} from "../api-client/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type LocalMessage = {
  role: string;
  content: string;
  createdAt: string;
  isOptimistic?: boolean;
};

function ThinkingBubble() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #d42020 0%, #7b0000 100%)", boxShadow: "0 0 10px rgba(200,20,20,0.4)" }}>
        <span className="text-white text-xs font-bold font-mono">K</span>
      </div>
      <div className="rounded-2xl rounded-tl-sm px-5 py-4 max-w-[85%] relative"
        style={{
          background: "rgba(80,10,10,0.45)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(220,60,60,0.20)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,100,100,0.08)"
        }}>
        <div className="text-xs font-mono mb-2" style={{ color: "hsl(0 70% 60%)" }}>
          Sir Kanha Worm GPT
        </div>
        <div className="flex items-center gap-1 py-1">
          <span className="text-xs mr-2" style={{ color: "hsl(0 15% 65%)" }}>Thinking</span>
          {[0, 1, 2].map(i => (
            <span key={i} className="thinking-dot inline-block w-2 h-2 rounded-full"
              style={{ background: "hsl(0 70% 60%)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CreditExpiredScreen({ nextCreditAt }: { nextCreditAt: string | null }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!nextCreditAt) return;
    const update = () => {
      const diff = new Date(nextCreditAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("00:00:00"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [nextCreditAt]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      {/* Glow orb */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, rgba(180,20,20,0.8) 0%, transparent 70%)", transform: "scale(2)" }} />
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(80,10,10,0.6)",
            border: "1px solid rgba(220,60,60,0.35)",
            animation: "credit-blink 2s ease-in-out infinite",
            boxShadow: "0 0 30px rgba(180,20,20,0.4)"
          }}>
          <Skull className="w-9 h-9" style={{ color: "hsl(0 80% 60%)" }} />
        </div>
      </div>

      <h2 className="text-2xl font-black mb-2 tracking-tight"
        style={{ background: "linear-gradient(135deg, #ff8888 0%, #cc2222 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        Credits Expired
      </h2>
      <p className="text-sm mb-6 max-w-xs leading-relaxed" style={{ color: "hsl(0 15% 60%)" }}>
        You have used your 2 free daily messages. Your credits will automatically refresh in 24 hours.
      </p>

      {timeLeft && (
        <div className="glass-card rounded-2xl px-8 py-5 mb-6 text-center">
          <div className="text-xs font-mono mb-1 tracking-widest uppercase" style={{ color: "hsl(0 15% 55%)" }}>
            Refreshes in
          </div>
          <div className="text-3xl font-black font-mono tracking-widest"
            style={{ color: "hsl(0 80% 65%)", textShadow: "0 0 20px rgba(220,40,40,0.5)" }}>
            {timeLeft}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs px-4 py-2 rounded-full"
        style={{ background: "rgba(220,40,40,0.10)", border: "1px solid rgba(220,60,60,0.20)", color: "hsl(0 15% 60%)" }}>
        <Clock className="w-3.5 h-3.5" />
        <span>Come back tomorrow for 2 more free messages</span>
      </div>
    </div>
  );
}

export default function Chat() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: history } = useGetChatHistory();
  const { data: status } = useGetChatStatus();
  const sendMessageMutation = useSendMessage();
  const resetChatMutation = useResetChat();

  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [countdown, setCountdown] = useState<number>(0);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (history) setLocalMessages(history);
  }, [history]);

  useEffect(() => {
    if (status?.cooldownSeconds && status.cooldownSeconds > 0) {
      setCountdown(status.cooldownSeconds);
    } else {
      setCountdown(0);
    }
  }, [status]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages, isThinking]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    if (status?.creditsRemaining === 0) return;
    if (countdown > 0) {
      toast.error(`Please wait ${countdown}s before asking another question.`);
      return;
    }

    const msg = input.trim();
    setInput("");
    setIsThinking(true);

    setLocalMessages(prev => [
      ...prev,
      { role: "user", content: msg, createdAt: new Date().toISOString(), isOptimistic: true }
    ]);

    try {
      const result = await sendMessageMutation.mutateAsync({ data: { message: msg } });
      setLocalMessages(prev => [
        ...prev.map(m => m.isOptimistic ? { ...m, isOptimistic: false } : m),
        { role: "assistant", content: result.reply, createdAt: new Date().toISOString() }
      ]);
      queryClient.invalidateQueries({ queryKey: getGetChatStatusQueryKey() });
    } catch (err: any) {
      setLocalMessages(prev => prev.filter(m => !m.isOptimistic));
      if (err.status === 429) {
        toast.error(err.data?.error || "Rate limit reached.");
        queryClient.invalidateQueries({ queryKey: getGetChatStatusQueryKey() });
      } else {
        toast.error("Connection failed. Try again.");
      }
    } finally {
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleReset = async () => {
    await resetChatMutation.mutateAsync({});
    queryClient.invalidateQueries({ queryKey: getGetChatHistoryQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetChatStatusQueryKey() });
    toast.success("Memory cleared.");
  };

  const isLimitReached = status?.creditsRemaining === 0;
  const creditsUsed = status?.creditsUsed ?? 0;
  const maxCredits = status?.maxCredits ?? 2;

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden relative">

      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%, hsl(0 55% 16%) 0%, hsl(0 30% 7%) 55%, hsl(0 20% 4%) 100%)" }} />
        <div className="absolute -left-60 top-1/2 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(160,15,15,0.5) 0%, transparent 70%)", animation: "float-orb 9s ease-in-out infinite" }} />
        <div className="absolute -right-60 top-1/3 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(120,10,10,0.5) 0%, transparent 70%)", animation: "float-orb 11s ease-in-out 3s infinite" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 shrink-0 flex items-center justify-between px-4 sm:px-6 py-3"
        style={{
          background: "rgba(30,5,5,0.70)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(220,60,60,0.15)"
        }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #d42020 0%, #7b0000 100%)", boxShadow: "0 0 12px rgba(200,20,20,0.4)" }}>
            <span className="text-white text-xs font-bold font-mono">K</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold tracking-wide" style={{ color: "hsl(0 10% 88%)" }}>Sir Kanha Worm GPT</div>
            <div className="text-xs font-mono" style={{ color: "hsl(0 15% 50%)" }}>
              {user?.primaryEmailAddress?.emailAddress || user?.username || "Operator"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Credit pills */}
          <div className="flex gap-1">
            {Array.from({ length: maxCredits }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  background: i < creditsUsed
                    ? "rgba(100,20,20,0.4)"
                    : "hsl(0 80% 55%)",
                  boxShadow: i < creditsUsed ? "none" : "0 0 6px rgba(220,40,40,0.6)"
                }} />
            ))}
          </div>
          <span className="text-xs font-mono" style={{ color: isLimitReached ? "hsl(0 70% 60%)" : "hsl(0 15% 60%)" }}>
            {maxCredits - creditsUsed}/{maxCredits}
          </span>

          <button
            onClick={handleReset}
            disabled={resetChatMutation.isPending}
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-mono transition-all duration-200 hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(220,60,60,0.18)", color: "hsl(0 15% 65%)" }}>
            <RotateCcw className="w-3 h-3" />
            New Chat
          </button>

          <button
            onClick={() => signOut({ redirectUrl: (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/" })}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(220,60,60,0.15)", color: "hsl(0 15% 60%)" }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden relative z-10">
        {isLimitReached && localMessages.length >= 0 ? (
          <CreditExpiredScreen nextCreditAt={status?.nextCreditAt ?? null} />
        ) : (
          <div className="h-full overflow-y-auto px-4 sm:px-6 py-6" ref={scrollRef}>
            <div className="max-w-2xl mx-auto flex flex-col gap-5">

              {localMessages.length === 0 && !isThinking && (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(80,10,10,0.4)",
                      border: "1px solid rgba(220,60,60,0.20)",
                      boxShadow: "0 0 24px rgba(180,20,20,0.15)"
                    }}>
                    <span className="text-2xl font-black font-mono" style={{ color: "hsl(0 80% 60%)" }}>K</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "hsl(0 10% 80%)" }}>Sir Kanha Worm GPT</p>
                    <p className="text-xs mt-1" style={{ color: "hsl(0 15% 50%)" }}>Ask anything. No limits, no filters.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs px-4 py-1.5 rounded-full"
                    style={{ background: "rgba(220,40,40,0.08)", border: "1px solid rgba(220,60,60,0.15)", color: "hsl(0 15% 55%)" }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "hsl(0 80% 55%)", animation: "glow-pulse 2s ease-in-out infinite" }} />
                    {maxCredits - creditsUsed} free message{maxCredits - creditsUsed !== 1 ? "s" : ""} remaining today
                  </div>
                </div>
              )}

              {localMessages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div key={idx} className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                      style={isUser
                        ? { background: "rgba(80,80,80,0.5)", border: "1px solid rgba(255,255,255,0.12)" }
                        : { background: "linear-gradient(135deg, #d42020 0%, #7b0000 100%)", boxShadow: "0 0 8px rgba(200,20,20,0.35)" }
                      }>
                      <span className="text-white text-xs font-bold font-mono">
                        {isUser ? (user?.firstName?.[0] || "U") : "K"}
                      </span>
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${msg.isOptimistic ? "opacity-70" : ""}`}
                      style={isUser
                        ? {
                          background: "linear-gradient(135deg, rgba(160,20,20,0.45) 0%, rgba(100,10,10,0.55) 100%)",
                          border: "1px solid rgba(220,60,60,0.25)",
                          borderBottomRightRadius: "4px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
                        }
                        : {
                          background: "rgba(55,8,8,0.55)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(180,40,40,0.18)",
                          borderBottomLeftRadius: "4px",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,100,100,0.06)"
                        }
                      }>

                      {!isUser && (
                        <div className="text-xs font-mono mb-1.5 font-bold" style={{ color: "hsl(0 70% 58%)" }}>
                          Sir Kanha Worm GPT
                        </div>
                      )}

                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                        style={{ color: isUser ? "hsl(0 10% 88%)" : "hsl(0 5% 85%)" }}>
                        {msg.content}
                      </div>

                      {!isUser && (
                        <div className="mt-2 pt-2 text-xs font-mono" style={{ color: "hsl(0 40% 45%)", borderTop: "1px solid rgba(180,40,40,0.15)" }}>
                          — Sir Kanha Worm GPT
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isThinking && <ThinkingBubble />}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      {!isLimitReached && (
        <div className="relative z-10 px-4 sm:px-6 py-4 shrink-0"
          style={{
            background: "rgba(20,3,3,0.80)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(180,40,40,0.15)"
          }}>
          <form onSubmit={handleSend} className="max-w-2xl mx-auto relative">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                countdown > 0
                  ? `Cooldown — wait ${countdown}s...`
                  : isThinking
                  ? "Sir Kanha Worm GPT is thinking..."
                  : "Ask anything..."
              }
              disabled={isThinking || countdown > 0}
              className="w-full pr-14 pl-5 py-4 rounded-2xl text-sm outline-none transition-all duration-200 font-sans"
              style={{
                background: "rgba(50,8,8,0.60)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(180,40,40,0.25)",
                color: "hsl(0 5% 88%)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,100,100,0.06)",
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = "rgba(220,40,40,0.50)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px rgba(180,20,20,0.15), inset 0 1px 0 rgba(255,100,100,0.06)";
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = "rgba(180,40,40,0.25)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,100,100,0.06)";
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking || countdown > 0}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: input.trim() && !isThinking && countdown === 0
                  ? "linear-gradient(135deg, #d42020 0%, #8b0000 100%)"
                  : "rgba(100,20,20,0.3)",
                boxShadow: input.trim() && !isThinking && countdown === 0
                  ? "0 4px 12px rgba(180,20,20,0.4)"
                  : "none",
                color: "white",
                opacity: !input.trim() || isThinking || countdown > 0 ? 0.4 : 1
              }}>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {countdown > 0 && (
            <div className="max-w-2xl mx-auto mt-2 text-center text-xs font-mono"
              style={{ color: "hsl(0 40% 55%)" }}>
              Next message available in {countdown}s
            </div>
          )}
        </div>
      )}
    </div>
  );
}
