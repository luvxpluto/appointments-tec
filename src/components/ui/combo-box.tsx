"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { toast } from '@/components/ui/use-toast';

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Datos de ejemplo para cursos y profesores
const coursesWithProfessors = [
  { courseName: "Calidad en Sistemas de Información", professorName: "Dr. Pérez", value: "course1" },
  { courseName: "Inteligencia Artificial", professorName: "Dr. Gómez", value: "course2" },
  { courseName: "Seguridad Informática", professorName: "Dra. Herrera", value: "course3" },
] as const

// Esquema de validación con zod
const FormSchema = z.object({
  courseSelection: z.string({
    required_error: "Por favor, selecciona un curso y un profesor.",
  }),
})

export function ComboboxCourseForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Has seleccionado el siguiente curso:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="courseSelection"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Seleccionar curso y profesor</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[300px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? coursesWithProfessors.find(
                            (course) => course.value === field.value
                          )?.courseName + " - " + coursesWithProfessors.find(
                            (course) => course.value === field.value
                          )?.professorName
                        : "Seleccionar curso y profesor"}
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
                        {coursesWithProfessors.map((course) => (
                          <CommandItem
                            key={course.value}
                            onSelect={() => {
                              form.setValue("courseSelection", course.value)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                course.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {`${course.courseName} - ${course.professorName}`}
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
        <Button type="submit">Registrar</Button>
      </form>
    </Form>
  )
}
