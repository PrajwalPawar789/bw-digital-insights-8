
import React, { useState } from 'react';
import { useArticles, useDeleteArticle } from '@/hooks/useArticles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ArticleManager = () => {
  const { data: articles = [], isLoading, error } = useArticles();
  const deleteArticle = useDeleteArticle();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteArticle.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
        <span className="ml-2">Loading articles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load articles</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 mb-4">No articles found</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create First Article
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                  <CardDescription className="mb-3">
                    {article.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</span>
                    <span>•</span>
                    <Badge variant={article.featured ? "default" : "secondary"}>
                      {article.featured ? "Featured" : "Regular"}
                    </Badge>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                    disabled={deletingId === article.id}
                  >
                    {deletingId === article.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticleManager;
