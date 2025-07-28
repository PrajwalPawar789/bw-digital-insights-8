
import React, { useState } from 'react';
import { useLeadershipProfiles, useDeleteLeadership } from '@/hooks/useLeadership';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import CreateLeaderForm from './CreateLeaderForm';
import EditLeaderForm from './EditLeaderForm';

const LeaderManager = () => {
  const { data: leaders = [], isLoading, error } = useLeadershipProfiles();
  const deleteLeader = useDeleteLeadership();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this leadership profile?')) {
      setDeletingId(id);
      try {
        await deleteLeader.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete leader:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (leader: any) => {
    setSelectedLeader(leader);
    setEditFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
        <span className="ml-2">Loading leadership profiles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load leadership profiles</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Leadership Management</h2>
          <p className="text-gray-600">Manage leadership profiles</p>
        </div>
        <Button onClick={() => setCreateFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Profile
        </Button>
      </div>

      {leaders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No leadership profiles found</p>
            <Button onClick={() => setCreateFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {leaders.map((leader) => (
            <Card key={leader.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'}
                      alt={leader.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{leader.name}</CardTitle>
                      <CardDescription className="mb-2">{leader.title}</CardDescription>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {leader.bio.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={leader.featured ? "default" : "secondary"}>
                          {leader.featured ? "Featured" : "Regular"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(leader)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(leader.id)}
                      disabled={deletingId === leader.id}
                    >
                      {deletingId === leader.id ? (
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
      )}

      <CreateLeaderForm 
        open={createFormOpen} 
        onOpenChange={setCreateFormOpen} 
      />

      {selectedLeader && (
        <EditLeaderForm
          leader={selectedLeader}
          open={editFormOpen}
          onOpenChange={(open) => {
            setEditFormOpen(open);
            if (!open) setSelectedLeader(null);
          }}
        />
      )}
    </div>
  );
};

export default LeaderManager;
