import React from 'react'
import styles from './styles/SummaryWidget.module.scss'

type ISummaryWidgetProps = {}


const SummaryWidget: React.FunctionComponent<ISummaryWidgetProps> = (props: ISummaryWidgetProps) => {
  return (

    <div className={styles.summary_main}>
      <div id="title-div" className={styles.summary_main_title}>
        <p>Summary</p>
      </div>
      <div id="content-div" className={styles.summary_main_content}>
        {/* <div className="pie-chart-container">
          <Pie id="pie-chart" data={ecomPieChartData} legendVisiblity={true} height="230px" width="350px" />
        </div> */}
        <div className={styles.summary_main_content_data}>
          <div className={styles.summary_main_content_data_card}>
            <p className={styles.summary_main_content_data_card_title}> Inflows </p>
            <p className={styles.summary_main_content_data_card_element}> 900 L </p>
            <p className={styles.summary_main_content_data_card_element}> ↑ 30% </p>
          </div>
          <div className={styles.summary_main_content_data_card}>
            <p className={styles.summary_main_content_data_card_title}> Outflows </p>
            <p className={styles.summary_main_content_data_card_element}> 500 L </p>
            <p className={styles.summary_main_content_data_card_element}> ↓ 20% </p>
          </div>
          <div className={styles.summary_main_content_data_card}>
            <p className={styles.summary_main_content_data_card_title}> Savings </p>
            <p className={styles.summary_main_content_data_card_element}> 50 € </p>
            <p className={styles.summary_main_content_data_card_element}> ↑ 33% </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryWidget;