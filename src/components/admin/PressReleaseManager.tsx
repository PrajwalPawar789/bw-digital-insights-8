
import React, { useState, useEffect } from 'react';
import { usePressReleases, useCreatePressRelease, useUpdatePressRelease, useDeletePressRelease } from '@/hooks/usePressReleases';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Edit2, Trash2, Plus, FileText, ExternalLink } from 'lucide-react';
import { slugify } from '@/lib/slugify';

interface PressRelease {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  date: string;
  image_url: string | null;
  author: string;
  featured: boolean;
}

const PressReleaseManager = () => {
  const { data: pressReleases, isLoading } = usePressReleases();
  const { mutate: createPressRelease } = useCreatePressRelease();
  const { mutate: updatePressRelease } = useUpdatePressRelease();
  const { mutate: deletePressRelease } = useDeletePressRelease();
  const { uploadImage } = useImageUpload();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [author, setAuthor] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (selectedRelease) {
      setEditMode(true);
      setTitle(selectedRelease.title);
      setSlug(selectedRelease.slug);
      setExcerpt(selectedRelease.excerpt ?? '');
      setContent(selectedRelease.content);
      setDate(new Date(selectedRelease.date).toISOString().split('T')[0]);
      setImageUrl(selectedRelease.image_url);
      setAuthor(selectedRelease.author);
      setFeatured(selectedRelease.featured);
      setOpen(true);
    } else {
      resetForm();
    }
  }, [selectedRelease]);

  const resetForm = () => {
    setEditMode(false);
    setSelectedRelease(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setDate('');
    setImageUrl(null);
    setAuthor('');
    setFeatured(false);
  };

  const handleDialogClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!title || !content || !date || !author) {
      toast.error('Please fill in all required fields (title, content, date, author).');
      return;
    }

    const releaseData = {
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      date,
      image_url: imageUrl,
      author,
      featured,
    };

    if (editMode && selectedRelease) {
      updatePressRelease({ id: selectedRelease.id, ...releaseData }, {
        onSuccess: handleDialogClose,
      });
    } else {
      createPressRelease(releaseData, {
        onSuccess: handleDialogClose,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this press release? This action cannot be undone.")) {
      deletePressRelease(id);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadImage(file, "press-releases");
      setImageUrl(url);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Press Releases</h2>
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => {
              resetForm();
              setOpen(true);
            }}>
              <Plus className="h-4 w-4" />
              Create Press Release
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Press Release' : 'Create New Press Release'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="Slug (auto-generated from title)" value={slug} onChange={(e) => setSlug(e.target.value)} />
              <Input placeholder="Author *" value={author} onChange={(e) => setAuthor(e.target.value)} />
              <Textarea placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
              <Textarea placeholder="Content *" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="date">Publish Date *</Label>
                    <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                 <div>
                    <Label>Cover Image</Label>
                    <Input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} disabled={isUploading}/>
                    <Label htmlFor="imageUpload" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md px-3 py-2 text-sm cursor-pointer inline-block w-full text-center">
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                    </Label>
                    {imageUrl && <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-2 block">View Image</a>}
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                <Label htmlFor="featured">Feature this press release?</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">{editMode ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <p>Loading press releases...</p>
      ) : pressReleases?.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium">No Press Releases Found</h3>
          <p className="text-gray-500 mb-4">You haven't created any press releases yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pressReleases?.map((release) => (
            <Card key={release.id}>
              <CardHeader>
                <CardTitle>{release.title}</CardTitle>
                <CardDescription>By {release.author} on {new Date(release.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 line-clamp-2">{release.excerpt}</p>
                   {release.image_url && (
                        <a href={release.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 mt-2">
                          <ExternalLink className="w-4 h-4" />
                          Cover Image
                        </a>
                      )}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" onClick={() => setSelectedRelease(release)}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(release.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PressReleaseManager;
