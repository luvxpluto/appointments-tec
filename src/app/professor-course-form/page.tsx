"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { toast } from '@/components/ui/use-toast';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

const fetchCourses = async () => {
    try {
        const response = await fetch('/api/courses'); 
        if (!response.ok) {
            throw new Error('Error al obtener los cursos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
        return [];
    }
};

const fetchProfessors = async () => {
    try {
        const response = await fetch('/api/professors'); 
        if (!response.ok) {
            throw new Error('Error al obtener los profesores');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        return [];
    }
}

const courseProfSchema = z.object({
    id_professor: z.string({ required_error: 'El ID del profesor es obligatorio' }),
    id_course: z.string({ required_error: 'El ID del curso es obligatorio' }),
});

type Course = {
    id_course: string;
    name: string;
};

type Professor = {
    id_professor: string;
    name: string;
};

export function CourseProfForm(){
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [professors, setProfessors] = React.useState<Professor[]>([]);
    const [openCourse, setOpenCourse] = React.useState(false);
    const [openProfessor, setOpenProfessor] = React.useState(false);
    
    React.useEffect(() => {
        fetchCourses().then(setCourses);
        fetchProfessors().then(setProfessors);
    }, []);

    const form = useForm<z.infer<typeof courseProfSchema>>({
        resolver: zodResolver(courseProfSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/professor-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                toast({
                    title: "Curso asignado",
                    description: `El curso ${data.id_course} ha sido asignado exitosamente.`,
                });
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: `${errorData.error}`,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Hubo un problema al asignar el curso.",
            });
            console.error("Error al enviar los datos:", error);
        }
    };

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>Asignar cursos</CardTitle>
                <CardDescription>Ingresa los detalles del curso y el profesor</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-5">
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
                                                                    onSelect={() => {form.setValue("id_professor", professor.id_professor);setOpenProfessor(false)}}
                                                                >
                                                                    {professor.id_professor} - {professor.name}
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            professor.id_professor === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
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
                                                                    value={course.name}
                                                                    onSelect={() => {form.setValue("id_course", course.id_course);
                                                                    setOpenCourse(false)
                                                                    }}
                                                                    
                                                                >
                                                                    {course.name}
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            course.id_course === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
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
                        <CardFooter className="flex justify-center mt-10">
                            <Button type="submit">Asignar</Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default CourseProfForm;
