import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Willkommen</h1>

      <p>Wählen Sie einen Bereich aus:</p>

      <div className={styles.grid}>
        <a href="https://places26.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.card}>
          <Image src="/images/places26.jpg" alt="Daten" width={500} height={300} className={styles.image} />

          <h2>Places26</h2>
          <p>Gehe zu Places26</p>
        </a>

        <a href="https://eckihag.de/" target="_blank" rel="noopener noreferrer" className={styles.card}>
          <Image src="/images/eckihag.jpg" alt="eckihag" width={500} height={300} className={styles.image} />

          <h2>EckiHag</h2>
          <p>Gehe zu EckiHag</p>
        </a>

        <Link href="/datenbanktest" className={styles.card}>
          <Image src="/images/gemeinden.jpg" alt="Gemeinden" width={500} height={300} className={styles.image} />

          <h2>datenbanktest</h2>
          <p>datenbanktest anzeigen</p>
        </Link>

        <Link href="/vokabeln" className={styles.card}>
          <Image src="/images/termine.jpg" alt="Termine" width={500} height={300} className={styles.image} />

          <h2>Vokabeln</h2>
        </Link>

        <Link href="/login" className={styles.card}>
          <Image src="/images/login.jpg" alt="Anmelden" width={500} height={300} className={styles.image} />

          <h2>Anmelden</h2>
          <p>Zum geschützten Bereich</p>
        </Link>
      </div>
    </main>
  );
}
