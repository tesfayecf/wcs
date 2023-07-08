import React from 'react';
import styles from "./styles/WaterTankWidget.module.scss"
import WatertankSVG from '@/public/svg/WaterTankSG';

type IWatertankProps = {
    id: number,
    name: string,
    type: string,
    capacity: number,
    dimensions: string,
    brand: string,
    material: string,
    status: boolean
}


const WaterTankWidget: React.FunctionComponent<IWatertankProps> = (props: IWatertankProps) => {

    const color = "black";
    const size = 250;
    const path = "C:/Users/tesfa/Documents/Programming/WaterControlSystem_project/Code/WCS/frontend/WCS_gui/src/data/svgs/water-tank"

    const status = props.status ? "ON" : "OFF";
    const statusCol = props.status ? "green" : "red";
    const levelSataus = props.status ? 90 : "-"

    return (
        <div className={styles.watertank}>
            {props.status ? " " : <div className={styles.watertank_disabled} />}
            <div className={styles.watertank_content}>
                <div className={styles.watertank_content_svg}>
                    <div>
                        {/* <img src={path} width={size} height={size} className='p-4 items-center justify-center' /> */}
                        {/* {WaterTankSVG} */}
                        <WatertankSVG height={size} width={size} />
                    </div>
                    <div className={styles.watertank_content_svg_volume}>
                        <p className={styles.watertank_content_svg_volume_text}> {levelSataus} / {props.capacity} L</p>
                    </div>
                </div>

                <div className={styles.watertank_content_data}>
                    <div id="title-div" className={styles.watertank_content_data_name}>
                        <p>{props.name}</p>
                    </div>
                    <div className={styles.watertank_content_data_list}>
                        <ul className="list-disc">
                            <li key={props.type}>Type: {props.type}</li>
                            <li key={props.capacity}>Capacity: {props.capacity} L</li>
                            <li key={props.dimensions}>Dimensions: {props.dimensions}</li>
                            <li key={props.material}>Material: {props.material}</li>
                            <li key={props.brand}>Brand: {props.brand}</li>
                        </ul>
                    </div>
                    <div className={styles.watertank_content_data_status}>
                        <p className={styles.watertank_content_data_status_text} style={{ color: statusCol }}> Status {status}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WaterTankWidget;
