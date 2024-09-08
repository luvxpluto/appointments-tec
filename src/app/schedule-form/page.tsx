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
import { Input } from "@/components/ui/input"
import { toast } from '@/components/ui/use-toast';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

const fetchProfessorsCourses = async () => {
    try {
        const response = await fetch('/api/professor-course');
        if (!response.ok) {
            throw new Error('Error al obtener los cursos de los profesores');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los cursos de los profesores:', error);
        return [];
    }
}

const days = [
    { value: 'domingo', label: 'Domingo' },
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miércoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sábado', label: 'Sábado' },
];

const isTimeBeforeOrEqual = (time1: string, time2: string) => {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    return hours1 < hours2 || (hours1 === hours2 && minutes1 <= minutes2);
};

const scheduleSchema = z.object({
    id_professor_course: z.string({ required_error: 'El curso del profesor es obligatorio' }),
    day: z.string({ required_error: 'El día es obligatorio' }),
    start_time: z.string({ required_error: 'La hora de inicio es obligatoria' }),
    end_time: z.string({ required_error: 'La hora de fin es obligatoria' }),
    number_appointments: z.number().int().positive({ message: 'Debe ser un número positivo' }),
    number_appointment_reserve: z.number().int().nonnegative({ message: 'Debe ser un número no negativo' }),
}).refine((data) => isTimeBeforeOrEqual(data.start_time, data.end_time), {
    message: "La hora de inicio debe ser anterior a la hora de fin",
    path: ["end_time"],
}).refine((data) => data.number_appointments > data.number_appointment_reserve, {
    message: "El número de citas debe ser mayor que el número de citas reservadas",
    path: ["number_appointment_reserve"],
});

type ProfessorCourse = {
    id: string;
    courseId: string;
    courseName: string;
    professorId: string;
    professorName: string;
};

export function ScheduleForm() {
    const [professorCourses, setProfessorCourses] = React.useState<ProfessorCourse[]>([]);
    const [openProfessorCourse, setOpenProfessorCourse] = React.useState(false);
    const [openDay, setOpenDay] = React.useState(false);

    React.useEffect(() => {
        fetchProfessorsCourses().then(setProfessorCourses);
    }, []);

    const form = useForm<z.infer<typeof scheduleSchema>>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            number_appointments: 0,
            number_appointment_reserve: 0,
        },
    });

    const onSubmit = async (data: z.infer<typeof scheduleSchema>) => {
        try {
            const response = await fetch('/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast({
                    title: "Horario creado",
                    description: "El horario ha sido creado exitosamente.",
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
                description: "Hubo un problema al crear el horario.",
            });
            console.error("Error al enviar los datos:", error);
        }
    };

    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Crear Horario</CardTitle>
                <CardDescription>Ingresa los detalles del horario</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-5">
                            <FormField
                                control={form.control}
                                name="id_professor_course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Curso - Profesor</FormLabel>
                                        <Popover open={openProfessorCourse} onOpenChange={setOpenProfessorCourse}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openProfessorCourse}
                                                        className={cn(
                                                            "w-[450px] justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? professorCourses.find((pc) => pc.id === field.value)?.courseName + " - " + professorCourses.find((pc) => pc.id === field.value)?.professorName
                                                            : 'Selecciona un curso y profesor'}
                                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[450px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar curso o profesor" className="h-9" />
                                                    <CommandList>
                                                        <CommandEmpty>No se encontraron resultados</CommandEmpty>
                                                        <CommandGroup>
                                                            {professorCourses.map((pc) => (
                                                                <CommandItem
                                                                    key={pc.id}
                                                                    value={`${pc.courseName} - ${pc.professorName}`}
                                                                    onSelect={() => {
                                                                        form.setValue("id_professor_course", pc.id);
                                                                        setOpenProfessorCourse(false);
                                                                    }}
                                                                >
                                                                    {pc.courseName} - {pc.professorName}
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            pc.id === field.value
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Día</FormLabel>
                                        <Popover open={openDay} onOpenChange={setOpenDay}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openDay}
                                                        className={cn(
                                                            "w-[450px] justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? days.find((day) => day.value === field.value)?.label
                                                            : 'Selecciona un día'}
                                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[450px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar día" className="h-9" />
                                                    <CommandList>
                                                        <CommandEmpty>No se encontraron resultados</CommandEmpty>
                                                        <CommandGroup>
                                                            {days.map((day) => (
                                                                <CommandItem
                                                                    key={day.value}
                                                                    value={day.label}
                                                                    onSelect={() => {
                                                                        form.setValue("day", day.value);
                                                                        setOpenDay(false);
                                                                    }}
                                                                >
                                                                    {day.label}
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            day.value === field.value
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="start_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora de inicio</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora de fin</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="number_appointments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de citas</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="number_appointment_reserve"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de citas reservadas</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <CardFooter className="flex justify-center mt-10">
                            <Button type="submit">Crear Horario</Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default ScheduleForm;