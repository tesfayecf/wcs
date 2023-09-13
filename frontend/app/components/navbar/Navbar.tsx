import React from 'react'
import Link from 'next/link'
import { IRootState } from '@/app/utils/store/store'
import { usePathname } from 'next/navigation'
import { connect } from 'react-redux'
import LogoIcon from '@/public/svg/logoIcon'
import DashboardIcon from '@/public/svg/DashboardIcon'
import AnalyticsIcon from '@/public/svg/AnalyticsIcon'
import SettingsIcon from '@/public/svg/SettingsIcon'
import ProfileIcon from '@/public/svg/ProfileIcon'

interface INavbarProps extends ReturnType<typeof mapStateToProps> { }

const Navbar: React.FunctionComponent<INavbarProps> = (props: INavbarProps) => {

    return (
        <div id='navbar' className={"navbar"}>
            <div id='logo' className={"logo"}>
                <LogoIcon stroke='#55dc9e' size={75} />
            </div>
            <div id='navkeys' className={"navkeys"}>
                <NavKey text='Dashboard' index='/dashboard' icon={<DashboardIcon size={25} strokeWidth={1.2} />} />
                <NavKey text='Analytics' index='/analytics' icon={<AnalyticsIcon size={25} strokeWidth={1.2} />} />
                <NavKey text='Settings' index='/settings' icon={<SettingsIcon size={25} strokeWidth={1.2} />} />
                <NavKey text='Profile' index='/about' icon={<ProfileIcon size={25} strokeWidth={1.2} />} />
            </div>
        </div >
    )
}

const mapStateToProps = (state: IRootState) => ({

})

export default connect(mapStateToProps, {})(Navbar)


type INavKeyProps = {
    text: string;
    index: string;
    icon?: JSX.Element;
}

const NavKey: React.FunctionComponent<INavKeyProps> = (props: INavKeyProps) => {
    const pathname = usePathname();
    const selected = pathname.includes(props.index);
    const selectedSytle = selected ? `${"selected"}` : '';
    const contClass = `${selectedSytle} ${"navkey_cont"}`
    const textClass = `${selectedSytle} ${"navkey_text"}`
    const iconClass = `${selectedSytle} ${"navkey_icon"}`
    return (
        <div className={contClass} >
            <Link href={props.index} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                <div id='navkey' className={"navkey"}>
                    <div id='navkey-icon' className={iconClass}>
                        {props.icon}
                    </div>
                    <span id='navkey-text' className={"navkey_text"} style={{ textDecoration: 'none' }}>
                        {props.text}
                    </span>
                </div>
            </Link >
        </div>

    )
}


