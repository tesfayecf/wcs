import React from 'react'
import { ISummary } from '@/app/(app)/dashboard/types'
import ContentBox from '@/app/components/contentBox/ContentBox'
import SummaryStatus from '@/app/(app)/dashboard/components/SummaryWidget/SummaryStatus'
import SummaryLevel from '@/app/(app)/dashboard/components/SummaryWidget/SummaryLevel'

type ISummaryWidgetProps = {
  summary: ISummary
}

const SummaryWidget: React.FunctionComponent<ISummaryWidgetProps> = (props: ISummaryWidgetProps) => {

  return (
    <ContentBox customBoxClass={"summary"}>
      <div className={"summaryContent"}>
        <SummaryStatus summaryStatus={props.summary.status} />
        <SummaryLevel summaryLevel={props.summary.level} />
      </div>
    </ContentBox>

  )
}

export default SummaryWidget