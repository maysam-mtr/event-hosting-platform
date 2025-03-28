import { RouterProvider } from "react-router-dom";
import {Router} from "./router/router";
import { UserProvider } from "./contexts/user-state-context";

function App() {

  return (
    <>
      <UserProvider>
        <RouterProvider router={Router} />
      </UserProvider>
    </>
  )
}

export default App
