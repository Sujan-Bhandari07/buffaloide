import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Authinit from "./components/auth/Authinit"
import Public from "./components/auth/Public"
import Private from "./components/auth/Private"
import Home from "./pages/Home"
import Projectp from "./pages/Projectp"

const App = () => {
  return (
    <Routes>

      <Route element={<Authinit />}>
        {/* Public routes */}
        <Route element={<Public />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes */}
        <Route element={<Private/>}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<Projectp/>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App