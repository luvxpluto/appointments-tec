"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "@/components/ui/use-toast";

// Esquema de validación con zod
const schema = z.object({
  id_student: z
    .string()
    .min(1, { message: "El carnet del estudiante es obligatorio" })
    .trim(),
  id_professor_course: z.string().min(1, { message: "Debe seleccionar un curso" }),
  enrollment_count: z
    .string()
    .min(1, { message: "El número de veces debe ser mayor o igual a cero" })
    .refine((value) => !isNaN(parseInt(value, 10)) && parseInt(value, 10) >= 0, {
      message: "El valor debe ser un número mayor o igual a 0",
    }),
});

// Inferir el tipo del esquema
type FormData = z.infer<typeof schema>;

// Tipo para `Course` y `Professor`
type Course = {
  id: string; // id_professor_course
  courseId: string; // ID del curso
  courseName: string;
  professorName: string;
};

export function RegisterStudentCourseForm() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    // Fetch available courses with professors when the component loads
    async function fetchCourses() {
      try {
        const response = await fetch("/api/professor-course"); // Obtener la lista de cursos asignados a profesores
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Convertir `enrollment_count` a número antes de enviarlo al backend
    const formDataWithNumber = {
      ...data,
      enrollment_count: parseInt(data.enrollment_count, 10), // Convertir el valor a número
    };

    try {
      const response = await fetch("/api/student-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithNumber),
      });

      if (response.ok) {
        toast({
          title: "Curso registrado",
          description: "El estudiante ha sido registrado en el curso exitosamente.",
        });
      } else {
        const errorData = await response.json();

        if (response.status === 409) {
          // Si el error es de duplicado (ya registrado)
          toast({
            title: "Error",
            description: "El estudiante ya está registrado en este curso.",
          });
        } else if (response.status === 404) {
          // Si el error es que el carnet no existe
          toast({
            title: "Error",
            description: "El carnet del estudiante no existe.",
          });
        } else {
          toast({
            title: "Error",
            description: errorData.error || "Error al registrar el curso",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar el curso.",
      });
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-lg leading-tight">Registrar curso para estudiante</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Seleccione el curso y proporcione el carnet del estudiante
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-5">
              <FormField
                control={form.control}
                name="id_student"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="id_student">Carnet del estudiante</FormLabel>
                    <FormControl>
                      <Input
                        id="id_student"
                        placeholder="Ingrese su carnet"
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
                name="id_professor_course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleccione un curso</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between truncate",
                              !field.value && "text-muted-foreground"
                            )}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {selectedCourse
                              ? `${selectedCourse.courseId} - ${selectedCourse.courseName} - ${selectedCourse.professorName}`
                              : "Seleccionar curso"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar curso..." />
                          <CommandList>
                            <CommandEmpty>No se encontraron cursos.</CommandEmpty>
                            <CommandGroup>
                              {courses.map((course) => (
                                <CommandItem
                                  key={course.id}
                                  onSelect={() => {
                                    setSelectedCourse(course);
                                    form.setValue("id_professor_course", course.id); // Guardar el ID del curso-profesor
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      course.id === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {`${course.courseId} - ${course.courseName} - ${course.professorName}`}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enrollment_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="enrollment_count">
                      Veces que ha llevado el curso
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="enrollment_count"
                        type="number"
                        placeholder="Ingrese el número de veces"
                        {...field}
                        className="max-w-full"
                        min={0} // Asegura que el número sea mayor o igual a 0
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <CardFooter className="flex justify-center mt-4">
              <Button type="submit">Registrar</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default RegisterStudentCourseForm;