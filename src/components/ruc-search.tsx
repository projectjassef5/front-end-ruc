"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchRucData } from "@/app/actions/ruc";
import type { RucData } from "@/types/ruc";
import { RucInfoCard } from "@/components/ruc-info-card";

const formSchema = z.object({
  ruc: z.string()
    .length(11, { message: "El RUC debe tener 11 dígitos." })
    .regex(/^[0-9]+$/, { message: "El RUC solo debe contener números." }),
});

export function RucSearch() {
  const [result, setResult] = useState<RucData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ruc: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setResult(null);
    const apiResult = await fetchRucData(values.ruc);
    
    if (apiResult.error) {
      toast({
        variant: "destructive",
        title: "Error en la consulta",
        description: apiResult.error,
      });
    } else if (apiResult.data) {
      setResult(apiResult.data);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-3xl mx-auto border-primary/20">
        <CardHeader>
          <CardTitle>Formulario de Consulta</CardTitle>
          <CardDescription>
            Ingrese el número de RUC que desea consultar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="ruc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de RUC</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 20131312955" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Consultar
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="max-w-3xl mx-auto">
            <RucInfoCard data={result} />
        </div>
      )}
    </div>
  );
}
