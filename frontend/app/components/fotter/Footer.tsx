import react from "react";
import style from "./styles/Footer.module.scss"


const Footer: React.FunctionComponent<{}> = () => (
    <div className={style.footer}>
        <p className={style.footer_text}>
            © 2023 All rights reserved by WCS
        </p>
    </div>
);

export default Footer; 