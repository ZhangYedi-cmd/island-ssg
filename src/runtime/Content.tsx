import {A} from "../../docs/guide/a";
import {B} from "../../docs/b";
import {useRoutes} from 'react-router-dom'

const routes = [
  {
    path: '/guide/a',
    element: <A/>
  },
  {
    path: '/b',
    element: <B/>
  }
]

export const Content = () => {
  const routeElement = useRoutes(routes)
  return routeElement
}
