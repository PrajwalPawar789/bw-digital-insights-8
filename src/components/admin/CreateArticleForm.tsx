
import React, { useState } from 'react';
import { useCreateArticle } from '@/hooks/useArticles';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { slugify } from '@/lib/slugify';
import { Upload } from 'lucide-react';

interface CreateArticleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateArticleForm = ({ open, onOpenChange }: CreateArticleFormProps) => {
  const { mutate: createArticle } = useCreateArticle();
  const { uploadImage, uploading } = useImageUpload();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  const categories = ['Technology', 'Business', 'Leadership', 'Innovation', 'Strategy', 'Finance', 'Marketing'];

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, "articles");
      setImageUrl(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !excerpt || !content || !author || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const articleData = {
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      author,
      category,
      image_url: imageUrl,
      featured,
      date: new Date().toISOString(),
    };

    createArticle(articleData);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setAuthor('');
    setCategory('');
    setImageUrl('');
    setFeatured(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Article</DialogTitle>
          <DialogDescription>
            Add a new article to your website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Auto-generated from title"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="image">Featured Image</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <Label htmlFor="image" className="cursor-pointer">
                <Button type="button" variant="outline" disabled={uploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Label>
              {imageUrl && (
                <span className="text-sm text-green-600">Image uploaded</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
            />
            <Label htmlFor="featured">Featured Article</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Article
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateArticleForm;
