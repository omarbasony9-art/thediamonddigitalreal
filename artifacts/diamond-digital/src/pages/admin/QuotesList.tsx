import { useState } from "react";
import { useListQuotes, useUpdateQuote, useDeleteQuote, getListQuotesQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ExternalLink, Filter } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function QuotesList() {
  const [filter, setFilter] = useState<string>("all");
  const { data: quotes, isLoading } = useListQuotes(filter !== "all" ? { status: filter as any } : undefined);
  const updateQuote = useUpdateQuote();
  const deleteQuote = useDeleteQuote();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = (id: number, status: string) => {
    updateQuote.mutate({ id, data: { status: status as any } }, {
      onSuccess: () => {
        toast({ title: "Status updated" });
        queryClient.invalidateQueries({ queryKey: getListQuotesQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this quote request?")) return;
    deleteQuote.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Quote deleted" });
        queryClient.invalidateQueries({ queryKey: getListQuotesQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">QUOTE REQUESTS</h1>
          <p className="text-muted-foreground font-mono text-sm">Incoming project inquiries</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card p-1 border border-border">
          <Filter className="w-4 h-4 ml-2 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] border-0 bg-transparent focus:ring-0">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-none">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading quotes...</div>
        ) : quotes?.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            No quote requests found.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {quotes?.map((quote) => (
              <div key={quote.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:bg-white/5 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-white text-lg truncate">{quote.name}</h3>
                    <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1">{quote.projectType}</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mb-3">
                    <span>{quote.email}</span>
                    {quote.company && <span>• {quote.company}</span>}
                    <span>• {format(new Date(quote.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <p className="text-sm text-white/80 line-clamp-2">{quote.description}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 w-full lg:w-auto">
                  <Select value={quote.status} onValueChange={(v) => handleStatusChange(quote.id, v)}>
                    <SelectTrigger className={`w-[140px] h-9 rounded-none border-border ${
                      quote.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      quote.status === 'in_progress' ? 'bg-primary/10 text-primary border-primary/20' :
                      quote.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      'bg-background'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-none">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-border hover:bg-white/10 hover:text-white">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl bg-card border-border rounded-none text-white">
                        <DialogHeader>
                          <DialogTitle className="font-display text-2xl">Quote Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div>
                            <div className="text-xs text-muted-foreground font-mono mb-1">CLIENT</div>
                            <div className="font-bold">{quote.name}</div>
                            <div className="text-sm">{quote.email}</div>
                            {quote.phone && <div className="text-sm">{quote.phone}</div>}
                            {quote.company && <div className="text-sm">{quote.company}</div>}
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground font-mono mb-1">PROJECT SPECS</div>
                            <div className="text-sm"><span className="text-muted-foreground">Type:</span> {quote.projectType}</div>
                            <div className="text-sm"><span className="text-muted-foreground">Budget:</span> {quote.budget || "Unspecified"}</div>
                            <div className="text-sm"><span className="text-muted-foreground">Timeline:</span> {quote.timeline || "Unspecified"}</div>
                            <div className="text-sm"><span className="text-muted-foreground">Date:</span> {format(new Date(quote.createdAt), "PPpp")}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-mono mb-2">DESCRIPTION</div>
                          <div className="bg-background border border-border p-4 text-sm whitespace-pre-wrap">
                            {quote.description}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-border text-muted-foreground hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50" onClick={() => handleDelete(quote.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
