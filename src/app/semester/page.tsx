"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Validación de formulario con Zod
const semesterSchema = z
  .object({
    start_date: z.date({ required_error: "La fecha de inicio es obligatoria" }),
    end_date: z.date({ required_error: "La fecha de fin es obligatoria" }),
  })
  .refine(
    (data) => data.end_date > data.start_date, // Comparación a nivel de objeto
    {
      path: ["end_date"], // Apunta al campo end_date si falla la validación
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
    }
  );

export function CreateSemesterForm() {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const form = useForm({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      start_date: null,
      end_date: null,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/semester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("El semestre ha sido creado exitosamente.");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("Hubo un problema al crear el semestre.");
      console.error("Error al crear el semestre:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-[600px]">
            <CardHeader>
              <CardTitle>Crear Semestre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* Fecha de inicio */}
                <FormItem>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      form.setValue("start_date", date);
                    }}
                  />
                </FormItem>

                {/* Fecha de fin */}
                <FormItem>
                  <FormLabel>Fecha de fin</FormLabel>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      form.setValue("end_date", date);
                    }}
                  />
                </FormItem>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Crear Semestre</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <ToastContainer /> {/* Asegúrate de que esto esté presente */}
    </>
  );
}

export default CreateSemesterForm;
