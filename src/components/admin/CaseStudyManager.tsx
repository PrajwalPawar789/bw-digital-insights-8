import React, { useState } from "react";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { useImageUpload } from "@/hooks/useImageUpload";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface CaseStudyFormData {
  id?: string;
  title: string;
  image_url: string;
  display_order: number;
}

const emptyForm: CaseStudyFormData = {
  title: "",
  image_url: "",
  display_order: 0,
};

const CaseStudyManager: React.FC = () => {
  const { data: caseStudies = [], refetch, isLoading } = useCaseStudies();
  const { uploadImage, uploading } = useImageUpload();
  const [form, setForm] = useState<CaseStudyFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getString = (value: any) =>
    typeof value === "string" ? value : value == null ? "" : String(value);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "display_order" ? Number(value) : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "case-studies");
      setForm((f) => ({ ...f, image_url: url }));
    } catch {
      /* useImageUpload already surfaces a toast on failure */
    }
  };

  const handleEdit = (c: any) => {
    setForm({
      id: c.id,
      title: getString(c.title),
      image_url: getString(c.image_url),
      display_order: typeof c.display_order === "number" ? c.display_order : 0,
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setForm({ ...emptyForm, display_order: caseStudies.length });
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
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        image_url: form.image_url.trim() || null,
        display_order: Number.isFinite(form.display_order) ? form.display_order : 0,
      };
      if (editingId) {
        const { error } = await supabase
          .from("case_studies")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Case study updated!");
      } else {
        const { error } = await supabase.from("case_studies").insert([payload]);
        if (error) throw error;
        toast.success("Case study created!");
      }
      refetch();
      handleCancel();
    } catch (err: any) {
      toast.error(err.message || "Error saving case study.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this case study?")) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from("case_studies").delete().eq("id", id);
      if (error) throw error;
      toast.success("Case study deleted!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Error deleting case study.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Case Studies</CardTitle>
            <CardDescription>
              Manage the cards shown in the "Case Studies" section on the Home page.
              Cards are ordered by Display Order (lowest first).
            </CardDescription>
          </div>
          <Button variant="default" size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" /> Add Case Study
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form
              className="mb-8 space-y-4 bg-muted p-4 rounded"
              onSubmit={handleSubmit}
            >
              <div>
                <Label htmlFor="title">Title / Caption*</Label>
                <textarea
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 min-h-[60px] bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_file">Card Image</Label>
                  <Input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <Label htmlFor="image_url" className="mt-2 block">
                    Image URL
                  </Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleInputChange}
                    placeholder="Uploaded image URL, or paste a link"
                  />
                  {uploading && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Loader2 className="animate-spin h-3 w-3" /> Uploading…
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    name="display_order"
                    type="number"
                    value={form.display_order}
                    onChange={handleInputChange}
                  />
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="mt-3 w-full max-w-[220px] aspect-[3/2] object-cover rounded border"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving || uploading}>
                  {saving ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editingId ? "Update Case Study" : "Add Case Study"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
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
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : caseStudies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No case studies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  caseStudies.map((c: any) => (
                    <TableRow key={c.id ?? Math.random()}>
                      <TableCell>{getString(c.display_order)}</TableCell>
                      <TableCell>
                        {c.image_url ? (
                          <img
                            src={getString(c.image_url)}
                            alt="Case study"
                            className="w-20 h-14 object-cover rounded"
                          />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md">
                        {getString(c.title)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title="Edit"
                            onClick={() => handleEdit(c)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            title="Delete"
                            disabled={deletingId === c.id}
                            onClick={() => handleDelete(c.id)}
                          >
                            {deletingId === c.id ? (
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

export default CaseStudyManager;
