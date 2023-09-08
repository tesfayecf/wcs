import react from "react";
import styles from "./styles/Footer.module.scss"


const Footer: React.FunctionComponent<{}> = () => (
    <div className={styles.footer}>
        <p className={styles.text}>
            © 2023 All rights reserved by WCS
        </p>
    </div>
);

export default Footer; 