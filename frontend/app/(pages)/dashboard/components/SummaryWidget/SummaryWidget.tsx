'use client'
import React from 'react'
import ContentBox from '@/app/components/contentBox/ContentBox'
import { connect } from 'react-redux'
import { IRootState } from '@/app/utils/store/store'

type ISummaryWidgetProps = {}

const SummaryWidget: React.FunctionComponent<ISummaryWidgetProps> = (props: ISummaryWidgetProps) => {

  return (
    <ContentBox customBoxClass={"summary"}>
      <div id="content" className={"content"}>

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
