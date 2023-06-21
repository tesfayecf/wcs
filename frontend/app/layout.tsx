import '../styles/globals.scss'
import Footer from './components/fotter/Footer'
import Navbar from './components/navbar/Navbar'
import AppStoreInitializer from './AppStoreInitializer'
import AppHandler from './AppHandler'
import { AppStore, DashboardStore } from './store/store'
import DashboardHandler from './dashboard/DashboardHandler'
import DashboardStoreInitializer from './dashboard/DashboardStoreInitializer'

export const metadata = {
  title: 'WCS App',
  description: '',
}

type IAppLayoutProps = {
  children: React.ReactNode[]
}

const appHandler: AppHandler = AppHandler.getInstance();
const initialAppStore: AppStore = appHandler.setInitialAppInfo();

const dashboardHandler: DashboardHandler = DashboardHandler.getInstance();
const initailDasboardStore: DashboardStore = dashboardHandler.setInitialDashboardInfo();


export default function RootLayout({ children }: IAppLayoutProps) {


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>WCS</title>
      </head>
      <body>
        <AppStoreInitializer {...initialAppStore} />
        <DashboardStoreInitializer {...initailDasboardStore} />
        <header>
          <nav>
            <Navbar />
          </nav>
        </header>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="rootLayout">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
