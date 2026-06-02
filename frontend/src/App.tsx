import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: "/",
    logoImageUrl: `${window.location.origin}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(0 85% 52%)",
    colorForeground: "hsl(0 10% 90%)",
    colorMutedForeground: "hsl(0 15% 58%)",
    colorDanger: "hsl(0 85% 52%)",
    colorBackground: "hsl(0 35% 10%)",
    colorInput: "hsl(0 30% 13%)",
    colorInputForeground: "hsl(0 10% 88%)",
    colorNeutral: "hsl(0 40% 22%)",
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !rounded-none",
    footer: "!shadow-none !border-0 !rounded-none",
    headerTitle: "text-foreground font-bold",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground",
    formFieldLabel: "text-foreground",
    footerActionLink: "text-primary hover:text-primary/80",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-primary",
    alertText: "text-foreground",
    logoBox: "mb-2",
    logoImage: "w-10 h-10 rounded-xl",
    socialButtonsBlockButton: "border-border bg-input hover:bg-muted text-foreground transition-colors rounded-xl",
    formButtonPrimary: "font-bold rounded-xl",
    formFieldInput: "bg-input border-border text-foreground rounded-xl",
    footerAction: "",
    dividerLine: "bg-border",
    alert: "bg-muted border-border rounded-xl",
    otpCodeFieldInput: "bg-input border-border text-foreground rounded-xl",
    formFieldRow: "mb-4",
    main: "w-full",
  },
};

const authPageStyle: React.CSSProperties = {
  background: "radial-gradient(ellipse 120% 80% at 50% -10%, hsl(0 55% 18%) 0%, hsl(0 30% 7%) 55%, hsl(0 20% 4%) 100%)",
};

const cardBoxStyle: React.CSSProperties = {
  background: "rgba(60, 8, 8, 0.60)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(220, 60, 60, 0.22)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,120,120,0.10)",
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 relative overflow-hidden" style={authPageStyle}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-1/3 w-96 h-96 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(160,15,15,0.6) 0%, transparent 70%)" }} />
        <div className="absolute -right-40 bottom-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(120,10,10,0.6) 0%, transparent 70%)" }} />
      </div>
      <div className="relative z-10 w-full flex justify-center">
        <div style={{ ...cardBoxStyle, borderRadius: "1rem", overflow: "hidden", maxWidth: "440px", width: "100%" }}>
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 relative overflow-hidden" style={authPageStyle}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-1/3 w-96 h-96 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(160,15,15,0.6) 0%, transparent 70%)" }} />
        <div className="absolute -right-40 bottom-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(120,10,10,0.6) 0%, transparent 70%)" }} />
      </div>
      <div className="relative z-10 w-full flex justify-center">
        <div style={{ ...cardBoxStyle, borderRadius: "1rem", overflow: "hidden", maxWidth: "440px", width: "100%" }}>
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/chat" /></Show>
      <Show when="signed-out"><Home /></Show>
    </>
  );
}

function ChatRoute() {
  return (
    <>
      <Show when="signed-in"><Chat /></Show>
      <Show when="signed-out"><Redirect to="/" /></Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const id = user?.id ?? null;
      if (prevRef.current !== undefined && prevRef.current !== id) qc.clear();
      prevRef.current = id;
    });
    return unsub;
  }, [addListener, qc]);
  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      localization={{
        signIn: { start: { title: "Welcome Back", subtitle: "Sign in to Sir Kanha Worm GPT" } },
        signUp: { start: { title: "Create Account", subtitle: "Join Sir Kanha Worm GPT" } },
      }}
      routerPush={(to) => setLocation(to)}
      routerReplace={(to) => setLocation(to, { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/chat" component={ChatRoute} />
        </Switch>
        <Toaster toastOptions={{ style: { background: "rgba(60,8,8,0.90)", border: "1px solid rgba(220,60,60,0.25)", color: "hsl(0 10% 88%)", backdropFilter: "blur(12px)" } }} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <WouterRouter>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}
