"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/theme-toggle"

const componentsStudent: { title: string; href: string; description: string }[] = [
  {
    title: "Registrar estudiante",
    href: "/student-form",
    description:
      "Para que un estudiante pueda ser registrado en el sistema, se debe de llenar el formulario sus datos.",
  },
  {
    title: "Registrar los cursos del estudiante",
    href: "/student-course-registration-form",
    description:
      "Se debe registrar los cursos del estudiante para que pueda solicitar una cita.",
  },
]

const componentsProfessor: { title: string; href: string; description: string }[] = [
    {
      title: "Registrar profesor",
      href: "/professor-form",
      description:
        "Formulario para registrar un profesor en el sistema.",
    },
    {
      title: "Registrar los cursos que imparte el profesor",
      href: "/professor-course-form",
      description:
        "Se debe registrar los cursos que imparte el profesor para que pueda solicitar una cita.",
    },
    {
      title: "Cambiar rating de un estudiante",
      href: "/professor-calification",
      description:
        "Elija un estudiante para calificar su participación en la cita.",
    },
    {
      title: "Registrar hora de consulta",
      href: "/schedule-form",
      description:
        "Formulario para registrar la hora de consulta de un profesor.",
    },
    {
      title: "Realizar Consultas",
      href: "/Querys",
      description:
        "Formulario para realizar consultas de citas",
    }
]

const componentsCourses: { title: string; href: string; description: string }[] = [
    {
      title: "Registrar curso",
      href: "/course-form",
      description:
        "Formulario para registrar un curso en el sistema.",
    },
    {
      title: "Soliciar cita",
      href: "",
      description:
        "Soliciar cita con un profesor.",
    }
]


export function NavBar() {
  return (
    <div className="flex items-center justify-between w-full px-8 py-3 fixed">
    <NavigationMenu>
      <NavigationMenuList>
      <NavigationMenuItem>
          <Link href="\" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Inicio
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Estudiantes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[600px] gap-6 p-4 md:w-[500px] lg:w-[400px]">
              {componentsStudent.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Profesores</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[600px] gap-3 p-4 md:w-[500px] lg:w-[400px]">
              {componentsProfessor.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Cursos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[600px] gap-3 p-4 md:w-[500px] lg:w-[400px]">
              {componentsCourses.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <ModeToggle />
  </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default NavBar;