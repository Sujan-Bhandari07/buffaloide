import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../utils/Hooks";


const Private = () => {
const {isauth}=useAppSelector(state=>state.user)

 
  return isauth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Private;