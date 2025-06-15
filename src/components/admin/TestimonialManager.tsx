
import React, { useState } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { supabase } from "@/integrations/supabase/client";
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface TestimonialFormData {
  id?: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar_url: string;
}

const emptyForm: TestimonialFormData = {
  quote: "",
  name: "",
  title: "",
  company: "",
  avatar_url: "",
};

const TestimonialManager = () => {
  const { data: testimonials = [], refetch, isLoading } = useTestimonials();
  const [form, setForm] = useState<TestimonialFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (t: any) => {
    setForm({
      id: t.id,
      quote: t.quote || "",
      name: t.name || "",
      title: t.title || "",
      company: t.company || "",
      avatar_url: t.avatar_url || "",
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (!form.quote.trim() || !form.name.trim()) {
      toast.error("Quote and Name are required.");
      setSaving(false);
      return;
    }
    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from("testimonials")
          .update({
            quote: form.quote,
            name: form.name,
            title: form.title,
            company: form.company,
            avatar_url: form.avatar_url,
          })
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Testimonial updated!");
      } else {
        // Create
        const { error } = await supabase
          .from("testimonials")
          .insert([{
            quote: form.quote,
            name: form.name,
            title: form.title,
            company: form.company,
            avatar_url: form.avatar_url,
          }]);
        if (error) throw error;
        toast.success("Testimonial created!");
      }
      refetch();
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Error saving testimonial.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      toast.success("Testimonial deleted!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Error deleting testimonial.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Manage testimonials shown on the main site.</CardDescription>
          </div>
          <Button variant="default" size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" /> Add Testimonial
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form
              className="mb-8 space-y-4 bg-muted p-4 rounded"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Quote*</Label>
                  <textarea
                    name="quote"
                    value={form.quote}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 min-h-[80px] bg-white"
                    required
                  />
                </div>
                <div>
                  <Label>Name*</Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Label className="mt-2 block">Title</Label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                  />
                  <Label className="mt-2 block">Company</Label>
                  <Input
                    name="company"
                    value={form.company}
                    onChange={handleInputChange}
                  />
                  <Label className="mt-2 block">Avatar Image URL</Label>
                  <Input
                    name="avatar_url"
                    value={form.avatar_url}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
                  {editingId ? "Update Testimonial" : "Add Testimonial"}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : testimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No testimonials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((t: any) => (
                    <TableRow key={t.id}>
                      <TableCell className="max-w-xs truncate">{t.quote}</TableCell>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.title}</TableCell>
                      <TableCell>{t.company}</TableCell>
                      <TableCell>
                        {t.avatar_url && (
                          <img src={t.avatar_url} alt="Avatar" className="w-10 h-10 object-cover rounded-full" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title="Edit"
                            onClick={() => handleEdit(t)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            title="Delete"
                            disabled={deletingId === t.id}
                            onClick={() => handleDelete(t.id)}
                          >
                            {deletingId === t.id ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialManager;
