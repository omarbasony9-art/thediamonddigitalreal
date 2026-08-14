import { Switch, Route, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAuthTokenGetter } from "@workspace/api-client-react";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import DigitalMarketing from "./pages/DigitalMarketing";
import AboutDigitalMarketing from "./pages/AboutDigitalMarketing";
import AboutSoftwareDevelopment from "./pages/AboutSoftwareDevelopment";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Industries from "./pages/Industries";
import About from "./pages/About";
import Dashboard from "./pages/admin/Dashboard";
import QuotesList from "./pages/admin/QuotesList";
import SitesList from "./pages/admin/SitesList";
import SiteBuilder from "./pages/admin/SiteBuilder";
import AdminSignIn from "./pages/admin/AdminSignIn";
import NewProject from "./pages/admin/NewProject";
import NotFound from "./pages/not-found";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { ProtectedAdminRoute } from "./components/layout/ProtectedAdminRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

// Attach admin JWT to all generated API-client requests
setAuthTokenGetter(() => localStorage.getItem("admin_token"));

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Switch>
          {/* Admin */}
          <Route path="/admin/login" component={AdminSignIn} />
          <Route path="/admin">
            <ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>
          </Route>
          <Route path="/admin/quotes">
            <ProtectedAdminRoute><QuotesList /></ProtectedAdminRoute>
          </Route>
          <Route path="/admin/sites">
            <ProtectedAdminRoute><SitesList /></ProtectedAdminRoute>
          </Route>
          <Route path="/admin/new-project">
            <ProtectedAdminRoute><NewProject /></ProtectedAdminRoute>
          </Route>
          <Route path="/admin/sites/:id">
            <ProtectedAdminRoute><SiteBuilder /></ProtectedAdminRoute>
          </Route>

          {/* Public */}
          <Route path="/">
            <PublicLayout><Home /></PublicLayout>
          </Route>
          <Route path="/services">
            <PublicLayout><Services /></PublicLayout>
          </Route>
          <Route path="/digital-marketing">
            <PublicLayout><DigitalMarketing /></PublicLayout>
          </Route>
          <Route path="/about/digital-marketing">
            <PublicLayout><AboutDigitalMarketing /></PublicLayout>
          </Route>
          <Route path="/about/software-development">
            <PublicLayout><AboutSoftwareDevelopment /></PublicLayout>
          </Route>
          <Route path="/privacy-policy">
            <PublicLayout><PrivacyPolicy /></PublicLayout>
          </Route>
          <Route path="/terms-of-service">
            <PublicLayout><TermsOfService /></PublicLayout>
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
  );
}

export default function App() {
  return (
    <WouterRouter base="/">
      <AppRoutes />
    </WouterRouter>
  );
}
