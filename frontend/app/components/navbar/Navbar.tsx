import React from 'react'
import Link from 'next/link'
import styles from './styles/Navbar.module.scss'
import { store } from '@/app/utils/store/store'
import { usePathname } from 'next/navigation'

type INavbarProps = {}

const Navbar: React.FunctionComponent<INavbarProps> = (props: INavbarProps) => {

    const data = store.getState().app.userInfo.name;


    return (
        <div id='navbar' className={styles.navbar}>
            <div id='navigation-buttons-container' className={styles.buttons}>
                <NavbarButton text='Dashboard' index="/dashboard" />
                <NavbarButton text='Analytics' index="/analytics" />
                <NavbarButton text='Profile' index="/analytics" />
            </div>
        </div>
    )
}

export default Navbar

type INavbarButtonProps = {
    text: string;
    index: string;
}

const NavbarButton: React.FunctionComponent<INavbarButtonProps> = (props: INavbarButtonProps) => {
    const pathname = usePathname();
    const selected = pathname.includes(props.index);
    const buttonStyle = selected ? styles.button_selected : styles.button;
    return (
        <Link href={props.index} style={{ textDecoration: 'none' }}>
            <div id='navbarButton' className={buttonStyle}>
                <span id='navbarButtonText' className={styles.navigation_button_text}>
                    {props.text}
                </span>
            </div>
        </Link >
    )
}