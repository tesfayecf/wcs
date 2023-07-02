import React from 'react'
import Link from 'next/link'
import { useStore } from '@/app/store/store'
import styles from './styles/Navbar.module.scss'

type INavbarProps = {}

const Navbar: React.FunctionComponent<INavbarProps> = (props: INavbarProps) => {

    const data = useStore.getState().AppStore.userInfo.name;
    console.log("navbar data", data);


    return (
        <div id='navbar' className={styles.container}>
            <div id='navigation-buttons-container' className={styles.navigation_buttons_container}>
                <NavbarButton text='Dashboard' index="./dashboard" />
                <NavbarButton text='Analytics' index="./analytics" />
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

    return (
        <Link href={props.index} style={{ textDecoration: 'none' }}>
            <div id='navbarButton' className={styles.navigation_button}>
                <span id='navbarButtonText' className={styles.navigation_button_text}>
                    {props.text}
                </span>
            </div>
        </Link>
    )
}