'use client'
import React from 'react'
import { connect } from 'react-redux'
import ContentBox from '@/app/components/contentBox/ContentBox'
import { IRootState } from '@/app/utils/store/store'
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

const mapStateToProps = (state: IRootState) => {
  return {
    summaryData: state.dashboard.summary
  }
}

export default connect(mapStateToProps, {})(SummaryWidget)