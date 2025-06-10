
import React, { useState, useEffect } from 'react';
import { useCreateMagazine, useUpdateMagazine, useDeleteMagazine, useMagazines } from '@/hooks/useMagazines';
import { useArticles } from '@/hooks/useArticles';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from 'date-fns';

const MagazineManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_number: '',
    publish_date: new Date(),
    cover_image_url: '',
    pdf_url: '',
    featured: false,
    slug: '',
    featured_article_id: null,
  });

  const { data: magazines = [], isLoading, error } = useMagazines();
  const { data: articles = [] } = useArticles();
  const createMagazine = useCreateMagazine();
  const updateMagazine = useUpdateMagazine();
  const deleteMagazine = useDeleteMagazine();

  useEffect(() => {
    if (editingMagazine) {
      setFormData({
        title: editingMagazine.title,
        description: editingMagazine.description,
        issue_number: editingMagazine.issue_number,
        publish_date: new Date(editingMagazine.publish_date),
        cover_image_url: editingMagazine.cover_image_url,
        pdf_url: editingMagazine.pdf_url,
        featured: editingMagazine.featured,
        slug: editingMagazine.slug,
        featured_article_id: editingMagazine.featured_article_id || null,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        issue_number: '',
        publish_date: new Date(),
        cover_image_url: '',
        pdf_url: '',
        featured: false,
        slug: '',
        featured_article_id: null,
      });
    }
  }, [editingMagazine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const magazineData = {
      ...formData,
      publish_date: formData.publish_date.toISOString(),
      featured: !!formData.featured,
    };

    if (isCreating) {
      await createMagazine.mutateAsync(magazineData);
    } else if (editingMagazine) {
      await updateMagazine.mutateAsync({ id: editingMagazine.id, ...magazineData });
    }

    setIsCreating(false);
    setEditingMagazine(null);
  };

  const handleDelete = async (id: string) => {
    await deleteMagazine.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Magazines</h2>
        <Button onClick={() => setIsCreating(true)}>Create New Magazine</Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingMagazine) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Magazine' : 'Edit Magazine'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="issue_number">Issue Number</Label>
                <Input
                  type="text"
                  id="issue_number"
                  value={formData.issue_number}
                  onChange={(e) => setFormData({ ...formData, issue_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="publish_date">Publish Date</Label>
                <DatePicker
                  id="publish_date"
                  value={formData.publish_date}
                  onValueChange={(date) => setFormData({ ...formData, publish_date: date || new Date() })}
                />
              </div>
              <div>
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  type="text"
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pdf_url">PDF URL</Label>
                <Input
                  type="text"
                  id="pdf_url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="featured">Featured</Label>
                <Input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
              </div>

              <div>
                <Label htmlFor="featured_article_id">Featured Article (Optional)</Label>
                <select
                  id="featured_article_id"
                  value={formData.featured_article_id || ''}
                  onChange={(e) => setFormData({ ...formData, featured_article_id: e.target.value || null })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-insightRed focus:border-insightRed"
                >
                  <option value="">Select Featured Article</option>
                  {articles.map((article) => (
                    <option key={article.id} value={article.id}>
                      {article.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => { setIsCreating(false); setEditingMagazine(null); }}>
                  Cancel
                </Button>
                <Button type="submit">{isCreating ? 'Create' : 'Update'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Magazines List */}
      <Card>
        <CardHeader>
          <CardTitle>Magazines</CardTitle>
          <CardDescription>A list of all magazines in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Publish Date</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {magazines.map((magazine) => (
                  <TableRow key={magazine.id}>
                    <TableCell>{magazine.title}</TableCell>
                    <TableCell>{magazine.issue_number}</TableCell>
                    <TableCell>{format(new Date(magazine.publish_date), "PPP")}</TableCell>
                    <TableCell>{magazine.featured ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button size="sm" onClick={() => setEditingMagazine(magazine)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(magazine.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MagazineManager;
