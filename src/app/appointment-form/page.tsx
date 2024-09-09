"use client";

import * as React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function VehicleSliderPage() {
    const [step, setStep] = React.useState(1);
    const [inputNumber, setInputNumber] = React.useState('');
    const [studentName, setStudentName] = React.useState<string | null>(null);
    const [courses, setCourses] = React.useState<{
        courseId: string, 
        courseName: string, 
        professorId: string, 
        professorName: string,
        appointments: {
            start_time: string;
            end_time: string;
            number_appointments: number;
            number_appointments_reserve: number;
            day_of_week: string;
        }[]
    }[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = React.useState<{ courseId: string, professorId: string } | null>(null);
    const [selectedPlace, setSelectedPlace] = React.useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = React.useState<string | null>(null);
    const [appointments, setAppointments] = React.useState<{ date: string; timeRange: string }[]>([]);
    const [noMoreAppointments, setNoMoreAppointments] = React.useState(false);
    const sliderRef = React.useRef<HTMLDivElement | null>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    
    const handleSearch = async () => {
        if (inputNumber) {
            try {
                const response = await fetch(`/api/student-courses?id_student=${inputNumber.trim()}`);
                const data = await response.json();
                if (response.ok) {
                    setStudentName(data.studentName);
                    setCourses(data.courses.map((course: any) => ({
                        ...course,
                        appointments: course.appointments || []
                    })));
                    setStep(2);
                } else {
                    setError(data.error || 'Error al buscar el estudiante');
                }
            } catch (error) {
                setError('Error al buscar el estudiante');
            }
        }
    };

    // Fetch available appointments when a course is selected
    const handleSelectPlace = async (place: string) => {
        setSelectedPlace(place);
        if (selectedCourse) {
            try {
                const { courseId, professorId } = selectedCourse;
                const response = await fetch(`/api/appointments?course_id=${encodeURIComponent(courseId)}&professor_id=${encodeURIComponent(professorId)}`);
                const data = await response.json();
    
                if (response.ok) {
                    setAppointments(data.map((appointment: any) => ({
                        date: appointment.date, // Usa el campo 'date' que devolvió el backend
                        timeRange: appointment.timeRange
                    })));
                    setStep(3); 
                } else {
                    setError(data.error || 'Error al buscar las citas');
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setError('Error al buscar las citas');
            }
        } else {
            setError('Seleccione un curso antes de continuar.');
        }
    };

    const handleSelectVehicle = (vehicle: string) => {
        setSelectedVehicle(vehicle);
    };

    const handleNextSlide = () => {
        if (currentIndex < appointments.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setNoMoreAppointments(false);
        } else {
            setNoMoreAppointments(true);
        }
    };

    const handlePrevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
            setNoMoreAppointments(false);
        }
    };

    return (
        <Card className="w-[600px] p-6 relative shadow-lg">
            {/* Step 1: Enter student ID and search */}
            {step === 1 && (
                <div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Ingrese el ID del estudiante</CardTitle>
                        <CardDescription className="text-md text-gray-500 mt-1 dark:text-gray-400">Escriba el ID del estudiante para buscar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <input
                            type="number"
                            value={inputNumber}
                            onChange={(e) => setInputNumber(e.target.value)}
                            className="w-full p-2 border rounded-lg text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                            placeholder="Ingrese el ID del estudiante"
                        />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex justify-center mt-6">
                        <Button onClick={handleSearch} className="px-4 py-2 rounded-lg">Buscar</Button>
                    </CardFooter>
                </div>
            )}

            {/* Step 2: Display student name and courses */}
            {step === 2 && studentName && (
                <div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Bienvenido, {studentName}</CardTitle>
                        <CardDescription className="text-md text-gray-500 mt-1 dark:text-gray-400">
                            Seleccione el curso en el que desea agendar su cita:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {courses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courses.map((course, index) => (
                                    <Card
                                        key={index}
                                        className={`p-4 border ${selectedCourse?.courseId === course.courseId ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`}
                                        onClick={() => setSelectedCourse({ courseId: course.courseId, professorId: course.professorId })}
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">{course.courseId}: {course.courseName}</CardTitle>
                                            <CardDescription className="text-sm">Profesor: {course.professorName}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {course.appointments.length > 0 ? (
                                                <div>
                                                    <p className="text-md font-semibold">Detalles:</p>
                                                    <ul>
                                                        {course.appointments.map((appointment, i) => (
                                                            <li key={i} className="text-sm text-gray-500">
                                                                <p><strong>Día de la semana:</strong> {appointment.day_of_week}</p>
                                                                <p><strong>Hora:</strong> {appointment.start_time} - {appointment.end_time}</p>
                                                                <p><strong>Cupos:</strong> {appointment.number_appointments} (Reservados: {appointment.number_appointments_reserve})</p>
                                                                //NOTA: Aqui hay que terminar de agregar la info proveniente del AppointmentSchedule 
                                                                //que pide en el inicio de la pag 2 del doc del proyecto
                                                            </li>

                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 dark:text-gray-300">No hay citas disponibles.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300">No hay cursos disponibles.</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center mt-6">
                        <Button onClick={() => handleSelectPlace('classroom')} className="px-4 py-2 rounded-lg">
                            Continuar
                        </Button>
                    </CardFooter>
                </div>
            )}

    {step === 3 && (
        <div>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Citas disponibles</CardTitle>
            </CardHeader>
            <CardContent>
                {appointments.length > 0 ? (
                    <div className="flex justify-between items-center mb-4">
                        <Button onClick={handlePrevSlide} disabled={currentIndex === 0}>Anterior</Button>
                        <div className="text-center">
                            <p className="text-lg text-gray-800 dark:text-white">{appointments[currentIndex].date}</p>
                            <p className="text-md text-gray-500 dark:text-gray-300">{appointments[currentIndex].timeRange}</p>
                        </div>
                        <Button onClick={handleNextSlide} disabled={noMoreAppointments}>Siguiente</Button>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No hay citas disponibles en este momento.</p>
                )}
            </CardContent>
        </div>
    )}


            {/* Handle errors */}
            {error && (
                <CardContent>
                    <p className="text-red-500 mt-2">{error}</p>
                </CardContent>
            )}
        </Card>
    );
}

export default VehicleSliderPage;
