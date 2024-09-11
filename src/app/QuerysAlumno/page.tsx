"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import Table components
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { toast } from '@/components/ui/use-toast';

// Schema de validación con Zod
const studentSchema = z.object({
  id_student: z.string({ required_error: 'El estudiante es obligatorio' }),
});

// Función auxiliar para concatenar clases
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

// Componente principal para citas por estudiante
export function StudentAppointments() {
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      id_student: '',
    },
  });

  // Estados para manejar los estudiantes y citas
  const [students, setStudents] = React.useState([]);
  const [appointments, setAppointments] = React.useState([]);
  const [openStudent, setOpenStudent] = React.useState(false);

  // Efecto para obtener los estudiantes
  React.useEffect(() => {
    fetch('/api/students').then((res) => res.json()).then(setStudents);
  }, []);

  // Función que se ejecuta al enviar el formulario por estudiante
  const onSubmitStudent = async (data: any) => {
    try {
      const response = await fetch('/api/querys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_student: data.id_student,
        }),
      });
      
      if (response.ok) {
        const appointmentData = await response.json();
        setAppointments(appointmentData);  // Actualiza el estado con los resultados de la consulta
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: `Error al obtener la información de citas: ${errorData.error}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al obtener la información de citas.",
      });
      console.error("Error al obtener los datos:", error);
    }
  };

  return (
    <>
      {/* Card para buscar citas por estudiante */}
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Reporte de citas</CardTitle>
          <CardDescription>Selecciona un estudiante para consultar sus citas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitStudent)}>
              <div className="grid w-full items-center gap-5">
                {/* Combobox de estudiante */}
                <FormField
                  control={form.control}
                  name="id_student"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="id_student">Estudiante</FormLabel>
                      <Popover open={openStudent} onOpenChange={setOpenStudent}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openStudent}
                              className={cn(
                                "w-[350px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? students.find((student) => student.id_student === field.value)?.name
                                : 'Selecciona un estudiante'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar estudiante" className="h-9" />
                            <CommandList>
                              <CommandEmpty>No se encontraron estudiantes</CommandEmpty>
                              <CommandGroup>
                                {students.map((student) => (
                                  <CommandItem
                                    key={student.id_student}
                                    value={`${student.id_student} - ${student.name}`}
                                    onSelect={() => {
                                      form.setValue("id_student", student.id_student);
                                      setOpenStudent(false);
                                    }}
                                  >
                                    {student.id_student} - {student.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        student.id_student === field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="flex justify-center mt-4">
                <Button type="submit">Buscar</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>

        {/* Mostrar los resultados en una tabla si hay citas */}
        {appointments.length > 0 && (
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Resultados de citas:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Reservado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                    <TableCell>{appointment.is_reserved ? 'Sí' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </>
  );
}

export default StudentAppointments;
