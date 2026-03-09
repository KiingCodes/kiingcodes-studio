-- Enable realtime for client_projects and service_requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;