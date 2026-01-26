import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Module = Tables<'modules'>;
type Lesson = Tables<'lessons'>;

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export const useModules = () => {
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: true });

      if (modulesError) throw modulesError;

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      // Combine modules with their lessons
      const modulesWithLessons: ModuleWithLessons[] = (modulesData || []).map((mod) => ({
        ...mod,
        lessons: (lessonsData || []).filter((lesson) => lesson.module_id === mod.id),
      }));

      setModules(modulesWithLessons);
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch modules'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return { modules, loading, error, refetch: fetchModules };
};
