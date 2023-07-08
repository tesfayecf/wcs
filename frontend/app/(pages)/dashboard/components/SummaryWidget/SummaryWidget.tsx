import React from 'react'
import styles from './styles/SummaryWidget.module.scss'

type ISummaryWidgetProps = {}


const SummaryWidget: React.FunctionComponent<ISummaryWidgetProps> = (props: ISummaryWidgetProps) => {
  return (

    <div className={styles.summary}>
      <div id="title-div" className={styles.summary_title}>
        <p>Summary</p>
      </div>
      <div id="content-div" className={styles.summary_content}>
        <div id='piechart-div' className={styles.summary_content_pie_chart}>
          📈
        </div>
        <div className={styles.summary_content_data}>
          <SummaryCard title='Inflows' quantity={900} unit='liter' percentage={30} />
          <SummaryCard title='Outflows' quantity={500} unit='liter' percentage={-20} />
          <SummaryCard title='Savings' quantity={50} unit='liter' percentage={17} />
        </div>
      </div>
    </div>
  )
}

export default SummaryWidget;

type ISummaryCardProps = {
  title: string,
  quantity: number,
  unit: "euro" | "liter"
  percentage: number
}


const SummaryCard: React.FunctionComponent<ISummaryCardProps> = (props: ISummaryCardProps) => {
  var percentageText = ""
  if (props.percentage <= 0) {
    percentageText = "↓ " + -1 * props.percentage + " %";
  } else {
    percentageText = "↑ " + props.percentage + " %";
  }

  var quantityText = String(props.quantity);
  if (props.unit === "euro") {
    quantityText += " €"
  } else if (props.unit === "liter") {
    quantityText += " L"
  }

  return (
    <div className={styles.summary_content_data_card}>
      <p className={styles.summary_content_data_card_title}> {props.title} </p>
      <p className={styles.summary_content_data_card_element}> {quantityText}</p>
      <p className={styles.summary_content_data_card_element}> {percentageText} </p>
    </div>
  )
}
