'use client'
import React from 'react'
import { connect } from 'react-redux'
import ContentBox from '@/app/components/contentBox/ContentBox'
import { IRootState } from '@/app/utils/store/store'
import SummaryPieChart from '@/app/(pages)/dashboard/components/SummaryWidget/SummaryPieChart'
import SummaryBarChart from '@/app/(pages)/dashboard/components/SummaryWidget/SummaryBarChart'

type ISummaryWidgetProps = {}

const SummaryWidget: React.FunctionComponent<ISummaryWidgetProps> = (props: ISummaryWidgetProps) => {
  // const [page, setPage] = React.useState(0);

  // const renderPageButtons = React.useCallback(() => {
  //   return (
  //     <div className={"buttons"}>
  //       <button onClick={() => setPage(0)} style={{ all: "unset" }}>
  //         <span className={"dot"} style={{ backgroundColor: page == 0 ? "black" : "#67605f" }}></span>
  //       </button>
  //       <button onClick={() => setPage(1)} style={{ all: "unset" }}>
  //         <span className={"dot"} style={{ backgroundColor: page == 1 ? "black" : "#67605f" }}></span>
  //       </button>
  //     </div>
  //   )
  // }, [page])

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