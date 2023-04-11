import { useRoutes } from 'react-router-dom'
import { routes } from 'island:routes';

export const Content = () => {
  return useRoutes(routes)
}
