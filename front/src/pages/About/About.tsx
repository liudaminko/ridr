import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageHeader}>About RIDR - online bookstore</h1>
      <div className={styles.aboutMeContainer}>
        <img src="/photo.jpg" className={styles.creatorPhoto} />
        <div className={styles.infoContainer}>
          <div className={styles.tag}>Software engineer</div>
          <div className={styles.mainInfo}>
            <h1 style={{ textAlign: "left" }}>hi!</h1>
            <img src="/wave.png" style={{ height: "40px" }} />
          </div>
          <div className={styles.mainInfo}>
            <h1 style={{ textAlign: "left" }}>
              i'm liuda minkovets. i study in LPNU, Ukraine
            </h1>
            <img src="/flagUkraine.png" style={{ height: "40px" }} />
          </div>
          <h2 style={{ textAlign: "left" }}>
            this website is my coursework project for the subject "Data Bases"
          </h2>
          <h3 style={{ textAlign: "left" }}>technologies used:</h3>
          <ul>
            <li>• SQLServer for DB</li>
            <li>• Java</li>
            <li>• React</li>
          </ul>
          <div className={styles.socialMediaContainer}>
            <a href="https://www.instagram.com/luda.min/">
              <img
                src="/instagram.png"
                alt="instagram"
                className={styles.links}
              />
            </a>
            <a href="https://www.linkedin.com/in/liudmyla-minkovets-59a386138/">
              <img
                src="/linkedin.png"
                alt="linkedin"
                className={styles.links}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
