-- Enable Row Level Security on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read their own data"
ON public.users
FOR SELECT
USING (id = auth.uid());

-- Policy: Users can update their own data
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
USING (id = auth.uid());

-- Policy: Admins can manage all users
CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));