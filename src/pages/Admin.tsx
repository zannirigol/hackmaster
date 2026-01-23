import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, GraduationCap, Plus, BookOpen, FileText } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { ModuleForm } from '@/components/admin/ModuleForm';
import { LessonForm } from '@/components/admin/LessonForm';
import { ModuleList } from '@/components/admin/ModuleList';

type Module = Tables<'modules'>;
type Lesson = Tables<'lessons'>;

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: rolesLoading } = useRoles();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  
  // Edit states
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [defaultModuleId, setDefaultModuleId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('list');

  // Redirect logic
  useEffect(() => {
    if (!authLoading && !rolesLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, authLoading, rolesLoading, navigate]);

  // Fetch modules
  const fetchModules = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setModules(data || []);
    } catch (err) {
      console.error('Error fetching modules:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os módulos.',
        variant: 'destructive',
      });
    } finally {
      setLoadingModules(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchModules();
    }
  }, [isAdmin, fetchModules]);

  const handleModuleSuccess = (module: Module) => {
    if (editingModule) {
      setModules(prev => prev.map(m => m.id === module.id ? module : m));
      setEditingModule(null);
    } else {
      setModules(prev => [module, ...prev]);
    }
    setActiveTab('list');
  };

  const handleLessonSuccess = (lesson: Lesson) => {
    setEditingLesson(null);
    setDefaultModuleId('');
    setActiveTab('list');
    // Refresh modules list to update lesson counts
    fetchModules();
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setEditingLesson(null);
    setActiveTab('module');
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditingModule(null);
    setActiveTab('lesson');
  };

  const handleAddLesson = (moduleId: string) => {
    setDefaultModuleId(moduleId);
    setEditingLesson(null);
    setEditingModule(null);
    setActiveTab('lesson');
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleCancelEdit = () => {
    setEditingModule(null);
    setEditingLesson(null);
    setDefaultModuleId('');
    setActiveTab('list');
  };

  // Loading state
  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Painel Administrativo
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')} size="sm">
              Ver Dashboard
            </Button>
            <Button variant="outline" onClick={handleSignOut} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loadingModules ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="list" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Conteúdos
                </TabsTrigger>
                <TabsTrigger value="module" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {editingModule ? 'Editar Módulo' : 'Novo Módulo'}
                </TabsTrigger>
                <TabsTrigger value="lesson" className="gap-2">
                  <FileText className="h-4 w-4" />
                  {editingLesson ? 'Editar Lição' : 'Nova Lição'}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="mt-6">
              <ModuleList
                modules={modules}
                onEditModule={handleEditModule}
                onDeleteModule={handleDeleteModule}
                onEditLesson={handleEditLesson}
                onAddLesson={handleAddLesson}
              />
            </TabsContent>

            <TabsContent value="module" className="mt-6">
              <div className="max-w-2xl">
                <ModuleForm
                  editingModule={editingModule}
                  onSuccess={handleModuleSuccess}
                  onCancel={editingModule ? handleCancelEdit : undefined}
                />
              </div>
            </TabsContent>

            <TabsContent value="lesson" className="mt-6">
              <div className="max-w-2xl">
                <LessonForm
                  modules={modules}
                  editingLesson={editingLesson}
                  defaultModuleId={defaultModuleId}
                  onSuccess={handleLessonSuccess}
                  onCancel={editingLesson ? handleCancelEdit : undefined}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Admin;
