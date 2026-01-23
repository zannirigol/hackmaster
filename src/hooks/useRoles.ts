import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UseRolesReturn {
  roles: AppRole[];
  isAdmin: boolean;
  isModerator: boolean;
  isUser: boolean;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useRoles = (): UseRolesReturn => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = async () => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      const userRoles = data?.map((r) => r.role) || [];
      setRoles(userRoles);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch roles'));
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [user?.id]);

  return {
    roles,
    isAdmin: roles.includes('admin'),
    isModerator: roles.includes('moderator'),
    isUser: roles.includes('user'),
    loading,
    error,
    refetch: fetchRoles,
  };
};
