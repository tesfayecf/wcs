import React from 'react'
import ContentBox from '@/app/components/contentBox/ContentBox'
import SummaryPieChart from '@/app/(main)/dashboard/components/SummaryWidget/SummaryPieChart'
import SummaryBarChart from '@/app/(main)/dashboard/components/SummaryWidget/SummaryBarChart'

type ISummaryWidgetProps = {}

const SummaryWidget: React.FunctionComponent<ISummaryWidgetProps> = (props: ISummaryWidgetProps) => {

  return (
    <ContentBox customBoxClass={"summary"}>
      <div className={"summaryContent"}>
        <SummaryPieChart />
        <SummaryBarChart />
      </div>
    </ContentBox>

  )
}

export default SummaryWidget