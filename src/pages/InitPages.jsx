import { Outlet } from "react-router"
import 'bootstrap/dist/css/bootstrap.min.css';

const InitPages = () => {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default InitPages