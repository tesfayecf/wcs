import '../styles/globals.scss'
import AppHandler from './app/AppHandler'
import AppStoreInitializer from './app/AppStoreInitializer'
import DashboardHandler from './dashboard/DashboardHandler'
import DashboardStoreInitializer from './dashboard/DashboardStoreInitializer'

import Navbar from './components/navbar/Navbar'

export const metadata = {
  title: 'WCS App',
  description: '',
}

type IAppLayoutProps = {
  children: React.ReactNode[]
}

const appHandler = AppHandler.getInstance();
const appInitialStore = appHandler.setInitialAppInfo();

const dashboardHandler = DashboardHandler.getInstance();
const dasboardInitialStore = dashboardHandler.setInitialDashboardInfo();

export default function RootLayout({ children }: IAppLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>WCS</title>
      </head>
      <body>
        <AppStoreInitializer {...appInitialStore} />
        <DashboardStoreInitializer {...dasboardInitialStore} />
        <header>
          <nav>
            <Navbar />
          </nav>
        </header>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="rootLayout">
          {children}
        </div>
      </body>
    </html>
  )
}
