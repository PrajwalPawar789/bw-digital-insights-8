import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

const headingKey = "client_logos_heading";

const fetchClientLogos = async () => {
  const { data, error } = await supabase.from("client_logos").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

const fetchHeading = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", headingKey)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data?.value ?? "You'll be in good company";
};

const setHeading = async (newHeading: string) => {
  // Upsert the heading value (insert or update)
  const { error } = await supabase
    .from("settings")
    .upsert([{ key: headingKey, value: newHeading, description: "Client logos section heading" }], { onConflict: "key" });
  if (error) throw error;
};

const createLogo = async ({ name, logo_url, website_url }: any) => {
  const { error } = await supabase
    .from("client_logos")
    .insert([{ name, logo_url, website_url }]);
  if (error) throw error;
};

const updateLogo = async ({ id, name, logo_url, website_url }: any) => {
  const { error } = await supabase
    .from("client_logos")
    .update({ name, logo_url, website_url })
    .eq("id", id);
  if (error) throw error;
};

const deleteLogo = async (id: string) => {
  const { error } = await supabase
    .from("client_logos")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

const ClientLogosManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Section heading
  const { data: heading, refetch: refetchHeading } = useQuery({ queryKey: ["client_logos_heading"], queryFn: fetchHeading });
  const [headingValue, setHeadingValue] = useState("");
  const [isEditingHeading, setIsEditingHeading] = useState(false);

  // Logos
  const { data: logos, isLoading } = useQuery({ queryKey: ["client_logos"], queryFn: fetchClientLogos });
  const [form, setForm] = useState({ id: "", name: "", logo_url: "", website_url: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mutations
  const createMutation = useMutation({ mutationFn: createLogo, 
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["client_logos"] }); setForm({ id: "", name: "", logo_url: "", website_url: "" }); toast({ title: "Logo added!" }); }
  });

  const updateMutation = useMutation({
    mutationFn: updateLogo,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["client_logos"] }); setForm({ id: "", name: "", logo_url: "", website_url: "" }); setEditingId(null); toast({ title: "Logo updated!" }); }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLogo,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["client_logos"] }); toast({ title: "Logo deleted!" }); }
  });

  const headingMutation = useMutation({
    mutationFn: setHeading,
    onSuccess: () => { refetchHeading(); setIsEditingHeading(false); toast({ title: "Section heading updated!" }); }
  });

  // For editing
  const startEditLogo = (logo: any) => {
    setForm({ id: logo.id, name: logo.name, logo_url: logo.logo_url, website_url: logo.website_url || "" });
    setEditingId(logo.id);
  };
  const cancelLogoEdit = () => {
    setForm({ id: "", name: "", logo_url: "", website_url: "" });
    setEditingId(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, name: form.name, logo_url: form.logo_url, website_url: form.website_url });
    } else {
      createMutation.mutate({ name: form.name, logo_url: form.logo_url, website_url: form.website_url });
    }
  };

  React.useEffect(() => { setHeadingValue(heading ?? ""); }, [heading]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Client Logos Section</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Section Heading</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingHeading ? (
            <form
              onSubmit={(e) => { e.preventDefault(); headingMutation.mutate(headingValue); }}
              className="flex gap-2"
            >
              <Input
                value={headingValue}
                onChange={(e) => setHeadingValue(e.target.value)}
                className="max-w-md"
                required
              />
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => { setIsEditingHeading(false); setHeadingValue(heading ?? ""); }}>Cancel</Button>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-lg">{heading ?? "You'll be in good company"}</span>
              <Button variant="link" onClick={() => setIsEditingHeading(true)}>Edit</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Logo" : "Add New Logo"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <Input
                value={form.logo_url}
                onChange={e => setForm({ ...form, logo_url: e.target.value })}
                required
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website URL (optional)</label>
              <Input
                value={form.website_url}
                onChange={e => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="submit">{editingId ? "Update" : "Add"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelLogoEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="mb-2 text-xl font-semibold">All Logos</h2>
      {/* Begin Table for logos */}
      <div className="overflow-x-auto rounded-md bg-white shadow mb-8">
        <Table>
          <TableCaption>
            {isLoading ? "Loading client logos..." : (logos && logos.length === 0 ? "No client logos found." : null)}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : (
              (logos && logos.length > 0) ? logos.map((logo: any) => (
                <TableRow key={logo.id}>
                  <TableCell>
                    <img
                      src={logo.logo_url}
                      alt={logo.name}
                      className="h-10 w-auto max-w-[64px] rounded bg-gray-100 border"
                    />
                  </TableCell>
                  <TableCell className="text-base font-semibold">{logo.name}</TableCell>
                  <TableCell>
                    {logo.website_url ? (
                      <a
                        href={logo.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-insightRed underline break-all"
                      >
                        {logo.website_url}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2 items-center justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditLogo(logo)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(logo.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">No client logos found.</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientLogosManager;
