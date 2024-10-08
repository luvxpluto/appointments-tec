"use client"; // Necesario para los componentes cliente

import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Función para verificar si la clase `dark` está en el elemento HTML
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    // Ejecutar la verificación inicial
    checkDarkMode();

    // Escuchar cambios en el modo oscuro
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className={`${styles.main} relative flex flex-col items-center justify-center min-h-screen w-full h-full overflow-hidden px-4`}>
      {/* Fondo difuminado */}
      <div className="absolute inset-0 w-full h-full bg-white dark:bg-black"></div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between w-full max-w-6xl px-8 py-12 lg:py-20">
        {/* Sección de texto */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-1/2 mb-10 lg:mb-0 lg:mr-10">
          <h1 className="text-6xl font-bold bg-white text-black dark:text-white dark:bg-black mb-8 text-center lg:text-left">
            Bienvenido a la plataforma TEC administradora de citas
          </h1>
          <h2 className="text-2xl font-bold bg-white text-black dark:text-white dark:bg-black mb-8 text-center lg:text-left">
            Si necesitas más información puedes ingresar a
          </h2>
          <a href="https://tecdigital.tec.ac.cr" target="_blank" rel="noopener noreferrer">
            <Button className="mt-6 bg-black text-white dark:text-black dark:bg-red-500 shadow-lg">
              TEC-Digital
            </Button>
          </a>
        </div>

        {/* Imagen a la derecha del texto */}
        <div className="flex justify-center lg:justify-end w-full lg:w-1/2">
          <div className="px-3 py-10 bg-white dark:bg-gradient-to-r dark:from-blue-200 dark:via-white-900 dark:to-red-300 rounded-lg">
            <Image
              className={styles.logo}
              src="/Firma_TEC.svg"
              alt="TEC Logo"
              width={480}
              height={250}
              priority
            />
          </div>
        </div>
      </div>

      {/* Sección de tarjetas */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mt-30 lg:mt-20">
        {/* Primera tarjeta de imagen e información */}
        <div className="flex flex-col items-center p-4 bg-white dark:bg-black rounded-lg mt-6 max-w-xs">
          <Image
            src={isDarkMode ? "/Calendar-dark.svg" : "/Calendar-light.svg"}
            alt="Calendar"
            width={150}
            height={37}
            priority
          />
          <p className="mt-4 text-center text-black dark:text-white">Mediante el algoritmo de esta página, puede agendar citas en cualquier curso en el que esté matriculado en el semestre o trimestre.</p>
        </div>

        {/* Segunda tarjeta de imagen e información */}
        <div className="flex flex-col items-center p-4 bg-white dark:bg-black rounded-lg mt-10 max-w-xs">
          <Image
            src={isDarkMode ? "/magnifyingglass-dark.svg" : "/magnifyingglass-light.svg"}
            alt="Magnifying Glass"
            width={120}
            height={37}
            priority
          />
          <p className="mt-8 text-center text-black dark:text-white">Puede solicitar su cita con cualquier profesor disponible que esté impartiendo el curso matriculado y seleccionado.</p>
        </div>

        {/* Tercera tarjeta de imagen e información */}
        <div className="flex flex-col items-center p-4 bg-white dark:bg-black rounded-lg mt-2 max-w-xs">
          <Image
            src={isDarkMode ? "/stars-dark.svg" : "/stars-light.svg"}
            alt="Stars"
            width={180}
            height={37}
            priority
          />
          <p className=" text-center text-black dark:text-white">Cada estudiante tendrá una calificación que le ayudará a obtener una mayor prioridad en el algoritmo que sugiere su cita lo más pronto posible.</p>
        </div>
      </div>
    </main>
  );
}
