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

// Esquema modificado para aceptar el id como string y luego transformarlo a número
const studentSchema = z.object({
    name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    id_student: z.string()
        .min(1,{ message: 'El ID del estudiante es obligatorio' })
        .transform((val) => {
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw new Error('El ID del estudiante debe ser un número');
            }
            return parsed;
        }),
});

export function StudentForm(){
    const form = useForm<z.infer<typeof studentSchema>>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                toast({
                    title: "Estudiante Registrado",
                    description: `El estudiante ${result.name} ha sido registrado exitosamente.`,
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
                description: "Hubo un problema al registrar el estudiante.",
            });
            console.error("Error al enviar los datos:", error);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Registrar estudiante</CardTitle>
                <CardDescription>Ingresa los detalles del estudiante</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Nombre</FormLabel>
                                        <FormControl>
                                            <Input id="name" placeholder="Esteban Sánchez" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="id_student"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="id_student">Carnet</FormLabel>
                                        <FormControl>
                                            <Input id="id_student" placeholder="2021447793" {...field} />
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

export default StudentForm;