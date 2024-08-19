# Nombre del proyecto: Appointments-tec

Este repositorio contiene el código fuente y la documentación para el proyecto programado de la **Licenciatura en Administración de Tecnología de Información** del **Tecnológico de Costa Rica (TEC)**. El objetivo del proyecto es desarrollar un sistema que permita la gestión de horarios de consulta de los profesores y la asignación de citas para los estudiantes.

## Resumen Funcionalidades Principales

- **Mantenimiento de Datos**: Gestión de información relacionada con cursos, profesores, estudiantes y semestres.
- **Asignación de Citas de Consulta**: Permite a los estudiantes solicitar citas con los profesores de sus cursos.
- **Generación de Reportes**: Consultas personalizadas sobre citas, cursos, profesores y estudiantes.

## Reglas

### Control de Versiones

- **Commits:**
  - Realizar commits frecuentes con mensajes claros y descriptivos para documentar los cambios realizados en el código.
  - Asegúrate de que cada commit refleje un cambio coherente y no trabajar sobre lo que estan haciendo otras personas.

- **Branches:**
  - Utiliza ramas (branches) para desarrollar nuevas características o realizar correcciones de errores.
  - Antes de fusionar una rama con la rama principal (`main` o `master`), asegúrate de que la funcionalidad esté completamente implementada y probada. 

### Documentación

- **Documentación Interna:**
  - Asegúrate de que el código esté bien comentado para facilitar su comprensión y mantenimiento.
  - Los comentarios deben explicar el propósito de las funciones y los bloques de código complejos.
  - Mantén la documentación interna actualizada a medida que el código evoluciona.
    
### Division de trabajo actualizada
- **Fabian**
  -0.
- **Esteban**
  -0.
- **David**
  -0.
- **Fer**
  -0.
- **Sebas**
  -0.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Checklist de las Funcionalidades Principales del Sistema

### Mantenimiento de Datos

- **Cursos**: Gestión del código y nombre de cada curso. CRUD
- **Profesores**: Manejo de la información de los profesores, incluyendo el nombre, los cursos que atienden, sus horarios de consulta, y la capacidad para citas.CRUD
- **Estudiantes**: Registro de los estudiantes, incluyendo su nombre, carnet, cursos actuales, las veces que han llevado un curso, y la cantidad de estrellas asignadas por el profesor. CRUD
- **Semestre**: Registro de la fecha de finalización del semestre actual. CRUD

### Asignación de Citas de Consulta

- El sistema muestra las opciones de citas disponibles basadas en la cantidad de veces que el estudiante ha llevado el curso y su puntuación de estrellas.
- Las citas se asignan de lunes a viernes, priorizando las opciones según la disponibilidad y criterios previamente establecidos.

### Reportes

- Permite consultar información sobre cursos, profesores, estudiantes, y citas asignadas utilizando filtros específicos.
- Los reportes se generan en un formato amigable para el usuario, simulando consultas en Prolog pero presentadas a través de una interfaz gráfica intuitiva.

## Criterios de Evaluación

El proyecto será evaluado de acuerdo con los siguientes criterios:

- **Documentación Externa**: 15% de la nota total.
- **Funcionalidad de Mantenimiento de Datos**: 20% de la nota total.
- **Funcionalidad de Asignación de Citas**: 23% de la nota total.
- **Funcionalidad de Reportes**: 22% de la nota total.
- **Interconexión Prolog-Lenguaje de Programación**: 20% de la nota total.
- **Persistencia de Datos**: 7% adicional si se implementa correctamente.

