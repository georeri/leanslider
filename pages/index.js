import { useCallback, useEffect, useState } from 'react'
import Slider from '../components/Slider'
import styles from '../styles/home.module.css'
import prisma from '../db/prisma'


export const getStaticProps = async ({ req }) => {
  const sliders = await prisma.slider.findMany({
  })
  return { props: { sliders }, 
  revalidate: 1,};
};

const Home = (props) => {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => {
    setCount((v) => v + 1)
  }, [setCount])
  
  return (
    <main className={styles.main}>
      <h1>Lean Slider Game</h1>
      <p>
        Move each slider to the opposite end. Don't foget to time it!
      </p>
      <hr className={styles.hr} />
      
      <div>
        {props.sliders.map((myslider) => (
          <div key={myslider.SLIDER_ID} className="Slider">
            <Slider sliderVal={myslider.SLIDER_VALUE} id={myslider.SLIDER_ID} />
          </div>
        ))}
      </div>
      <hr className={styles.hr} />
    </main>
  )

  
}



export default Home