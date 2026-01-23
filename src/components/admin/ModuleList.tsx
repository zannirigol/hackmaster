import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  ChevronDown, 
  ChevronRight, 
  Pencil, 
  Trash2,
  BookOpen,
  FileText,
  Plus
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tables } from '@/integrations/supabase/types';

type Module = Tables<'modules'>;
type Lesson = Tables<'lessons'>;

interface ModuleListProps {
  modules: Module[];
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onEditLesson: (lesson: Lesson) => void;
  onAddLesson: (moduleId: string) => void;
}

const getLevelLabel = (level: string) => {
  switch (level) {
    case 'beginner': return 'Iniciante';
    case 'intermediate': return 'Intermediário';
    case 'advanced': return 'Avançado';
    default: return level;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner': return 'bg-green-500/10 text-green-500';
    case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
    case 'advanced': return 'bg-red-500/10 text-red-500';
    default: return 'bg-primary/10 text-primary';
  }
};

export const ModuleList = ({ 
  modules, 
  onEditModule, 
  onDeleteModule,
  onEditLesson,
  onAddLesson
}: ModuleListProps) => {
  const { toast } = useToast();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [loadingLessons, setLoadingLessons] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'module' | 'lesson'; id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toggleModule = async (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
      
      // Fetch lessons if not already loaded
      if (!lessons[moduleId]) {
        await fetchLessons(moduleId);
      }
    }
    
    setExpandedModules(newExpanded);
  };

  const fetchLessons = async (moduleId: string) => {
    setLoadingLessons(prev => new Set(prev).add(moduleId));
    
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      setLessons(prev => ({ ...prev, [moduleId]: data || [] }));
    } catch (err) {
      console.error('Error fetching lessons:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as lições.',
        variant: 'destructive',
      });
    } finally {
      setLoadingLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    
    setDeleting(true);
    try {
      if (deleteDialog.type === 'module') {
        const { error } = await supabase
          .from('modules')
          .delete()
          .eq('id', deleteDialog.id);
        
        if (error) throw error;
        
        onDeleteModule(deleteDialog.id);
        toast({
          title: 'Sucesso',
          description: 'Módulo excluído com sucesso!',
        });
      } else {
        const { error } = await supabase
          .from('lessons')
          .delete()
          .eq('id', deleteDialog.id);
        
        if (error) throw error;
        
        // Update local lessons state
        setLessons(prev => {
          const updated = { ...prev };
          for (const moduleId in updated) {
            updated[moduleId] = updated[moduleId].filter(l => l.id !== deleteDialog.id);
          }
          return updated;
        });
        
        toast({
          title: 'Sucesso',
          description: 'Lição excluída com sucesso!',
        });
      }
    } catch (err: any) {
      console.error('Error deleting:', err);
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível excluir.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteDialog(null);
    }
  };

  // Refresh lessons when a lesson is edited
  const refreshLessonsForModule = async (moduleId: string) => {
    await fetchLessons(moduleId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Módulos e Lições
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum módulo criado ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {modules.map((module) => (
                <Collapsible
                  key={module.id}
                  open={expandedModules.has(module.id)}
                  onOpenChange={() => toggleModule(module.id)}
                >
                  <div className="border border-border rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          {expandedModules.has(module.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <h3 className="font-medium text-foreground">{module.title}</h3>
                            {module.description && (
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(module.level)}`}>
                            {getLevelLabel(module.level)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditModule(module);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({ type: 'module', id: module.id, title: module.title });
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="border-t border-border bg-muted/30 p-4">
                        {loadingLessons.has(module.id) ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        ) : (
                          <>
                            {lessons[module.id]?.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhuma lição neste módulo.
                              </p>
                            ) : (
                              <div className="space-y-2 mb-4">
                                {lessons[module.id]?.map((lesson, index) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center justify-between p-3 bg-background rounded-md border border-border"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-muted-foreground font-mono w-6">
                                        #{lesson.order_index}
                                      </span>
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">{lesson.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onEditLesson(lesson)}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setDeleteDialog({ 
                                          type: 'lesson', 
                                          id: lesson.id, 
                                          title: lesson.title 
                                        })}
                                      >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => onAddLesson(module.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Lição
                            </Button>
                          </>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {deleteDialog?.type === 'module' ? 'o módulo' : 'a lição'}{' '}
              <strong>"{deleteDialog?.title}"</strong>?
              {deleteDialog?.type === 'module' && (
                <span className="block mt-2 text-destructive">
                  Isso também excluirá todas as lições deste módulo.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
