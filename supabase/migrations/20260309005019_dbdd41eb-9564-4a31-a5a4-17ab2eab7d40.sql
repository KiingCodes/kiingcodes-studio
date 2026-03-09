-- Allow admins to update chat_leads
CREATE POLICY "Admins can update leads"
ON public.chat_leads
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete chat_leads
CREATE POLICY "Admins can delete leads"
ON public.chat_leads
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));