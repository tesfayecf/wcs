import React from 'react'
import SearchIcon from '@/public/svg/SearchIcon'
import ContentBox from '@/app/components/contentBox/ContentBox'

interface IProps {
    onCreate: () => void
}

const ToolsBar: React.FunctionComponent<IProps> = (props: IProps) => {

    return (
        <ContentBox customBoxClass={"toolsBar"}>
            <div className={"toolsBarContent"}>
                <div className={"button"} onClick={props.onCreate}>
                    <span className={"text"}>CREATE</span>
                </div>
            </div>
        </ContentBox>
    )
}

export default ToolsBar

interface IInputProps { }

const SearchInput: React.FunctionComponent<IInputProps> = (props: IInputProps) => {

    return (
        <div className={"input"}>
            <SearchIcon strokeWidth={2} />
            <input className={"text"} type="text" placeholder="Search" />
        </div>
    )
}