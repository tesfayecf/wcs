import React from 'react'
// import LogoIcon from '@/public/svg/LogoIcon'
import DashboardIcon from '@/public/svg/DashboardIcon'
import AnalyticsIcon from '@/public/svg/AnalyticsIcon'
import SettingsIcon from '@/public/svg/SettingsIcon'
import LogoSmallIcon from '@/public/svg/LogoSmallIcon'
import NavKey from './Navkey'

interface INavbarProps { }

const Navbar: React.FunctionComponent<INavbarProps> = (props: INavbarProps) => {

    const renderKeys = React.useCallback(() => {
        return navigation.map((key, index) => {
            return <NavKey text={key.text} index={key.index} icon={key.icon} />
        })
    }, [])

    return (
        <div id='navbar' className={"navbar"}>
            <div id='logo' className={"logo"}>
                <LogoSmallIcon fill='#55dc9e' stroke='#55dc9e' strokeWidth={0.1} size={60} />
            </div>
            <div id='navkeys' className={"navkeys"}>
                {renderKeys()}
            </div>
        </div >
    )
}

export default Navbar


const navigation = [
    {
        text: 'Dashboard',
        index: '/dashboard',
        icon: <DashboardIcon size={25} strokeWidth={1.2} />
    },
    {
        text: 'Analytics',
        index: '/analytics',
        icon: <AnalyticsIcon size={25} strokeWidth={1.2} />
    },
    {
        text: 'Settings',
        index: '/settings',
        icon: <SettingsIcon size={25} strokeWidth={1.2} />
    }
]