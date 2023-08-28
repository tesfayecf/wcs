import React from 'react'

interface IWaterTankProps {
    size?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
}
const WaterTank: React.FunctionComponent<IWaterTankProps> = (props: IWaterTankProps) => {
    const size = props.size ? props.size : 75;
    const strokeWidth = props.strokeWidth ? props.strokeWidth : 1.5;
    const stroke = props.stroke ? props.stroke : "white";
    const fill = props.fill ? props.fill : "none";
    const viewBox = `0 0 ${size} ${size}`

    return (
        <svg xmlns="http://www.w3.org/2000/svg" xml: space="preserve" width="500" height="500">
            <path
                d="M350 76c-25 0-73-2-73-12V51c0-10 48-12 73-12s73 2 73 12v13c0 10-48 12-73 12zm0-34c-46 0-71 6-71 9v13c0 4 25 9 71 9s71-5 71-9V51c0-3-25-9-71-9zm0 106c-98 0-202-8-202-24a1 1 0 0 1 2 0c0 9 71 21 200 21s200-12 200-21a1 1 0 0 1 2 0c0 16-104 24-202 24z"
                transform="matrix(1.33 0 0 1.33 75 167)" vector-effect="non-scaling-stroke" />
            <path
                d="M155 356c-7 5-7 8-7 9 0 4 4 7 7 9l3 3v6c31 16 105 27 191 27 55 0 107-4 146-13 22-4 38-10 49-16v-5l3-2c3-3 5-6 5-9 0-1 0-4-5-8l-3-3v-22c-11 4-27 8-49 12-39 6-91 9-146 9-56 0-108-3-147-9-19-3-33-7-44-11v20z"
                transform="matrix(1.33 0 0 1.33 75 168)" vector-effect="non-scaling-stroke" />
            <path
                d="M154 306c-3 2-7 4-7 7 0 2 3 4 7 6l4 2v6c10 4 25 8 45 11 39 6 91 9 146 9s106-3 145-9c23-4 39-8 50-13v-4l3-3c6-3 6-5 6-5 0-3-3-5-6-6l-3-3v-33a1144 1144 0 0 1-386 0v33z"
                transform="matrix(1.33 0 0 1.33 75 168)" vector-effect="non-scaling-stroke" />
            <path
                d="M204 275a1138 1138 0 0 0 340-10v-6l4-2c5-2 5-4 5-4 0-2-3-4-5-5l-4-3v-35l-48 9a1383 1383 0 0 1-338-8v34l-5 2c-4 2-6 4-6 6l6 5 5 2v5c10 4 26 7 46 10z"
                transform="matrix(1.33 0 0 1.33 75 167)" vector-effect="non-scaling-stroke" />
            <path
                d="M349 476c99 0 167-16 195-33v-5l2-2c5-4 7-7 7-11 0-3-2-7-7-10l-2-3v-24c-11 6-27 11-48 15-39 8-91 13-147 13-72 0-154-9-191-27v22l-3 3c-5 4-8 8-8 11 0 4 3 8 8 12l3 2v6c35 20 118 30 191 30z"
                transform="matrix(1.33 0 0 1.33 75 168)" vector-effect="non-scaling-stroke" />
            <path
                d="M349 481c-70 0-152-9-191-29v36c0 2 9 12 52 21 38 8 88 12 141 12s103-4 140-12c44-9 53-19 53-21v-38c-38 21-122 31-195 31z"
                transform="matrix(1.33 0 0 1.33 75 168)" vector-effect="non-scaling-stroke" />
            <path
                d="M158 200v5c10 3 25 6 45 8a1377 1377 0 0 0 341-9v-4l5-3 5-2v-1l-5-3-5-3v-22c-4 1-18 21-39 23-11 1-26-13-40-12-13 1-24 18-37 18-14 1-28-13-40-13-15 1-28 17-39 17-12 0-19-15-38-16-12 0-25 15-39 14-13 0-25-16-38-17s-28 13-40 11c-15-2-27-21-36-24v21l-5 2c-6 2-7 4-7 4v1l7 3zM350 63c-25 0-73-3-73-12 0-10 48-12 73-12s73 2 73 12c0 9-48 12-73 12zm0-21c-46 0-71 6-71 9s25 9 71 9 71-6 71-9-25-9-71-9z"
                transform="matrix(1.33 0 0 1.33 75 167)" vector-effect="non-scaling-stroke" />
            <path
                d="M351 532c-99 0-204-16-204-45v-43c-7-6-11-12-11-19s4-14 11-19v-24c-7-5-10-11-10-17s3-12 10-17v-21c-7-4-11-9-11-15s4-11 11-15v-30c-11-6-11-12-11-15 0-6 3-10 11-14v-31c-11-4-12-9-12-13 0-7 6-11 12-14v-54a16 16 0 0 1 0-2c0-27 50-51 128-61V51c0-13 63-13 75-13s75 0 75 13v12c79 10 130 34 130 61l-1 2 1 1v54c6 3 10 7 10 13 0 4-1 8-10 13v32c6 3 9 8 9 13 0 4-1 9-9 14v32c6 4 9 9 9 14 0 6-3 10-9 15v22c5 5 8 10 8 16s-3 11-8 16v26c6 5 9 11 9 18 0 6-3 12-9 18v44c0 29-106 45-204 45zM152 127v55l-1 3c-9 3-10 6-10 9 0 2 0 5 10 9a3 3 0 0 1 1 2v35a3 3 0 0 1-1 2c-9 4-10 8-10 10s0 6 10 10a3 3 0 0 1 1 3v34a3 3 0 0 1-1 2c-6 4-9 7-9 11 0 3 1 7 9 11l1 3v23l-1 2c-6 5-8 9-8 14 0 4 3 9 8 13a3 3 0 0 1 1 2v27l-1 2c-6 5-9 10-9 16 0 5 3 11 9 16a3 3 0 0 1 1 2v44c0 19 82 39 199 39s198-20 198-39v-45l1-2c6-5 8-10 8-15s-2-10-8-15a3 3 0 0 1-1-2v-28l1-3c5-4 7-8 7-12 0-5-2-9-7-13a3 3 0 0 1-1-2v-25l1-2c7-5 8-8 8-11 0-4-3-7-8-10a3 3 0 0 1-1-3v-35l1-2c9-4 9-8 9-10s-1-6-9-9a3 3 0 0 1-1-3v-35l2-3c8-3 8-6 8-8s-1-5-8-9a3 3 0 0 1-2-2v-55a3 3 0 0 1 0-2v-2c0-24-51-47-127-56a3 3 0 0 1-3-3V51c-3-3-29-8-69-8s-66 5-69 8v14a3 3 0 0 1-3 3c-75 9-126 32-126 56l1 2-1 1z"
                transform="matrix(1.33 0 0 1.33 75 168)" vector-effect="non-scaling-stroke" />
            <path
                d="M373 52a3 3 0 0 1-3-3V34a1 1 0 0 0-1 0h-42a1 1 0 0 0-1 0v15a3 3 0 1 1-6 0V34c0-3 3-6 7-6h42a6 6 0 0 1 7 6v15c0 1-1 3-3 3z"
                transform="matrix(1.33 0 0 1.33 75 167)" vector-effect="non-scaling-stroke" />
        </svg>
    )
}

export default WaterTank