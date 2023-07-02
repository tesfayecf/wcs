import '../styles/globals.scss'
import Footer from './components/fotter/Footer'
import Navbar from './components/navbar/Navbar'

import { AppStore } from './app/AppTypes'
import { AuthStore } from './auth/AuthTypes'
import { DashboardStore } from './dashboard/DashboardTypes'

import AppHandler from './app/AppHandler'
import AuthHandler from './auth/AuthHandler'
import DashboardHandler from './dashboard/DashboardHandler'

import AppStoreInitializer from './app/AppStoreInitializer'
import AuthStoreInitializer from './auth/AuthStoreInitializer'
import DashboardStoreInitializer from './dashboard/DashboardStoreInitializer'

export const metadata = {
  title: 'WCS App',
  description: 'Web app to control water resources',
}

type IAppLayoutProps = {
  children: React.ReactNode[]
}

const appHandler: AppHandler = AppHandler.getInstance();
const authHandler: AuthHandler = AuthHandler.getInstance();
const dashboardHandler: DashboardHandler = DashboardHandler.getInstance();

const initialAppStore: AppStore = appHandler.setInitialAppInfo();
const initialAuthStore: AuthStore = authHandler.setInitialAuthInfo();
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
        <AuthStoreInitializer {...initialAuthStore} />
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
