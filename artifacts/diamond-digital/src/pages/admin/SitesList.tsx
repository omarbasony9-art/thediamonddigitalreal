import { useState } from "react";
import { useListSites, useCreateSite, getListSitesQueryKey } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Globe, Filter } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

const siteSchema = z.object({
  clientName: z.string().min(1, "Client Name is required"),
  projectName: z.string().min(1, "Project Name is required"),
  tech: z.enum(["react", "nextjs", "vanilla", "wordpress", "other"]),
  domain: z.string().optional(),
  clientEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  description: z.string().optional(),
});

export default function SitesList() {
  const [filter, setFilter] = useState<string>("all");
  const { data: sites, isLoading } = useListSites(filter !== "all" ? { status: filter as any } : undefined);
  const createSite = useCreateSite();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof siteSchema>>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      clientName: "",
      projectName: "",
      tech: "react",
      domain: "",
      clientEmail: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof siteSchema>) => {
    createSite.mutate({ data }, {
      onSuccess: (newSite) => {
        toast({ title: "Site created successfully" });
        queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() });
        setIsDialogOpen(false);
        form.reset();
        setLocation(`/admin/sites/${newSite.id}`);
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to create site" });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">CLIENT SITES</h1>
          <p className="text-muted-foreground font-mono text-sm">Manage active and completed builds</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card p-1 border border-border">
            <Filter className="w-4 h-4 ml-2 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[150px] border-0 bg-transparent focus:ring-0">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-none">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="building">Building</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono gap-2">
                <Plus className="w-4 h-4" /> NEW SITE
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border rounded-none text-white">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Create New Site</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField control={form.control} name="clientName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name *</FormLabel>
                      <FormControl><Input className="bg-background border-white/10 rounded-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="projectName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl><Input className="bg-background border-white/10 rounded-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="tech" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technology Stack</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-white/10 rounded-none">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-white/10 rounded-none">
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="nextjs">Next.js</SelectItem>
                            <SelectItem value="vanilla">Vanilla JS</SelectItem>
                            <SelectItem value="wordpress">WordPress</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="domain" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Domain</FormLabel>
                        <FormControl><Input placeholder="example.com" className="bg-background border-white/10 rounded-none" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="clientEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Portal Email</FormLabel>
                      <FormControl><Input type="email" placeholder="client@company.com" className="bg-background border-white/10 rounded-none" {...field} /></FormControl>
                      <p className="text-xs text-muted-foreground mt-1">Links this site to the client's portal account so they can track status</p>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createSite.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono mt-4">
                    {createSite.isPending ? "CREATING..." : "INITIALIZE SITE"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-muted-foreground border border-border bg-card">Loading sites...</div>
      ) : sites?.length === 0 ? (
        <div className="p-16 text-center text-muted-foreground border border-border bg-card flex flex-col items-center">
          <Globe className="w-12 h-12 mb-4 opacity-20" />
          <p className="mb-4">No sites found.</p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="border-primary/50 text-primary hover:bg-primary/10 rounded-none font-mono">
            CREATE THE FIRST SITE
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sites?.map((site) => (
            <Link key={site.id} href={`/admin/sites/${site.id}`}>
              <div className="bg-card border border-border p-6 hover:border-primary/50 transition-colors group cursor-pointer h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`px-2 py-1 text-xs font-mono tracking-wider ${
                    site.status === 'live' ? 'bg-primary/20 text-primary border border-primary/30' :
                    site.status === 'building' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-white/5 text-muted-foreground border border-white/10'
                  }`}>
                    {site.status.toUpperCase()}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground border border-white/10 px-2 py-1">
                    {site.tech}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors relative z-10">{site.projectName}</h3>
                <p className="text-sm text-muted-foreground mb-6 relative z-10">{site.clientName}</p>
                
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground relative z-10">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {site.domain || "No domain set"}
                  </div>
                  <div>Updated {format(new Date(site.updatedAt || site.createdAt), "MMM d")}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
