import { useEffect } from "react";



import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../../utils/Hooks";
import { useGetprofileQuery } from "../../store/Userapi";
import { setUser } from "../../store/Userslice";

const Authinit = () => {
  const dispatch = useAppDispatch();
  const {data:gd, error, isSuccess, isError, isLoading, isUninitialized } = useGetprofileQuery({});
  console.log(error,isSuccess,isUninitialized)

  useEffect(() => {
    if (isSuccess) dispatch(setUser({
        name:gd.payload.name,
        email:gd.payload.email,
        avatar:gd.payload.avatar,
        isauth:true
      }))


    if (isError) dispatch(setUser({
         name:"",
        email:"",
        avatar:"",
        isauth:false
      }))
  }, [isSuccess, isError, dispatch,gd]);

  // Gate: don't render routes until we know the auth state
  if (isLoading || isUninitialized) {
    return null; // or null, but a spinner avoids layout flash too
  }

  return <Outlet />;
};

export default Authinit;