import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Module = Tables<'modules'>;
type Lesson = Tables<'lessons'>;

interface LessonFormProps {
  modules: Module[];
  editingLesson?: Lesson | null;
  defaultModuleId?: string;
  onSuccess: (lesson: Lesson) => void;
  onCancel?: () => void;
}

export const LessonForm = ({ 
  modules, 
  editingLesson, 
  defaultModuleId,
  onSuccess, 
  onCancel 
}: LessonFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(editingLesson?.title || '');
  const [content, setContent] = useState(editingLesson?.content || '');
  const [orderIndex, setOrderIndex] = useState(String(editingLesson?.order_index || 0));
  const [moduleId, setModuleId] = useState(editingLesson?.module_id || defaultModuleId || '');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!editingLesson;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Erro',
        description: 'O título da lição é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (!moduleId) {
      toast({
        title: 'Erro',
        description: 'Selecione um módulo.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        const { data, error } = await supabase
          .from('lessons')
          .update({
            title: title.trim(),
            content: content.trim() || null,
            order_index: parseInt(orderIndex) || 0,
            module_id: moduleId,
          })
          .eq('id', editingLesson.id)
          .select()
          .single();

        if (error) throw error;
        
        toast({
          title: 'Sucesso',
          description: 'Lição atualizada com sucesso!',
        });
        onSuccess(data);
      } else {
        const { data, error } = await supabase
          .from('lessons')
          .insert({
            title: title.trim(),
            content: content.trim() || null,
            order_index: parseInt(orderIndex) || 0,
            module_id: moduleId,
          })
          .select()
          .single();

        if (error) throw error;
        
        setTitle('');
        setContent('');
        setOrderIndex('0');
        
        toast({
          title: 'Sucesso',
          description: 'Lição criada com sucesso!',
        });
        onSuccess(data);
      }
    } catch (err: any) {
      console.error('Error saving lesson:', err);
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível salvar a lição.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {isEditing ? 'Editar Lição' : 'Criar Lição'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lesson-module">Módulo *</Label>
            <Select value={moduleId} onValueChange={setModuleId} disabled={submitting}>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: O que é Pentest?"
              disabled={submitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lesson-content">Conteúdo (Markdown)</Label>
            <Textarea
              id="lesson-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Título da lição&#10;&#10;Conteúdo em markdown..."
              rows={6}
              disabled={submitting}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lesson-order">Ordem</Label>
            <Input
              id="lesson-order"
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(e.target.value)}
              min="0"
              disabled={submitting}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={submitting || modules.length === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Lição'
              )}
            </Button>
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
