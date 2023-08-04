import React from 'react'
import styles from './styles/SummaryWidget.module.scss'
import ContentBox from '@/app/components/contentBox/ContentBox'

type ISummaryWidgetProps = {}


const SummaryWidget: React.FunctionComponent<ISummaryWidgetProps> = (props: ISummaryWidgetProps) => {
  return (
    <ContentBox customBoxClass={styles.summary}>
      <div id="title-div" className={styles.title}>
        <p>Summary</p>
      </div>
      <div id="content-div" className={styles.content}>
        <div id='piechart-div' className={styles.chart}>
          📈
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

export default SummaryWidget;

type ISummaryCardProps = {
  title: string,
  quantity: number,
  unit: "euro" | "liter"
  percentage: number
  className?: string;
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
    <div className={`${styles.card} ${props.className}`}>
      <p className={styles.title}> {props.title} </p>
      <p className={styles.element}> {quantityText}</p>
      <p className={styles.element}> {percentageText} </p>
    </div >
  )
}
