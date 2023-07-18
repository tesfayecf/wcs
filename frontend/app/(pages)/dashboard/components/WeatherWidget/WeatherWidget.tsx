import React, { SVGAttributes } from 'react';
import styles from "./styles/WeatherWidget.module.scss"
import { HEXToVBColor, VBColorToHEX } from '@/app/utils/lib/styles';
// import getIcon from '../../data/icons/iconsMap';
// import '../styles.css'
type IWeatherWidgetProps = {}

const WeatherWidget: React.FunctionComponent<IWeatherWidgetProps> = (props: IWeatherWidgetProps) => {

    // const [weatherData, setWeatherData] = useState(dummyWeatherData);

    // const currentOptions = {
    //     method: 'GET',
    //     url: 'http://api.openweathermap.org/data/2.5/weather',
    //     params: { q: 'Girona', units: 'metric', lang: 'ca', appid: '9090aabd9a7090373b7e851151784f14' },
    // };

    // useEffect(() => {
    //     async function fetchData() {
    //         var currentWeatherData = {};
    //         await axios.request(currentOptions).then(function (response) {
    //             currentWeatherData = mapRawWeatherDataToState(response.data);
    //         });
    //         setWeatherData(currentWeatherData);
    //     };
    //     // fetchData();
    // }, []);

    return (
        <div className={styles.weather}>
            <CustomReactWeather
                data={dummyWeatherData}
                locationLabel="Girona"
                unitsLabels={{ temperature: 'ºC', windSpeed: 'Km/h' }}
                showForecast={true}
            />
        </div>

    );
};

export default WeatherWidget;


// function mapRawWeatherDataToState(rawData) {
//     var rawObj = { current: {} };
//     var date = new Date();
//     rawObj.current.date = date.toLocaleDateString();
//     rawObj.current.description = rawData.weather[0].description;
//     rawObj.current.icon = getIcon(rawData.weather[0].icon);
//     rawObj.current.temperature = {};
//     rawObj.current.temperature.current = Math.round(rawData.main.temp);
//     rawObj.current.temperature.max = Math.round(rawData.main.temp_max);
//     rawObj.current.temperature.min = Math.round(rawData.main.temp_min);
//     rawObj.current.wind = rawData.wind.speed;
//     rawObj.current.humidity = rawData.main.humidity;
//     return rawObj;
// }

type ICustomReactWeatherProps = {
    unitsLabels: {
        temperature: string,
        windSpeed: string,
    }
    data: any,
    locationLabel: string,
    showForecast: boolean
}

// const CustomReactWeather = ({ unitsLabels, data, locationLabel, showForecast, currentColor }) => {
const CustomReactWeather: React.FunctionComponent<ICustomReactWeatherProps> = (props: ICustomReactWeatherProps) => {
    const { forecast, current } = props.data;


    const startColor = "#02c8d5";
    const startColorVB = HEXToVBColor("#02c8d5");
    const endColor = VBColorToHEX(startColorVB - 5);
    const gradient = "linear-gradient(90deg, " + startColor + " 0%, " + String(endColor) + " 100%)";

    return (
        <div style={{ background: gradient }} className={styles.content}>
            <Today current={current} unitsLabels={props.unitsLabels} locationLabel={props.locationLabel}></Today>
            {props.showForecast && <Forecast unitsLabels={props.unitsLabels} forecast={forecast} />}
        </div>
    )
}

type ITodayProps = {
    current: any,
    unitsLabels: {
        temperature: string,
        windSpeed: string,
    }
    locationLabel: string,
}


const Today: React.FunctionComponent<ITodayProps> = (props: ITodayProps) => {
    const labels = { wind: "Wind", humidity: "Humidity" };
    return (
        <div className={styles.today}>
            <div className={styles.data}>
                <h2 className={styles.location}>{props.locationLabel}</h2>
                <p className={styles.date}>{props.current.date}</p>
                <div className={styles.division_line} />
                <p className={styles.temperature}>
                    {props.current.temperature.current} {props.unitsLabels.temperature}
                </p>
                <p className={styles.temperatureMM}>
                    {props.current.temperature.max} / {props.current.temperature.min}{' '}{props.unitsLabels.temperature}
                </p>
                <p className={styles.description}>{props.current.description}</p>
                <div className={styles.division_line} />
                <div className={styles.wh}>
                    <p className={styles.wind}>
                        {labels.wind}: <b>{props.current.wind}</b> {props.unitsLabels.windSpeed}
                    </p>
                    <p className={styles.humidity}>
                        {labels.humidity}: <b>{props.current.humidity}</b> %
                    </p>
                </div>
            </div>
            <div className={styles.icon}>
                <WeatherSVG path={props.current.icon} size={90} title={props.current.description} />
            </div>
        </div>

    );
};

type IForecastProps = {
    forecast: any,
    unitsLabels: {
        temperature: string,
        windSpeed: string,
    }
}

const Forecast: React.FunctionComponent<IForecastProps> = (props: IForecastProps) => {
    // TODO: put min width
    return (
        <div className={styles.forecast}>
            {props.forecast.map((day: any, i: any) => {
                if (i > 0) {
                    return (
                        <div key={day.date} className={styles.data}>
                            <p className={styles.date}>{day.date}</p>
                            <div className={styles.icon}>
                                <WeatherSVG
                                    path={day.icon}
                                    size={60}
                                    title={day.description}
                                // color={"black"}
                                />
                            </div>
                            <div className={styles.description}>{day.description}</div>
                            <div className={styles.temperature}>
                                {day.temperature.max} / {day.temperature.min}{' '}
                                {props.unitsLabels.temperature}
                            </div>
                        </div>
                    );
                }
                return '';
            })}
        </div>
    );
};

type ISVGProps = {
    title: string,
    path: any,
    size: number,
}

const WeatherSVG: React.FunctionComponent<ISVGProps> = (props: ISVGProps) => {
    return (
        <svg
            // color={props.color}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width={props.size}
            height={props.size}
            viewBox='0 -5 35 40'
        >
            <title>{props.title}</title>
            <path d={props.path} />
        </svg>
    );
};


const dummyWeatherData = {
    "current": {
        "date": "29/1/2023",
        "description": "cel net",
        "icon": "M0 20.328q0-2.484 1.547-4.414t3.969-2.477q0.641-2.938 2.969-4.805t5.359-1.867q2.953 0 5.273 1.82t3.008 4.664h0.453q2.938 0 5.016 2.070t2.078 5.008-2.078 5.023-5.016 2.086h-15.469q-1.438 0-2.758-0.563t-2.273-1.516-1.516-2.273-0.563-2.758zM2.422 20.328q0 1.906 1.375 3.273t3.313 1.367h15.469q1.938 0 3.313-1.367t1.375-3.273-1.375-3.266-3.313-1.359h-2.313q-0.25 0-0.25-0.25l-0.109-0.813q-0.25-2.359-1.977-3.914t-4.086-1.555-4.102 1.563-1.961 3.906l-0.109 0.703q0 0.25-0.266 0.25l-0.75 0.109q-1.797 0.156-3.016 1.484t-1.219 3.141zM17.172 5.797q-0.25 0.234 0.125 0.344 1.078 0.469 1.797 0.922 0.281 0.078 0.375-0.047 1.516-1.438 3.531-1.438t3.492 1.352 1.648 3.336l0.156 1.063h2.359q1.625 0 2.797 1.164t1.172 2.773q0 1.5-1.031 2.609t-2.547 1.281q-0.25 0-0.25 0.266v1.891q0 0.266 0.25 0.266 2.516-0.156 4.25-1.984t1.734-4.328q0-2.641-1.867-4.508t-4.508-1.867h-0.25q-0.656-2.5-2.742-4.117t-4.664-1.617q-3.531 0-5.828 2.641z",
        "temperature": {
            "current": 1,
            "max": 6,
            "min": -1,
        },
        "wind": 2.06,
        "humidity": 77
    },
    "forecast": [
        {
            "date": "3/1/2023",
            "description": "ennuvolat",
            "icon": "M0 20.328q0-2.484 1.547-4.414t3.969-2.477q0.641-2.938 2.969-4.805t5.359-1.867q2.953 0 5.273 1.82t3.008 4.664h0.453q2.938 0 5.016 2.070t2.078 5.008-2.078 5.023-5.016 2.086h-15.469q-1.438 0-2.758-0.563t-2.273-1.516-1.516-2.273-0.563-2.758zM2.422 20.328q0 1.906 1.375 3.273t3.313 1.367h15.469q1.938 0 3.313-1.367t1.375-3.273-1.375-3.266-3.313-1.359h-2.313q-0.25 0-0.25-0.25l-0.109-0.813q-0.25-2.359-1.977-3.914t-4.086-1.555-4.102 1.563-1.961 3.906l-0.109 0.703q0 0.25-0.266 0.25l-0.75 0.109q-1.797 0.156-3.016 1.484t-1.219 3.141zM17.172 5.797q-0.25 0.234 0.125 0.344 1.078 0.469 1.797 0.922 0.281 0.078 0.375-0.047 1.516-1.438 3.531-1.438t3.492 1.352 1.648 3.336l0.156 1.063h2.359q1.625 0 2.797 1.164t1.172 2.773q0 1.5-1.031 2.609t-2.547 1.281q-0.25 0-0.25 0.266v1.891q0 0.266 0.25 0.266 2.516-0.156 4.25-1.984t1.734-4.328q0-2.641-1.867-4.508t-4.508-1.867h-0.25q-0.656-2.5-2.742-4.117t-4.664-1.617q-3.531 0-5.828 2.641z",
            "temperature": {
                "min": 15,
                "max": 15
            },
            "wind": 2.38,
            "humidity": 58
        },
        {
            "date": "4/1/2023",
            "description": "lleugerament ennuvolat",
            "icon": "M0 20.328q0-2.484 1.547-4.414t3.969-2.477q0.641-2.938 2.969-4.805t5.359-1.867q2.953 0 5.273 1.82t3.008 4.664h0.453q2.938 0 5.016 2.070t2.078 5.008-2.078 5.023-5.016 2.086h-15.469q-1.438 0-2.758-0.563t-2.273-1.516-1.516-2.273-0.563-2.758zM2.422 20.328q0 1.906 1.375 3.273t3.313 1.367h15.469q1.938 0 3.313-1.367t1.375-3.273-1.375-3.266-3.313-1.359h-2.313q-0.25 0-0.25-0.25l-0.109-0.813q-0.25-2.359-1.977-3.914t-4.086-1.555-4.102 1.563-1.961 3.906l-0.109 0.703q0 0.25-0.266 0.25l-0.75 0.109q-1.797 0.156-3.016 1.484t-1.219 3.141zM17.172 5.797q-0.25 0.234 0.125 0.344 1.078 0.469 1.797 0.922 0.281 0.078 0.375-0.047 1.516-1.438 3.531-1.438t3.492 1.352 1.648 3.336l0.156 1.063h2.359q1.625 0 2.797 1.164t1.172 2.773q0 1.5-1.031 2.609t-2.547 1.281q-0.25 0-0.25 0.266v1.891q0 0.266 0.25 0.266 2.516-0.156 4.25-1.984t1.734-4.328q0-2.641-1.867-4.508t-4.508-1.867h-0.25q-0.656-2.5-2.742-4.117t-4.664-1.617q-3.531 0-5.828 2.641z",
            "temperature": {
                "min": 16,
                "max": 16
            },
            "wind": 1,
            "humidity": 53
        },
        {
            "date": "5/1/2023",
            "description": "lleugerament ennuvolat",
            "icon": "M0 20.328q0-2.484 1.547-4.414t3.969-2.477q0.641-2.938 2.969-4.805t5.359-1.867q2.953 0 5.273 1.82t3.008 4.664h0.453q2.938 0 5.016 2.070t2.078 5.008-2.078 5.023-5.016 2.086h-15.469q-1.438 0-2.758-0.563t-2.273-1.516-1.516-2.273-0.563-2.758zM2.422 20.328q0 1.906 1.375 3.273t3.313 1.367h15.469q1.938 0 3.313-1.367t1.375-3.273-1.375-3.266-3.313-1.359h-2.313q-0.25 0-0.25-0.25l-0.109-0.813q-0.25-2.359-1.977-3.914t-4.086-1.555-4.102 1.563-1.961 3.906l-0.109 0.703q0 0.25-0.266 0.25l-0.75 0.109q-1.797 0.156-3.016 1.484t-1.219 3.141zM17.172 5.797q-0.25 0.234 0.125 0.344 1.078 0.469 1.797 0.922 0.281 0.078 0.375-0.047 1.516-1.438 3.531-1.438t3.492 1.352 1.648 3.336l0.156 1.063h2.359q1.625 0 2.797 1.164t1.172 2.773q0 1.5-1.031 2.609t-2.547 1.281q-0.25 0-0.25 0.266v1.891q0 0.266 0.25 0.266 2.516-0.156 4.25-1.984t1.734-4.328q0-2.641-1.867-4.508t-4.508-1.867h-0.25q-0.656-2.5-2.742-4.117t-4.664-1.617q-3.531 0-5.828 2.641z",
            "temperature": {
                "min": 17,
                "max": 17
            },
            "wind": 0.69,
            "humidity": 40
        },
        {
            "date": "6/1/2023",
            "description": "cel net",
            "icon": "M0 15.375q0-0.609 0.422-1.031 0.438-0.406 1-0.406h3.406q0.578 0 0.961 0.422t0.383 1.016-0.383 1.008-0.961 0.414h-3.406q-0.578 0-1-0.422t-0.422-1zM4.766 26.922q0-0.578 0.391-1.016l2.453-2.375q0.375-0.391 0.984-0.391 0.594 0 0.992 0.375t0.398 0.953q0 0.609-0.406 1.063l-2.375 2.375q-1.016 0.797-2.047 0-0.391-0.422-0.391-0.984zM4.766 3.844q0-0.578 0.391-1.016 0.484-0.406 1.063-0.406 0.547 0 0.984 0.406l2.375 2.453q0.406 0.375 0.406 0.984 0 0.594-0.398 0.992t-0.992 0.398q-0.609 0-0.984-0.406l-2.453-2.375q-0.391-0.422-0.391-1.031zM9.016 15.375q0-2.328 1.172-4.336t3.18-3.18 4.336-1.172q1.75 0 3.359 0.695t2.773 1.859 1.852 2.773 0.688 3.359q0 2.344-1.164 4.344t-3.164 3.164-4.344 1.164-4.344-1.164-3.172-3.164-1.172-4.344zM11.844 15.375q0 2.438 1.711 4.164t4.148 1.727 4.164-1.727 1.727-4.164q0-2.406-1.727-4.109t-4.164-1.703q-2.422 0-4.141 1.703t-1.719 4.109zM16.281 28.328q0-0.594 0.414-1t1.008-0.406q0.609 0 1.016 0.406t0.406 1v3.313q0 0.609-0.414 1.031t-1.008 0.422-1.008-0.422-0.414-1.031v-3.313zM16.281 2.5v-3.406q0-0.578 0.422-1t1-0.422 1 0.422 0.422 1v3.406q0 0.578-0.414 0.961t-1.008 0.383-1.008-0.383-0.414-0.961zM25.484 24.469q0-0.578 0.375-0.938 0.375-0.391 0.938-0.391 0.609 0 1 0.391l2.438 2.375q0.406 0.438 0.406 1.016t-0.406 0.984q-1 0.781-2 0l-2.375-2.375q-0.375-0.422-0.375-1.063zM25.484 6.266q0-0.625 0.375-0.984l2.375-2.453q0.438-0.406 0.984-0.406 0.594 0 1.008 0.422t0.414 1q0 0.625-0.406 1.031l-2.438 2.375q-0.453 0.406-1 0.406-0.563 0-0.938-0.398t-0.375-0.992zM29.25 15.375q0-0.594 0.406-1.031 0.406-0.406 0.953-0.406h3.375q0.578 0 1.008 0.43t0.43 1.008-0.43 1-1.008 0.422h-3.375q-0.578 0-0.969-0.414t-0.391-1.008z",
            "temperature": {
                "min": 16,
                "max": 16
            },
            "wind": 1.17,
            "humidity": 43
        }
    ],
}