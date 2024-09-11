'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';

interface Appointment {
  id_appointment: number;
  date_time: string | Date;
  is_reserved: boolean;
  is_available: boolean;
  course_name: string;
  professor_name: string;
  duration: number;
}

const AppointmentView: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [id_student, professorCourseId] = slug?.split('_') || [];
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id_student && professorCourseId) {
      const fetchAppointments = async () => {
        try {
          const response = await fetch(`/api/appointments?id_student=${id_student}&professorCourseId=${professorCourseId}`);
          if (!response.ok) {
            throw new Error('Error fetching appointments');
          }
          const appointmentsList: Appointment[] = await response.json();
          setAppointments(appointmentsList);
        } catch (error) {
          console.error('Error al obtener las citas:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchAppointments();
    }
  }, [id_student, professorCourseId]);

  const handleNextAppointment = () => {
    if (currentIndex < appointments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAssignAppointment = async () => {
    if (appointments[currentIndex]) {
      try {
        // Realizar la solicitud PUT para actualizar la cita
        const response = await fetch('/api/appointments', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_appointment: appointments[currentIndex].id_appointment, // Usar el id_appointment correctamente
            id_student: id_student, // Asegúrate de tener el id_student disponible
          }),
        });
  
        // Verificar si la respuesta del servidor es exitosa
        if (response.ok) {
          const result = await response.json();
  
          // Mostrar el toast de éxito
          toast({
            title: 'Cita asignada',
            description: `La cita con id ${appointments[currentIndex].id_appointment} ha sido asignada con éxito al estudiante ${id_student}.`,
          });
  
          // Actualizar el estado de la cita para marcarla como no disponible
          const updatedAppointments = [...appointments];
          updatedAppointments[currentIndex] = {
            ...updatedAppointments[currentIndex],
            is_available: false,
          };
          setAppointments(updatedAppointments);
  
        } else {
          // Manejar los errores del servidor
          const errorData = await response.json();
          toast({
            title: 'Error',
            description: errorData.error || 'Error al asignar la cita.',
          });
        }
  
      } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al asignar la cita:', error);
        toast({
          title: 'Error',
          description: 'Hubo un problema al asignar la cita.',
        });
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <p className="text-xl">Cargando citas...</p>
    </div>;
  }

  if (!appointments.length) {
    return <div className="flex justify-center items-center h-screen">
      <p className="text-xl">No hay citas disponibles.</p>
    </div>;
  }

  const currentAppointment = appointments[currentIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Cita</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-lg">
                Curso: {currentAppointment.course_name}
            </p>
            <p className="text-lg">
                Profesor: {currentAppointment.professor_name}
            </p>
            <p className="text-lg">
                Duración: {currentAppointment.duration} minutos
            </p>
            <p className="text-lg">
                Fecha: {format(new Date(currentAppointment.date_time), 'dd/MM/yyyy HH:mm')}
            </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleAssignAppointment} disabled={!currentAppointment.is_available}>
            {currentAppointment.is_available? 'Asignar' : 'Asignada'}
          </Button>
          <Button 
            onClick={handleNextAppointment}
            disabled={currentIndex === appointments.length - 1}
          >
            Siguiente cita
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentView;