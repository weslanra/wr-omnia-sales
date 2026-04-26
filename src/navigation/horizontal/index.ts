import type { HorizontalNavItems } from '@layouts/types'
import apps from './apps'
import charts from './charts'
import dashboard from './dashboard'
import finances from './finances'
import forms from './forms'
import misc from './misc'
import pages from './pages'
import records from './records'
import settings from './settings'
import tables from './tables'
import uiElements from './ui-elements'

export default [...dashboard, ...apps, ...pages, ...uiElements, ...forms, ...tables, ...charts, ...misc, ...finances, ...records, ...settings] as HorizontalNavItems
