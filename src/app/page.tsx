import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className={`${styles.main} relative flex items-center justify-center min-h-screen w-full h-full overflow-hidden`}>
      {/* Fondo difuminado */}
      <div className="absolute inset-0 w-full h-full bg-white dark:bg-black"></div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-6xl px-8">
        {/* Sección de texto */}
        <div className="flex flex-col items-start w-1/2">
          <h1 className="text-6xl font-bold bg-white text-black dark:text-white dark:bg-black mb-4 ">
            Bienvenido a la plataforma TEC administradora de citas
          </h1>
          <h2 className="text-2xl font-bold bg-white text-black dark:text-white dark:bg-black mb-4">
            Si necesitas más información puedes ingresar a
          </h2>
          <a href="https://tecdigital.tec.ac.cr" target="_blank" rel="noopener noreferrer">
            <Button className="mt-6 bg-black text-white dark:text-black dark:bg-red-500 shadow-lg">
              TEC-Digital
            </Button>
          </a>
        </div>

        {/* Imagen a la derecha del texto */}
        <div className="absolute flex justify-end w-full ml-1">
          <div className="px-3 py-10 mt-[-150px] bg-white dark:bg-gradient-to-r dark:from-blue-400 dark:via-white-900 dark:to-red-300 rounded-lg">
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
    </main>
  );
}

