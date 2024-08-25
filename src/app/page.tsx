import Image from "next/image";
import styles from "./Styles/page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="./Images/Firma_TEC.svg"
          alt="Tec logo"
          width={480}
          height={240}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="/Estudiante"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Estudiantes <span>-&gt;</span>
          </h2>
        </a>

        <a
          href="/Profesores"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Profesores <span>-&gt;</span>
          </h2>
        </a>

        <a
          href="/Cursos"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Cursos <span>-&gt;</span>
          </h2>
        </a>

      </div>
    </main>
  );
}
