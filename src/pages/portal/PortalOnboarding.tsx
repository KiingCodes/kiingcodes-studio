import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

export default function PortalOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch } = useForm();

  // Check if company already exists
  const { data: existingCompany } = useQuery({
    queryKey: ["client-company", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("client_companies")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Redirect if already onboarded
  if (existingCompany?.onboarding_completed) {
    navigate("/portal");
    return null;
  }

  const createCompany = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("client_companies").insert({
        ...data,
        user_id: user!.id,
        onboarding_completed: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-company"] });
      toast.success("Welcome to JewelIQ Client Portal!");
      navigate("/portal");
    },
    onError: () => {
      toast.error("Failed to complete onboarding");
    },
  });

  const onSubmit = (data: any) => {
    createCompany.mutate(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4"
    >
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <motion.img 
            src="/src/assets/jeweliq-logo.png" 
            alt="JewelIQ" 
            className="h-24 mx-auto mb-4"
            initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: 360
            }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { duration: 0.5, ease: "easeOut" },
              rotate: { duration: 1, ease: "easeInOut" }
            }}
          />
          <CardTitle className="text-3xl">Welcome to JewelIQ Client Portal</CardTitle>
          <CardDescription>
            Let's set up your company profile to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                {...register("company_name", { required: true })}
                placeholder="Your Company Ltd."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setValue("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <Select onValueChange={(value) => setValue("company_size", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...register("website")}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+27 12 345 6789"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Street, City, Province, Postal Code"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={createCompany.isPending}>
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
