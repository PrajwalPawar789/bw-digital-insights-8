
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
import { Upload, X } from 'lucide-react';

interface CreateArticleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateArticleForm = ({ open, onOpenChange }: CreateArticleFormProps) => {
  const { mutate: createArticle, isPending } = useCreateArticle();
  const { uploadImage, uploading } = useImageUpload();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const categories = ['Technology', 'Business', 'Leadership', 'Innovation', 'Strategy', 'Finance', 'Marketing'];

  const handleImageUpload = async (file: File) => {
    try {
      console.log('Starting image upload...', file.name, file.type);
      setSelectedFile(file);
      const url = await uploadImage(file, "articles");
      console.log('Image uploaded successfully:', url);
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setSelectedFile(null);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setSelectedFile(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      handleImageUpload(file);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('article-image-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
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

    console.log('Creating article with data:', articleData);
    createArticle(articleData, {
      onSuccess: () => {
        toast.success('Article created successfully');
        onOpenChange(false);
        resetForm();
      },
      onError: (error) => {
        console.error('Failed to create article:', error);
        toast.error('Failed to create article');
      }
    });
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
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Article</DialogTitle>
          <DialogDescription>
            Add a new article to your website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
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
              placeholder="Brief description of the article"
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
              placeholder="Write your article content here"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
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
            <div className="space-y-3">
              {!imageUrl ? (
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    id="article-image-input"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={uploading} 
                    className="w-full"
                    onClick={triggerFileInput}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">Image uploaded successfully</p>
                        <p className="text-xs text-green-600">{selectedFile?.name || 'Image ready'}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {imageUrl && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
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

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isPending || uploading}
            >
              {isPending ? 'Creating...' : 'Create Article'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateArticleForm;
