import type { VerticalNavItems } from '@layouts/types'
import appsAndPages from './apps-and-pages'
import charts from './charts'
import dashboard from './dashboard'
import finances from './finances'
import forms from './forms'
import others from './others'
import records from './records'
import settings from './settings'
import uiElements from './ui-elements'

export default [...records, ...finances, ...settings, ...dashboard, ...appsAndPages, ...uiElements, ...forms, ...charts, ...others] as VerticalNavItems
