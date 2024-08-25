"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

import { toast } from '@/components/ui/use-toast';


const courseSchema = z.object({
    name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    id_course: z.string().min(1,{ message: 'El ID del curso es obligatorio' }),
});

export function CourseForm(){
    const form = useForm<z.infer<typeof courseSchema>>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            name: '',
            id_course: '',
        },
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                toast({
                    title: "Curso Registrado",
                    description: `El curso ${result.id_course} ${result.name} ha sido registrado exitosamente.`,
                });
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: `Error al registrar el curso: ${errorData.error}`,
                });
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
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Registrar cursos</CardTitle>
                <CardDescription>Ingresa los detalles del curso</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-5">
                            <FormField
                                control={form.control}
                                name="id_course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="id_course">Código del curso</FormLabel>
                                        <FormControl>
                                            <Input id="id_course" placeholder="TI3603" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Nombre</FormLabel>
                                        <FormControl>
                                            <Input id="name" placeholder="Calidad en sistemas de información" {...field} />
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

export default CourseForm;