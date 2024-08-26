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
const professorSchema = z.object({
    name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    id_professor: z.string()
        .min(1,{ message: 'El ID del profesor es obligatorio' })
        .transform((val) => {
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw new Error('El ID del profesor debe ser un número');
            }
            return parsed;
        }),
});

export function ProfessorForm(){
    const form = useForm<z.infer<typeof professorSchema>>({
        resolver: zodResolver(professorSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/professors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                toast({
                    title: "Profesor Registrado",
                    description: `El profesor ${result.name} ha sido registrado exitosamente.`,
                });
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: `Error al registrar el profesor: ${errorData.error}`,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Hubo un problema al registrar el profesor.",
            });
            console.error("Error al enviar los datos:", error);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Registrar profesor</CardTitle>
                <CardDescription>Ingresa los detalles del profesor</CardDescription>
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
                                        <FormLabel htmlFor="id_professor">ID del profesor</FormLabel>
                                        <FormControl>
                                            <Input id="id_professor" placeholder="305890345" {...field} />
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
                                            <Input id="name" placeholder="David Jiménez" {...field} />
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

export default ProfessorForm;
