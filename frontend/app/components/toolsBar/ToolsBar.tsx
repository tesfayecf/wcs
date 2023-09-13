import React from 'react'
import SearchIcon from '@/public/svg/SearchIcon'

interface IProps {
    onCreate: () => void
}

const ToolsBar: React.FunctionComponent<IProps> = (props: IProps) => {

    return (
        <div className={"toolsBar"}>
            <CreateButton onCreate={props.onCreate} />
            <div className={"searchInput"}>
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
        <div className={"button"} onClick={props.onCreate}>
            <span className={"text"}>Create +</span>
        </div>
    )
}


interface IInputProps { }

const SearchInput: React.FunctionComponent<IInputProps> = (props: IInputProps) => {

    return (
        <div className={"input"}>
            <SearchIcon strokeWidth={2} />
            <input className={"text"} type="text" placeholder="Search" />
        </div>
    )
}