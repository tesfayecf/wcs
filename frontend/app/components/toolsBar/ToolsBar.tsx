import React from 'react'
import styles from './styles/ToolsBar.module.scss'
import SearchIcon from '@/public/svg/SearchIcon'

interface IProps {
    onCreate: () => void
}

const ToolsBar: React.FunctionComponent<IProps> = (props: IProps) => {

    return (
        <div className={styles.toolsBar}>
            <CreateButton onCreate={props.onCreate} />
            <div className={styles.searchInput}>
                <SearchInput />
            </div>
        </div>
    )
}

export default ToolsBar


interface IButtonProps {
    onCreate: () => void;
}

const CreateButton: React.FunctionComponent<IButtonProps> = (props: IButtonProps) => {

    return (
        <div className={styles.button} onClick={props.onCreate}>
            <span className={styles.text}>Create +</span>
        </div>
    )
}


interface IInputProps { }

const SearchInput: React.FunctionComponent<IInputProps> = (props: IInputProps) => {

    return (
        <div className={styles.input}>
            <SearchIcon strokeWidth={2} />
            <input className={styles.text} type="text" placeholder="Search" />
        </div>
    )
}