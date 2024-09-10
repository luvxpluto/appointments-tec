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

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

const fetchStudents = async () => {
    try {
        const response = await fetch('/api/students'); 
        if (!response.ok) {
            throw new Error('Error al obtener los estudiantes');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        return [];
    }
}

// Function to fetch professor courses
const fetchProfessorCourses = async (studentId: string) => {
    try {
        const response = await fetch(`/api/appointments/${studentId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los cursos del profesor');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
        return [];
    }
};

const appointmentCourseSchema = z.object({
    id_student: z.string({ required_error: 'El ID del estudiante es obligatorio' }),
    professorCourseId: z.string({ required_error: 'El ID del curso del profesor es obligatorio' }),
});

type Student = {
    id_student: string;
    name: string;
};
type ProfessorCourse = {
    professorCourseId: string;
    courseCode: string;
    courseName: string;
    professorName: string;
    totalAppointments: number;
    reservedAppointments: number;
    schedules: {
        day: string;
        startTime: string;
        endTime: string;
    }[];
};

export function AppointmentCourseForm(){
    const [openStudent, setOpenStudent] = React.useState(false);
    const [students, setStudents] = React.useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = React.useState<string | null>(null);
    const [openCourse, setOpenCourse] = React.useState(false);
    const [professorCourses, setProfessorCourses] = React.useState<ProfessorCourse[]>([]);
    const [loading, setLoading] = React.useState(false);
    
    React.useEffect(() => {
        fetchStudents().then(setStudents);
    }, []);

    React.useEffect(() => {
        if (selectedStudent) {
            setLoading(true);
            fetchProfessorCourses(selectedStudent).then(setProfessorCourses).finally(() => {
                setLoading(false);
            });
        }
    }, [selectedStudent]);

    const form = useForm<z.infer<typeof appointmentCourseSchema>>({
        resolver: zodResolver(appointmentCourseSchema),
    });

    const onSubmit = async (data: any) => {
        
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="w-[1000px]">
                    <CardHeader>
                        <CardTitle>Solicitar cita</CardTitle>
                        <CardDescription>Ingresa tu carnet y el curso</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-5">
                            {/* Combobox de estudiantes */}
                            <FormField
                                control={form.control}
                                name="id_student"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Estudiante</FormLabel>
                                        <Popover open={openStudent} onOpenChange={setOpenStudent}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openStudent}
                                                        className="w-full justify-between"
                                                    >
                                                        {field.value
                                                            ? students.find(
                                                                  (student) => student.id_student === field.value
                                                              )?.name
                                                            : 'Selecciona un estudiante...'}
                                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar estudiante..." />
                                                    <CommandList>
                                                        <CommandEmpty>No se encontraron estudiantes.</CommandEmpty>
                                                        <CommandGroup>
                                                            {students.map((student) => (
                                                                <CommandItem
                                                                    key={student.id_student}
                                                                    onSelect={() => {
                                                                        setSelectedStudent(student.id_student);
                                                                        field.onChange(student.id_student);
                                                                        setOpenStudent(false);
                                                                    }}
                                                                >
                                                                    {student.id_student} - {student.name}
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            student.id_student === field.value
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

                            {/* Combobox de cursos del profesor */}
                            {professorCourses.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name="professorCourseId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Curso del Profesor</FormLabel>
                                            <Popover open={openCourse} onOpenChange={setOpenCourse}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={openCourse}
                                                            className="w-full justify-between"
                                                        >
                                                            {field.value
                                                                ? professorCourses.find(
                                                                      (course) => course.professorCourseId === field.value
                                                                  )?.courseName
                                                                : 'Selecciona un curso...'}
                                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Buscar curso..." />
                                                        <CommandList>
                                                            <CommandEmpty>No se encontraron cursos.</CommandEmpty>
                                                            <CommandGroup>
                                                                {professorCourses.map((course) => (
                                                                    <CommandItem
                                                                        key={course.professorCourseId}
                                                                        onSelect={() => {
                                                                            field.onChange(course.professorCourseId);
                                                                            setOpenCourse(false);
                                                                        }}
                                                                    >
                                                                        {course.courseName}
                                                                        <CheckIcon
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                course.professorCourseId === field.value
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
                            )}
                            
                            <Button type="submit">Solicitar</Button>

                            {/* Tabla de información de los cursos */}
                            {selectedStudent && professorCourses.length > 0 && (
                                <div className="mt-4">
                                    {loading ? (
                                        <p>Cargando...</p>
                                    ) : (
                                        <Table>
                                            <TableCaption>Información de cursos del profesor</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nombre del curso</TableHead>
                                                    <TableHead>Código del curso</TableHead>
                                                    <TableHead>Profesor</TableHead>
                                                    <TableHead>Total citas</TableHead>
                                                    <TableHead>Citas reservadas</TableHead>
                                                    <TableHead>Horarios</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {professorCourses.map((course) => (
                                                    <TableRow key={course.professorCourseId}>
                                                        <TableCell>{course.courseName}</TableCell>
                                                        <TableCell>{course.courseCode}</TableCell>
                                                        <TableCell>{course.professorName}</TableCell>
                                                        <TableCell>{course.totalAppointments}</TableCell>
                                                        <TableCell>{course.reservedAppointments}</TableCell>
                                                        <TableCell>
                                                            {course.schedules.map((schedule, index) => (
                                                                <div key={index}>
                                                                    {schedule.day}: {schedule.startTime} - {schedule.endTime}
                                                                </div>
                                                            ))}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}

export default AppointmentCourseForm;