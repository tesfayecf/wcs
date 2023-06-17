import React from 'react';

type IProps = {}

const SettingsButton: React.FunctionComponent<IProps> = (props: IProps) => {

    return (
        <div className="settings-button-container">
            <button type="button">
                Settings
            </button>

        </div>
    );
};

export default SettingsButton;
