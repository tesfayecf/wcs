import React from 'react'
import { connect } from 'react-redux'
import styles from './styles/Header.module.scss'
import ContentBox from '../contentBox/ContentBox'

interface IHeaderProps extends ReturnType<typeof mapStateToProps> { }

const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
    return (
        <div id="header" className={styles.header}>
            <HeaderCard />
            <HeaderCard />
            <HeaderCard />
        </div>
    )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(Header)

interface IHeaderCardProps {

}

const HeaderCard: React.FunctionComponent<IHeaderCardProps> = (props: IHeaderCardProps) => {
    return (
        <ContentBox customBoxClass={styles.headerCard}>
            <div id="headerCard" >
                header
            </div>
            <div>
                header2
            </div>
        </ContentBox>
    )
}
