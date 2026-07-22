import { useGetAdminStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Globe, Inbox, Settings, Activity, Server, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">SYSTEM OVERVIEW</h1>
          <p className="text-muted-foreground font-mono text-sm">Welcome back to the command center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="TOTAL SITES" value={stats?.totalSites} icon={Globe} loading={statsLoading} />
        <StatCard title="LIVE SITES" value={stats?.liveSites} icon={Server} loading={statsLoading} className="border-primary/50" valueClass="text-primary" />
        <StatCard title="BUILDING" value={stats?.buildingSites} icon={Settings} loading={statsLoading} />
        <StatCard title="PENDING QUOTES" value={stats?.pendingQuotes} icon={Inbox} loading={statsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> RECENT ACTIVITY
            </h2>
          </div>

          <div className="space-y-4">
            {activityLoading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5" />)}
              </div>
            ) : activity?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed border-border">
                No recent activity.
              </div>
            ) : (
              activity?.map((item) => (
                <div key={item.id} className="p-4 bg-card border border-border flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white mb-1">{item.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <Clock className="w-3 h-3" />
                      {format(new Date(item.createdAt), "MMM d, yyyy HH:mm")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-display font-bold">QUICK ACTIONS</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <Link href="/admin/quotes" className="p-4 border border-border bg-card hover:bg-white/5 transition-colors group flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-1">Review Quotes</div>
                <div className="text-xs text-muted-foreground">Manage incoming client requests</div>
              </div>
              <Inbox className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            
            <Link href="/admin/sites" className="p-4 border border-border bg-card hover:bg-white/5 transition-colors group flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-1">Manage Sites</div>
                <div className="text-xs text-muted-foreground">Open the site builder and launch</div>
              </div>
              <Globe className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, loading, className = "", valueClass = "text-white" }: any) {
  return (
    <div className={`p-6 bg-card border border-border flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-mono text-muted-foreground tracking-widest">{title}</div>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      {loading ? (
        <div className="h-10 w-24 bg-white/5 animate-pulse" />
      ) : (
        <div className={`text-4xl font-display font-bold ${valueClass}`}>
          {value !== undefined ? value : "-"}
        </div>
      )}
    </div>
  );
}
