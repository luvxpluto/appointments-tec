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
const querySchema = z.object({
  id_professor: z.string({ required_error: 'El profesor es obligatorio' }),
  id_course: z.string({ required_error: 'El curso es obligatorio' }),
});

const studentSchema = z.object({
  id_student: z.string({ required_error: 'El estudiante es obligatorio' }),
});

// Función auxiliar para concatenar clases
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

// Componente principal
export function ProfessorAppointments() {
  const form = useForm<z.infer<typeof querySchema>>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      id_professor: '',
      id_course: '',
    },
  });

  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      id_student: '',
    },
  });

  // Estados para manejar los profesores, cursos, estudiantes y citas
  const [professors, setProfessors] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [appointments, setAppointments] = React.useState([]);
  const [openProfessor, setOpenProfessor] = React.useState(false);
  const [openCourse, setOpenCourse] = React.useState(false);
  const [openStudent, setOpenStudent] = React.useState(false);

  // Efecto para obtener los profesores, cursos y estudiantes
  React.useEffect(() => {
    fetch('/api/professors').then((res) => res.json()).then(setProfessors);
    fetch('/api/courses').then((res) => res.json()).then(setCourses);
    fetch('/api/students').then((res) => res.json()).then(setStudents); // Fetch de estudiantes
  }, []);

  // Función que se ejecuta al enviar el formulario por profesor y curso
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/querys/professor-appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_professor: data.id_professor,
          id_course: data.id_course,
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

  // Función que se ejecuta al enviar el formulario por estudiante
  const onSubmitStudent = async (data: any) => {
    try {
      const response = await fetch(`/api/querys/student-appointments`, {
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
      {/* Card para buscar citas por profesor y curso */}
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Consultar citas</CardTitle>
          <CardDescription>Selecciona un profesor y un curso para consultar sus citas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-5">
                {/* Combobox de profesor */}
                <FormField
                  control={form.control}
                  name="id_professor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="id_professor">Profesor</FormLabel>
                      <Popover open={openProfessor} onOpenChange={setOpenProfessor}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openProfessor}
                              className={cn(
                                "w-[350px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? professors.find((professor) => professor.id_professor === field.value)?.name
                                : 'Selecciona un profesor'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar profesor" className="h-9" />
                            <CommandList>
                              <CommandEmpty>No se encontraron profesores</CommandEmpty>
                              <CommandGroup>
                                {professors.map((professor) => (
                                  <CommandItem
                                    key={professor.id_professor}
                                    value={`${professor.id_professor} - ${professor.name}`}
                                    onSelect={() => {
                                      form.setValue("id_professor", professor.id_professor);
                                      setOpenProfessor(false);
                                    }}
                                  >
                                    {professor.id_professor} - {professor.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        professor.id_professor === field.value ? "opacity-100" : "opacity-0"
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

                {/* Combobox de curso */}
                <FormField
                  control={form.control}
                  name="id_course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="id_course">Curso</FormLabel>
                      <Popover open={openCourse} onOpenChange={setOpenCourse}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCourse}
                              className={cn(
                                "w-[350px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? courses.find((course) => course.id_course === field.value)?.name
                                : 'Selecciona un curso'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar curso" className="h-9" />
                            <CommandList>
                              <CommandEmpty>No se encontraron cursos</CommandEmpty>
                              <CommandGroup>
                                {courses.map((course) => (
                                  <CommandItem
                                    key={course.id_course}
                                    value={`${course.id_course} - ${course.name}`}
                                    onSelect={() => {
                                      form.setValue("id_course", course.id_course);
                                      setOpenCourse(false);
                                    }}
                                  >
                                    {course.id_course} - {course.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        course.id_course === field.value ? "opacity-100" : "opacity-0"
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

      {/* Card para buscar citas por estudiante */}
      <Card className="w-[600px] mt-6">
        <CardHeader>
          <CardTitle>Consultar citas por estudiante</CardTitle>
          <CardDescription>Selecciona un estudiante para consultar sus citas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...studentForm}>
            <form onSubmit={studentForm.handleSubmit(onSubmitStudent)}>
              <div className="grid w-full items-center gap-5">
                {/* Combobox de estudiante */}
                <FormField
                  control={studentForm.control}
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
                                      studentForm.setValue("id_student", student.id_student);
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

export default ProfessorAppointments;
