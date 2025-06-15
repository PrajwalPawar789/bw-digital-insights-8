import React, { useState, useEffect } from 'react';
import { useMagazines, useCreateMagazine, useUpdateMagazine, useDeleteMagazine } from '@/hooks/useMagazines';
import { useArticles } from '@/hooks/useArticles';
import { useMagazineArticles } from '@/hooks/useMagazineArticles';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useCreateMagazineArticle } from '@/hooks/useMagazineArticles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit2, Trash2, Plus, Upload, FileText, Calendar, Hash, Star, ExternalLink } from 'lucide-react';
import { slugify } from '@/lib/slugify';

interface Magazine {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  pdf_url: string;
  publish_date: string;
  issue_number: number;
  featured: boolean;
  featured_article_id: string | null;
}

const MagazineManager = () => {
  const { data: magazines, isLoading, refetch } = useMagazines();
  const { data: articles } = useArticles();
  const { mutate: createMagazine } = useCreateMagazine();
  const { mutate: updateMagazine } = useUpdateMagazine();
  const { mutate: deleteMagazine } = useDeleteMagazine();
  const { uploadImage, uploadPdf, uploading } = useImageUpload();
  const { mutate: createMagazineArticle } = useCreateMagazineArticle();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [issueNumber, setIssueNumber] = useState<number | ''>('' as number | '');
  const [featured, setFeatured] = useState(false);
  const [featuredArticleId, setFeaturedArticleId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<'image' | 'pdf' | null>(null);

  useEffect(() => {
    if (selectedMagazine) {
      setEditMode(true);
      setTitle(selectedMagazine.title);
      setSlug(selectedMagazine.slug);
      setDescription(selectedMagazine.description);
      setCoverImageUrl(selectedMagazine.cover_image_url);
      setPdfUrl(selectedMagazine.pdf_url);
      setPublishDate(selectedMagazine.publish_date);
      setIssueNumber(selectedMagazine.issue_number);
      setFeatured(selectedMagazine.featured);
      setFeaturedArticleId(selectedMagazine.featured_article_id);
      setOpen(true);
    } else {
      setEditMode(false);
      setTitle('');
      setSlug('');
      setDescription('');
      setCoverImageUrl('');
      setPdfUrl('');
      setPublishDate('');
      setIssueNumber('' as number | '');
      setFeatured(false);
      setFeaturedArticleId(null);
    }
  }, [selectedMagazine]);

  const resetForm = () => {
    setSelectedMagazine(null);
    setEditMode(false);
    setTitle('');
    setSlug('');
    setDescription('');
    setCoverImageUrl('');
    setPdfUrl('');
    setPublishDate('');
    setIssueNumber('' as number | '');
    setFeatured(false);
    setFeaturedArticleId(null);
    setUploadingFile(null);
  };

  const handleCreateMagazine = async () => {
    if (!title || !description || !publishDate) {
      toast.error("Please fill in all required fields (title, description, publish date).");
      return;
    }

    const newMagazine = {
      title,
      slug: slug || slugify(title),
      description,
      cover_image_url: coverImageUrl,
      pdf_url: pdfUrl,
      publish_date: publishDate,
      issue_number: issueNumber !== '' ? Number(issueNumber) : null,
      featured,
      featured_article_id: featuredArticleId,
    };

    console.log('Creating magazine:', newMagazine);

    createMagazine(newMagazine, {
      onSuccess: (createdMagazine) => {
        console.log('Magazine created successfully:', createdMagazine);
        
        if (featuredArticleId && createdMagazine?.id) {
          console.log('Adding featured article to magazine');
          createMagazineArticle({
            magazine_id: createdMagazine.id,
            article_id: featuredArticleId,
            featured: true,
            page_number: 1,
          });
        }
        
        setOpen(false);
        resetForm();
        refetch();
      },
      onError: (error) => {
        console.error('Error creating magazine:', error);
      }
    });
  };

  const handleUpdateMagazine = async () => {
    if (!selectedMagazine?.id) return;

    if (!title || !description || !publishDate) {
      toast.error("Please fill in all required fields (title, description, publish date).");
      return;
    }

    const updatedMagazine = {
      id: selectedMagazine.id,
      title,
      slug: slug || slugify(title),
      description,
      cover_image_url: coverImageUrl,
      pdf_url: pdfUrl,
      publish_date: publishDate,
      issue_number: issueNumber !== '' ? Number(issueNumber) : null,
      featured,
      featured_article_id: featuredArticleId,
    };

    console.log('Updating magazine:', updatedMagazine);

    updateMagazine(updatedMagazine, {
      onSuccess: (magazine) => {
        console.log('Magazine updated successfully:', magazine);
        
        if (featuredArticleId && magazine?.id) {
          console.log('Adding featured article to magazine');
          createMagazineArticle({
            magazine_id: magazine.id,
            article_id: featuredArticleId,
            featured: true,
            page_number: 1,
          });
        }
        
        setOpen(false);
        resetForm();
        refetch();
      },
      onError: (error) => {
        console.error('Error updating magazine:', error);
      }
    });
  };

  const handleDeleteMagazine = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this magazine? This action cannot be undone.")) {
      deleteMagazine(id, {
        onError: (error) => {
          console.error('Error deleting magazine:', error);
        }
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingFile('image');
      console.log('Uploading cover image:', file.name);
      const imageUrl = await uploadImage(file, "magazines");
      setCoverImageUrl(imageUrl);
      toast.success("Cover image uploaded successfully");
      setUploadingFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
      setUploadingFile(null);
    }
  };

  const handlePdfUpload = async (file: File) => {
    try {
      setUploadingFile('pdf');
      console.log('Uploading PDF:', file.name);
      const pdfUrl = await uploadPdf(file, "magazine-pdfs");
      setPdfUrl(pdfUrl);
      toast.success("PDF uploaded successfully");
      setUploadingFile(null);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error("Failed to upload PDF");
      setUploadingFile(null);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Magazines</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Create Magazine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Magazine' : 'Create New Magazine'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Edit the magazine details.' : 'Add a new magazine to the website.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title *
                </Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">
                  Slug
                </Label>
                <Input 
                  id="slug" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="Auto-generated from title"
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description *
                </Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="coverImage" className="text-right">
                  Cover Image
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input 
                    type="file" 
                    id="coverImage" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }} 
                    className="hidden" 
                  />
                  <Label htmlFor="coverImage" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md px-3 py-2 text-sm cursor-pointer inline-block">
                    {uploadingFile === 'image' ? 'Uploading...' : 'Upload Cover Image'}
                  </Label>
                  {coverImageUrl && (
                    <div className="flex items-center gap-2">
                      <a href={coverImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                        View Current Image
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pdf" className="text-right">
                  PDF File
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input 
                    type="file" 
                    id="pdf" 
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handlePdfUpload(e.target.files[0]);
                      }
                    }} 
                    className="hidden" 
                  />
                  <Label htmlFor="pdf" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md px-3 py-2 text-sm cursor-pointer inline-block">
                    {uploadingFile === 'pdf' ? 'Uploading...' : 'Upload PDF'}
                  </Label>
                  {pdfUrl && (
                    <div className="flex items-center gap-2">
                      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                        View Current PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="publishDate" className="text-right">
                  Publish Date *
                </Label>
                <Input type="date" id="publishDate" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issueNumber" className="text-right">
                  Issue Number
                </Label>
                <Input
                  type="number"
                  id="issueNumber"
                  value={issueNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    setIssueNumber(val === '' ? '' : Number(val));
                  }}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featuredArticle" className="text-right">
                  Featured Article
                </Label>
                <Select 
                  value={featuredArticleId || "none"} 
                  onValueChange={(value) => setFeaturedArticleId(value === "none" ? null : value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select featured article (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No featured article</SelectItem>
                    {articles?.map((article) => (
                      <SelectItem key={article.id} value={article.id}>
                        {article.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featured" className="text-right">
                  Featured
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch id="featured" checked={featured} onCheckedChange={(checked) => setFeatured(checked)} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={editMode ? handleUpdateMagazine : handleCreateMagazine} className="flex-1">
                {editMode ? 'Update Magazine' : 'Create Magazine'}
              </Button>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading magazines...</p>
          </div>
        ) : magazines?.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Magazines Found</h3>
            <p className="text-gray-500 mb-4">You haven't created any magazines yet.</p>
            <Button onClick={() => setOpen(true)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Create Your First Magazine
            </Button>
          </div>
        ) : (
          magazines?.map((magazine) => {
            const featuredArticle = articles?.find(article => article.id === magazine.featured_article_id);
            
            return (
              <Card key={magazine.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {magazine.title}
                    {magazine.featured && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                  </CardTitle>
                  <CardDescription>{magazine.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Published: {new Date(magazine.publish_date).toLocaleDateString()}</p>
                    {magazine.issue_number && <p className="text-sm text-gray-500">Issue: {magazine.issue_number}</p>}
                    {featuredArticle && <p className="text-sm text-gray-500">Featured Article: {featuredArticle.title}</p>}
                    <div className="flex gap-2 mt-2">
                      {magazine.cover_image_url && (
                        <a href={magazine.cover_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                          Cover Image
                        </a>
                      )}
                      {magazine.pdf_url && (
                        <a href={magazine.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="icon" onClick={() => setSelectedMagazine(magazine)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteMagazine(magazine.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MagazineManager;
