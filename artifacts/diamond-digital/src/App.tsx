import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import About from "./pages/About";
import ClientLogin from "./pages/ClientLogin";
import ClientPortal from "./pages/ClientPortal";
import Dashboard from "./pages/admin/Dashboard";
import QuotesList from "./pages/admin/QuotesList";
import SitesList from "./pages/admin/SitesList";
import SiteBuilder from "./pages/admin/SiteBuilder";
import NotFound from "./pages/not-found";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { ProtectedAdminRoute } from "./components/layout/ProtectedAdminRoute";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

// Clerk configuration
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(190 100% 50%)",
    colorForeground: "hsl(0 0% 100%)",
    colorMutedForeground: "hsl(240 10% 60%)",
    colorDanger: "hsl(0 80% 50%)",
    colorBackground: "hsl(240 20% 6%)",
    colorInput: "hsl(240 20% 12%)",
    colorInputForeground: "hsl(0 0% 100%)",
    colorNeutral: "hsl(240 20% 15%)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#08080C] border border-white/10 rounded-none w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-white font-display font-bold",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-white",
    formFieldLabel: "text-white",
    footerActionLink: "text-primary hover:text-primary/80",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-primary",
    alertText: "text-white",
    logoBox: "mb-6",
    logoImage: "w-12 h-12",
    socialButtonsBlockButton: "border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-none",
    formButtonPrimary: "bg-primary text-[#08080C] hover:bg-primary/90 rounded-none font-mono tracking-widest text-sm",
    formFieldInput: "bg-[#111116] border-white/10 text-white rounded-none focus:ring-primary h-12",
    footerAction: "border-t border-white/10 pt-4 mt-6",
    dividerLine: "bg-white/10",
    alert: "border-white/10 bg-white/5",
    otpCodeFieldInput: "bg-[#111116] border-white/10 text-white",
    formFieldRow: "mb-4",
    main: "p-6",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="relative z-10">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="relative z-10">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClientRef = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClientRef.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClientRef]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "ENTER CONSOLE",
            subtitle: "Authorized personnel only.",
          },
        },
        signUp: {
          start: {
            title: "CREATE ACCOUNT",
            subtitle: "Request console access.",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />

            {/* Admin Routes */}
            <Route path="/admin">
              <ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>
            </Route>
            <Route path="/admin/quotes">
              <ProtectedAdminRoute><QuotesList /></ProtectedAdminRoute>
            </Route>
            <Route path="/admin/sites">
              <ProtectedAdminRoute><SitesList /></ProtectedAdminRoute>
            </Route>
            <Route path="/admin/sites/:id">
              <ProtectedAdminRoute><SiteBuilder /></ProtectedAdminRoute>
            </Route>

            {/* Client Portal */}
            <Route path="/client-login" component={ClientLogin} />
            <Route path="/client-portal" component={ClientPortal} />

            {/* Public Routes */}
            <Route path="/">
              <PublicLayout><Home /></PublicLayout>
            </Route>
            <Route path="/services">
              <PublicLayout><Services /></PublicLayout>
            </Route>
            <Route path="/industries">
              <PublicLayout><Industries /></PublicLayout>
            </Route>
            <Route path="/about">
              <PublicLayout><About /></PublicLayout>
            </Route>

            <Route>
              <PublicLayout><NotFound /></PublicLayout>
            </Route>
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
