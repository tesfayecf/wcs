import React from 'react'
import DashboardIcon from '@/public/svg/DashboardIcon'
import AnalyticsIcon from '@/public/svg/AnalyticsIcon'
import SettingsIcon from '@/public/svg/SettingsIcon'
import NavKey from '@/app/components/navbar/Navkey'

interface INavbarProps { }

const Navbar: React.FunctionComponent<INavbarProps> = (props: INavbarProps) => {

    const renderKeys = React.useCallback(() => {
        return navigation.map((key, index) => {
            return <NavKey key={index} text={key.text} index={key.index} icon={key.icon} />
        })
    }, [])

    return (
        <div id='navbar' className={"navbar"}>
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
        icon: <DashboardIcon size={25} strokeWidth={1.2} fill={'black'} />
    },
    {
        text: 'Analytics',
        index: '/analytics',
        icon: <AnalyticsIcon size={25} strokeWidth={1.2} fill={'black'} />
    },
    {
        text: 'Settings',
        index: '/settings',
        icon: <SettingsIcon size={25} strokeWidth={1.2} fill={'black'} />
    }
]