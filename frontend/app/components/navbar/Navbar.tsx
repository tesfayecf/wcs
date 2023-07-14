import React from 'react'
import Link from 'next/link'
import styles from './styles/Navbar.module.scss'

type INavbarProps = {}

const Navbar: React.FunctionComponent<INavbarProps> = (props: INavbarProps) => {

    // const data = useStore.getState().AppStore.store.userInfo.name;


    // return (
    //     <div id='navbar' className={styles.container}>
    //         <div id='navigation-buttons-container' className={styles.navigation_buttons_container}>
    //             <NavbarButton text='Dashboard' index="/dashboard" />
    //             <NavbarButton text='Analytics' index="/analytics" />
    //             <NavbarButton text='Profile' index="/analytics" />
    //         </div>
    //     </div>
    // )
    return null
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