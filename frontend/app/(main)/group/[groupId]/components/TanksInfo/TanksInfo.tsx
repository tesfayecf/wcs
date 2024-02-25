'use client'
import React from 'react'
import TankWidget from '@/app/(main)/group/[groupId]/components/TankWidget/TankWidget'
import useGroupStore from '@/app/(main)/group/[groupId]/store'

interface ITankElementsProps { }

const TanksInfo: React.FunctionComponent<ITankElementsProps> = (props: ITankElementsProps) => {
    const tanks = useGroupStore(state => state.tanks)

    const renderTanksInfo = React.useCallback(() => {
        const widgets = tanks.map((tank, index) =>
            <TankWidget tank={tank} key={index} />
        )

        return widgets;
    }, [tanks])

    return renderTanksInfo()
}

export default TanksInfo