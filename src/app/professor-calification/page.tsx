"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Root as SliderRoot, Track as SliderTrack, Range as SliderRange, Thumb as SliderThumb } from '@radix-ui/react-slider';

import { cn } from "@/lib/utils";

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
});

export function StudentForm() {
  const form = useForm<z.infer<typeof professorSchema>>({
    resolver: zodResolver(professorSchema),
    defaultValues: {
      name: '',
    },
  });

  const [rating, setRating] = React.useState(0);

  const handleSliderChange = (value: number[]) => {
    setRating(value[0]);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<span key={i} className="text-yellow-500 text-4xl">&#9733;</span>); // Estrella llena
      } else if (rating >= i - 0.5) {
        stars.push(<span key={i} className="text-yellow-500 text-4xl">&#9734;</span>); // Media estrella
      } else {
        stars.push(<span key={i} className="text-gray-300 text-4xl">&#9734;</span>); // Estrella vacía
      }
    }
    return stars;
  };

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
        <CardTitle>Registrar calificación de alumno</CardTitle>
        <CardDescription>Primero elige el nombre del alumno. Recuerda que 1 es la calificación más baja y 5 la más alta.</CardDescription>
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
                    <FormLabel htmlFor="name">Profesor</FormLabel>
                    <FormControl>
                      <Input id="profesor" placeholder="David Jiménez" {...field} />
                    </FormControl>
                    <FormLabel htmlFor="name">Estudiante</FormLabel>
                    <FormControl>
                      <Input id="estudiante" placeholder="David Jiménez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Estrellas de calificación */}
              <div className="flex items-center justify-center mb-4">
                {renderStars()}
                <span className="ml-2 text-gray-700">{rating.toFixed(1)}</span>
              </div>
              {/* Slider de calificación */}
              <Slider
                defaultValue={[0]}
                min={1}
                max={5}
                step={0.5}
                onValueChange={handleSliderChange}
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
