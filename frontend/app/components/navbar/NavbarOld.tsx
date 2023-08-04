import React from 'react'
import Link from 'next/link'
import styles from './styles/Navbar.module.scss'
import { IRootState, store } from '@/app/utils/store/store'
import { usePathname } from 'next/navigation'
import { connect } from 'react-redux'

interface INavbarProps extends ReturnType<typeof mapStateToProps> { }

const NavbarOLD: React.FunctionComponent<INavbarProps> = (props: INavbarProps) => {

    return (
        <div id='navbar' className={styles.navbar}>
            <div id='navigation-buttons-container' className={styles.buttons}>
                <NavbarButton text='Dashboard' index="/dashboard" />
                <NavbarButton text='Analytics' index="/analytics" />
                <NavbarButton text='Profile' index="/analytics" />
            </div>
            <div className={styles.userInfo}>
                {props.userInfo.first_name}
            </div>
        </div>
    )
}

const mapStateToProps = (state: IRootState) => ({
    userInfo: state.app.userInfo
})

export default connect(mapStateToProps, {})(NavbarOLD)


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


