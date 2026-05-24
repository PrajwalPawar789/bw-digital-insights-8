import React, { useState } from "react";
import { useLinkedinPosts, toLinkedinEmbedUrl } from "@/hooks/useLinkedinPosts";
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

interface LinkedinPostFormData {
  id?: string;
  body: string;
  image_url: string;
  likes: number;
  href: string;
  display_order: number;
}

const emptyForm: LinkedinPostFormData = {
  body: "",
  image_url: "",
  likes: 0,
  href: "",
  display_order: 0,
};

const LinkedinPostsManager: React.FC = () => {
  const { data: posts = [], refetch, isLoading } = useLinkedinPosts();
  const { uploadImage, uploading } = useImageUpload();
  const [form, setForm] = useState<LinkedinPostFormData>(emptyForm);
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
      [name]:
        name === "display_order" || name === "likes" ? Number(value) : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "linkedin-posts");
      setForm((f) => ({ ...f, image_url: url }));
    } catch {
      /* useImageUpload already surfaces a toast on failure */
    }
  };

  const handleEdit = (p: any) => {
    setForm({
      id: p.id,
      body: getString(p.body) === "LinkedIn post" ? "" : getString(p.body),
      image_url: getString(p.image_url),
      likes: typeof p.likes === "number" ? p.likes : 0,
      href: getString(p.href),
      display_order: typeof p.display_order === "number" ? p.display_order : 0,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    const nextOrder =
      posts.length === 0
        ? 0
        : Math.max(...posts.map((p) => p.display_order ?? 0)) + 1;
    setForm({ ...emptyForm, display_order: nextOrder });
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
    if (!form.body.trim()) {
      toast.error("Post text is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        body: form.body.trim(),
        image_url: form.image_url.trim() || null,
        likes: Number.isFinite(form.likes) ? form.likes : 0,
        href: form.href.trim() || null,
        embed_url: toLinkedinEmbedUrl(form.href.trim()),
        display_order: Number.isFinite(form.display_order) ? form.display_order : 0,
      };
      if (editingId) {
        const { error } = await supabase
          .from("linkedin_posts")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("LinkedIn post updated!");
      } else {
        const { error } = await supabase.from("linkedin_posts").insert([payload]);
        if (error) throw error;
        toast.success("LinkedIn post created!");
      }
      refetch();
      handleCancel();
    } catch (err: any) {
      toast.error(err.message || "Error saving LinkedIn post.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this LinkedIn post?")) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from("linkedin_posts").delete().eq("id", id);
      if (error) throw error;
      toast.success("LinkedIn post deleted!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Error deleting LinkedIn post.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>LinkedIn Posts</CardTitle>
            <CardDescription>
              Manage the cards shown in the "Follow on LinkedIn" section on the
              Home page. Cards are ordered by Display Order (lowest first).
            </CardDescription>
          </div>
          <Button variant="default" size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" /> Add LinkedIn Post
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form
              className="mb-8 space-y-4 bg-muted p-4 rounded"
              onSubmit={handleSubmit}
            >
              <div>
                <Label htmlFor="body">Post Text*</Label>
                <textarea
                  id="body"
                  name="body"
                  value={form.body}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 min-h-[80px] bg-white"
                  placeholder="The text snippet that will show on the card (will be truncated to ~3 lines)."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_file">Post Image</Label>
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
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="mt-3 w-full max-w-[260px] aspect-[16/9] object-cover rounded border"
                    />
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="href">LinkedIn URL</Label>
                    <Input
                      id="href"
                      name="href"
                      value={form.href}
                      onChange={handleInputChange}
                      placeholder="https://www.linkedin.com/posts/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Used when a visitor clicks the card.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="likes">Likes</Label>
                      <Input
                        id="likes"
                        name="likes"
                        type="number"
                        value={form.likes}
                        onChange={handleInputChange}
                      />
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving || uploading}>
                  {saving ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editingId ? "Update LinkedIn Post" : "Add LinkedIn Post"}
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
                  <TableHead>Post Text</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No LinkedIn posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((p: any) => (
                    <TableRow key={p.id ?? Math.random()}>
                      <TableCell>{p.display_order}</TableCell>
                      <TableCell>
                        {p.image_url ? (
                          <img
                            src={getString(p.image_url)}
                            alt="LinkedIn post"
                            className="w-20 h-14 object-cover rounded"
                          />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <span className="line-clamp-2 text-sm">
                          {getString(p.body)}
                        </span>
                      </TableCell>
                      <TableCell>{getString(p.likes)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title="Edit"
                            onClick={() => handleEdit(p)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            title="Delete"
                            disabled={deletingId === p.id}
                            onClick={() => handleDelete(p.id)}
                          >
                            {deletingId === p.id ? (
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

export default LinkedinPostsManager;
