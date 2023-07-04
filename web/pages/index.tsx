import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { CCNextPage } from '../types/base-next-page'
import TopNav from '../components/top-nav'

const inter = Inter({ subsets: ['latin'] })

const Home: CCNextPage<{}> = (props: any) => {
  return (
    
      <div> 
        <div>
          <TopNav/> </div>
      </div>
  )
}
Home.auth =false
export default Home;
