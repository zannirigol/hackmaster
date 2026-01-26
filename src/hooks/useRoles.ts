import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRolesReturn {
  isAdmin: boolean;
  loading: boolean;
}

export const useRoles = (): UseRolesReturn => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRoles = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const authUser = userData?.user;

      if (!authUser) {
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id);

      console.log('ROLES FROM DB:', data, error);

      if (!cancelled) {
        setIsAdmin(Boolean(data?.some((r) => r.role === 'admin')));
        setLoading(false);
      }
    };

    fetchRoles();

    return () => {
      cancelled = true;
    };
  }, []);

  return { isAdmin, loading };
};
