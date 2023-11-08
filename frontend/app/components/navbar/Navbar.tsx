import React from 'react'
import LogoIcon from '@/public/svg/logoIcon'
import DashboardIcon from '@/public/svg/DashboardIcon'
import AnalyticsIcon from '@/public/svg/AnalyticsIcon'
import SettingsIcon from '@/public/svg/SettingsIcon'
import ProfileIcon from '@/public/svg/ProfileIcon'
import NavKey from './Navkey'

interface INavbarProps { }

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

export default Navbar

