import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, BookOpen, GraduationCap } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Module = Tables<'modules'>;

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  
  // Modules state
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleLevel, setModuleLevel] = useState('beginner');
  const [creatingModule, setCreatingModule] = useState(false);
  
  // Lessons state
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonOrder, setLessonOrder] = useState('0');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [creatingLesson, setCreatingLesson] = useState(false);

  // Check if user has admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (err) {
        console.error('Error:', err);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !checkingRole) {
      if (!user) {
        navigate('/auth');
      } else if (isAdmin === false) {
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, authLoading, checkingRole, navigate]);

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      if (!isAdmin) return;
      
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
    };

    if (isAdmin) {
      fetchModules();
    }
  }, [isAdmin, toast]);

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) {
      toast({
        title: 'Erro',
        description: 'O título do módulo é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    setCreatingModule(true);
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert({
          title: moduleTitle.trim(),
          description: moduleDescription.trim() || null,
          level: moduleLevel,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setModules([data, ...modules]);
      setModuleTitle('');
      setModuleDescription('');
      setModuleLevel('beginner');
      
      toast({
        title: 'Sucesso',
        description: 'Módulo criado com sucesso!',
      });
    } catch (err: any) {
      console.error('Error creating module:', err);
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível criar o módulo.',
        variant: 'destructive',
      });
    } finally {
      setCreatingModule(false);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) {
      toast({
        title: 'Erro',
        description: 'O título da lição é obrigatório.',
        variant: 'destructive',
      });
      return;
    }
    if (!selectedModuleId) {
      toast({
        title: 'Erro',
        description: 'Selecione um módulo.',
        variant: 'destructive',
      });
      return;
    }

    setCreatingLesson(true);
    try {
      const { error } = await supabase
        .from('lessons')
        .insert({
          title: lessonTitle.trim(),
          content: lessonContent.trim() || null,
          order_index: parseInt(lessonOrder) || 0,
          module_id: selectedModuleId,
        });
      
      if (error) throw error;
      
      setLessonTitle('');
      setLessonContent('');
      setLessonOrder('0');
      setSelectedModuleId('');
      
      toast({
        title: 'Sucesso',
        description: 'Lição criada com sucesso!',
      });
    } catch (err: any) {
      console.error('Error creating lesson:', err);
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível criar a lição.',
        variant: 'destructive',
      });
    } finally {
      setCreatingLesson(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Loading state
  if (authLoading || checkingRole) {
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
  if (!user || isAdmin === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Painel Administrativo
          </h1>
          <Button variant="outline" onClick={handleSignOut} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create Module Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Criar Módulo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="module-title">Título *</Label>
                  <Input
                    id="module-title"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    placeholder="Ex: Introdução ao Hacking Ético"
                    disabled={creatingModule}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="module-description">Descrição</Label>
                  <Textarea
                    id="module-description"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    placeholder="Descreva o conteúdo do módulo..."
                    rows={3}
                    disabled={creatingModule}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="module-level">Nível</Label>
                  <Select value={moduleLevel} onValueChange={setModuleLevel} disabled={creatingModule}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" disabled={creatingModule}>
                  {creatingModule ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Módulo'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Create Lesson Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Criar Lição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lesson-module">Módulo *</Label>
                  <Select value={selectedModuleId} onValueChange={setSelectedModuleId} disabled={creatingLesson}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lesson-title">Título *</Label>
                  <Input
                    id="lesson-title"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Ex: O que é Pentest?"
                    disabled={creatingLesson}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lesson-content">Conteúdo (Markdown)</Label>
                  <Textarea
                    id="lesson-content"
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    placeholder="# Título da lição&#10;&#10;Conteúdo em markdown..."
                    rows={5}
                    disabled={creatingLesson}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lesson-order">Ordem</Label>
                  <Input
                    id="lesson-order"
                    type="number"
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(e.target.value)}
                    min="0"
                    disabled={creatingLesson}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={creatingLesson || modules.length === 0}>
                  {creatingLesson ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Lição'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Modules List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Módulos Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingModules ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : modules.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum módulo criado ainda.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {modules.map((module) => (
                  <div key={module.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{module.title}</h3>
                        {module.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {module.level === 'beginner' && 'Iniciante'}
                        {module.level === 'intermediate' && 'Intermediário'}
                        {module.level === 'advanced' && 'Avançado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
