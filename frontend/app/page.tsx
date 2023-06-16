import React from "react";
import SettingsButton from "./SettingsButton";
import Sidebar from "./Sidebar";

type IProps = {}

const App: React.FunctionComponent<IProps> = (props: IProps) => {
    return (
        <div >
            <div>
                <h1>App</h1>
                <SettingsButton />
                <Sidebar />
            </div>
        </div >
    )
}

export default App;