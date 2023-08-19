import React from 'react'
import styles from './styles/SummaryWidget.module.scss'
import ContentBox from '@/app/components/contentBox/ContentBox'
import { connect } from 'react-redux'
import { IRootState } from '@/app/utils/store/store'



type ISummaryWidgetProps = {}


const SummaryWidget: React.FunctionComponent<ISummaryWidgetProps> = (props: ISummaryWidgetProps) => {

  return (
    <ContentBox customBoxClass={styles.summary}>
      <div id="title-div" className={styles.title}>
        <p>Summary</p>
      </div>
      <div id="content-div" className={styles.content}>
        <div id='piechart-div' className={styles.chart}>
          {/* 📈 */}
        </div>
        <div className={styles.data}>
          {/* <SummaryCard title='Inflows' quantity={900} unit='liter' percentage={30} className='hide' /> */}
          {/* <SummaryCard title='Outflows' quantity={500} unit='liter' percentage={-20} className='hide' /> */}
          {/* <SummaryCard title='Savings' quantity={50} unit='liter' percentage={17} /> */}
        </div>
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
