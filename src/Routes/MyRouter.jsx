import { createBrowserRouter } from "react-router"
import InitPages from "../pages/InitPages"
import Home from "../pages/Home/Home"

const MyRouter = createBrowserRouter([
    {
        path: "/",
        element: <InitPages />,
        children: [
            {
                path: "/",
                element: <Home />
            }
        ]
    }
])

export default MyRouter