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
    const [courses, setCourses] = React.useState<string[]>([]);  // Inicializado como array vacío
    const [error, setError] = React.useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = React.useState<string | null>(null); // Nuevo estado para el curso seleccionado
    const [selectedPlace, setSelectedPlace] = React.useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = React.useState<string | null>(null);
    const vehicles = Array.from({ length: 30 }, (_, i) => `Vehículo ${i + 1}`);
    const sliderRef = React.useRef<HTMLDivElement | null>(null);

    // Función para manejar la búsqueda basada en el número ingresado
    const handleSearch = async () => {
        if (inputNumber) {
            try {
                // Realizar una petición a la API para obtener los estudiantes
                const response = await fetch('/api/students');
                const students = await response.json();

                // Buscar el estudiante por el id
                const student = students.find((s: any) => s.id_student === inputNumber.trim());

                if (student) {
                    setStudentName(student.name); 
                    setCourses(student.courses || []); // Asegurarse de que courses sea un array
                    setStep(2);  // Avanzar al siguiente paso
                } else {
                    setError('Estudiante no encontrado');
                }
            } catch (error) {
                setError('Error al buscar el estudiante');
            }
        }
    };

    // Maneja la selección de un lugar
    const handleSelectPlace = (place: string) => {
        setSelectedPlace(place);
        setStep(3);
    };

    const handleSelectVehicle = (vehicle: string) => {
        setSelectedVehicle(vehicle);
    };

    const handleNextSlide = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft += 300;
        }
    };

    const handlePrevSlide = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft -= 300;
        }
    };

    return (
        <Card className="w-[600px] p-6 relative shadow-lg">
            
            {/* Paso 1: Ingresar número y buscar */}
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

            {/* Paso 2: Mostrar nombre del estudiante y cursos */}
            {step === 2 && studentName && (
                <div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Bienvenido, {studentName}</CardTitle>
                        <CardDescription className="text-md text-gray-500 mt-1 dark:text-gray-400">
                            Seleccione el curso en el que desea agendar su cita:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Si tiene cursos, mostrar un select. Si no, mostrar un mensaje */}
                        {courses && courses.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                <select
                                    value={selectedCourse || ""}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="w-full p-2 border rounded-lg text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                                >
                                    <option value="">Seleccione un curso</option>
                                    {courses.map((course, index) => (
                                        <option key={index} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    onClick={() => handleSelectPlace('Lugar de Prueba')}
                                    className="w-full py-2 rounded-lg border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                                    disabled={!selectedCourse}  // Deshabilitar si no ha seleccionado un curso
                                >
                                    Ir a Seleccionar Vehículo
                                </Button>
                            </div>
                        ) : (
                            <p className="text-red-500">El estudiante no tiene cursos asignados.</p>
                        )}
                    </CardContent>
                </div>
            )}

            {/* Paso 3: Seleccionar vehículo */}
            {step === 3 && (
                <div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Seleccione un vehículo</CardTitle>
                        <CardDescription className="text-md text-gray-500 mt-1 dark:text-gray-400">Desliza y selecciona un vehículo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mt-6">
                            <div
                                ref={sliderRef}
                                className="flex overflow-x-auto gap-4 py-4"
                                style={{
                                    scrollBehavior: "smooth",
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#a0a0a0 transparent",
                                }}
                            >
                                {vehicles.map((vehicle) => (
                                    <Button
                                        key={vehicle}
                                        onClick={() => handleSelectVehicle(vehicle)}
                                        variant={selectedVehicle === vehicle ? 'default' : 'outline'}
                                        className={`w-[140px] h-[140px] text-base rounded-lg flex items-center justify-center border ${selectedVehicle === vehicle ? 'text-white' : 'text-gray-700 dark:text-gray-300 dark:border-gray-500'} transition-all duration-200 hover:shadow-lg`}
                                    >
                                        {vehicle}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            {selectedVehicle && (
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Has seleccionado: {selectedVehicle}
                                </h2>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center mt-6">
                        <p className="text-md text-gray-600 dark:text-gray-400">Desliza entre las opciones y selecciona tu vehículo favorito</p>
                    </CardFooter>

                    {/* Botones de navegación */}
                    <div className="absolute inset-y-0 left-0 flex items-center">
                        <Button
                            onClick={handlePrevSlide}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button
                            onClick={handleNextSlide}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}

export default VehicleSliderPage;
