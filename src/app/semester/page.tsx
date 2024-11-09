"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

// Esquema de validación con zod para fechas de semestre
const schema = z
  .object({
    start_date: z.string().nonempty("La fecha de inicio es obligatoria"),
    end_date: z.string().nonempty("La fecha de fin es obligatoria"),
  })
  .refine(
    (data) => new Date(data.end_date) > new Date(data.start_date),
    {
      message: "La fecha de fin debe ser posterior a la de inicio",
      path: ["end_date"], // Marca el campo `end_date` como el que tiene el error
    }
  );

type FormData = z.infer<typeof schema>;

export function SemesterAdminForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [currentSemester, setCurrentSemester] = React.useState(null);

  // Obtener el semestre actual
  const fetchCurrentSemester = async () => {
    try {
      const response = await fetch("/api/semester", {
        method: "GET",
      });
      const data = await response.json();
      setCurrentSemester(data);
    } catch (error) {
      console.error("Error al obtener el semestre actual:", error);
    }
  };

  React.useEffect(() => {
    fetchCurrentSemester();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch("/api/semester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: data.start_date,
          end_date: data.end_date,
        }),
      });

      if (response.ok) {
        toast({
          title: "Semestre creado",
          description: "El semestre ha sido creado exitosamente.",
        });
        fetchCurrentSemester(); // Actualizar el semestre actual
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Error al crear el semestre.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear el semestre.",
      });
      console.error("Error:", error);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-lg leading-tight">Administración de Semestres</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Cree un nuevo semestre ingresando las fechas de inicio y fin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-5">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="start_date">Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input
                        id="start_date"
                        type="date"
                        placeholder="Seleccione la fecha de inicio"
                        {...field}
                        className="max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="end_date">Fecha de Fin</FormLabel>
                    <FormControl>
                      <Input
                        id="end_date"
                        type="date"
                        placeholder="Seleccione la fecha de fin"
                        {...field}
                        className="max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <CardFooter className="flex justify-center mt-4">
              <Button type="submit">Crear Semestre</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
      {currentSemester && (
        <div className="p-4 text-center text-gray-700 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <h3 className="font-semibold">Semestre Actual</h3>
          <p>Inicio: {new Date(currentSemester.start_date).toLocaleDateString()}</p>
          <p>Fin: {new Date(currentSemester.end_date).toLocaleDateString()}</p>
        </div>
      )}
    </Card>
  );
}

export default SemesterAdminForm;
