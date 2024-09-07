"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Root as SliderRoot, Track as SliderTrack, Range as SliderRange, Thumb as SliderThumb } from '@radix-ui/react-slider';

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { toast } from '@/components/ui/use-toast';


// Esquema modificado para aceptar el id como string
const courseSchema = z.object({
  id_course: z.string({ required_error: 'El curso es obligatorio' }),
  id_student: z.string({ required_error: 'El estudiante es obligatorio' }),
});

const Slider = ({ className, ...props }) => (
  <SliderRoot
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderTrack className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderRange className="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderRoot>
);

export { Slider };

export function StudentForm() {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      id_course: '',
      id_student: '',
    },
  });

  const [courses, setCourses] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [openCourse, setOpenCourse] = React.useState(false);
  const [openStudent, setOpenStudent] = React.useState(false);
  const [rating, setRating] = React.useState(0);

  React.useEffect(() => {
    // Fetch courses and students data
    fetch('/api/courses').then((res) => res.json()).then(setCourses);
    fetch('/api/students').then((res) => res.json()).then(setStudents);
  }, []);

  const handleSliderChange = (value: number[]) => {
    setRating(value[0]);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-4xl ${rating >= i ? "text-yellow-500" : "text-gray-300"}`}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/professor-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_student: data.id_student,
          id_course: data.id_course,
          stars_rating: rating, // Envía la calificación (rating)
        }),
      });

      if (response.ok) {
        toast({
          title: "Calificación registrada",
          description: `La calificación ha sido registrada exitosamente.`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: `Error al registrar la calificación: ${errorData.error}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar la calificación.",
      });
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Registrar calificación de alumno</CardTitle>
        <CardDescription>Elige un curso y un estudiante para asignar una calificación.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-5">
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
                                    setOpenCourse(false); // Cierra el Popover al seleccionar
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
                                    setOpenStudent(false); // Cierra el Popover al seleccionar
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

              {/* Estrellas de calificación */}
              <div className="flex items-center justify-center mb-4">
                {renderStars()}
                <span className="ml-2 text-gray-700">{rating}</span>
              </div>

              {/* Slider de calificación */}
              <Slider
                defaultValue={[1]}
                min={1}
                max={5}
                step={1} // Cambiado a enteros
                onValueChange={(value) => setRating(value[0])}
                className="w-full"
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

export default StudentForm;