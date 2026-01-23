import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Module = Tables<'modules'>;

interface ModuleFormProps {
  editingModule?: Module | null;
  onSuccess: (module: Module) => void;
  onCancel?: () => void;
}

export const ModuleForm = ({ editingModule, onSuccess, onCancel }: ModuleFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(editingModule?.title || '');
  const [description, setDescription] = useState(editingModule?.description || '');
  const [level, setLevel] = useState(editingModule?.level || 'beginner');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!editingModule;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Erro',
        description: 'O título do módulo é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        const { data, error } = await supabase
          .from('modules')
          .update({
            title: title.trim(),
            description: description.trim() || null,
            level,
          })
          .eq('id', editingModule.id)
          .select()
          .single();

        if (error) throw error;
        
        toast({
          title: 'Sucesso',
          description: 'Módulo atualizado com sucesso!',
        });
        onSuccess(data);
      } else {
        const { data, error } = await supabase
          .from('modules')
          .insert({
            title: title.trim(),
            description: description.trim() || null,
            level,
          })
          .select()
          .single();

        if (error) throw error;
        
        setTitle('');
        setDescription('');
        setLevel('beginner');
        
        toast({
          title: 'Sucesso',
          description: 'Módulo criado com sucesso!',
        });
        onSuccess(data);
      }
    } catch (err: any) {
      console.error('Error saving module:', err);
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível salvar o módulo.',
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
          <BookOpen className="h-5 w-5" />
          {isEditing ? 'Editar Módulo' : 'Criar Módulo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module-title">Título *</Label>
            <Input
              id="module-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Introdução ao Hacking Ético"
              disabled={submitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="module-description">Descrição</Label>
            <Textarea
              id="module-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do módulo..."
              rows={3}
              disabled={submitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="module-level">Nível</Label>
            <Select value={level} onValueChange={setLevel} disabled={submitting}>
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
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Módulo'
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
