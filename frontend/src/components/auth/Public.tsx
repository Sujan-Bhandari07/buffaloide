import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../utils/Hooks";


const Public = () => {
  const {isauth}=useAppSelector(state=>state.user)
  

  return isauth ? <Navigate to="/" replace /> : <Outlet />;
};

export default Public;