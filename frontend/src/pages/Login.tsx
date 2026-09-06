import { useEffect, useState } from "react";
import back from "../assets/loginback.jpg";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleprovider } from "../utils/Firebase";
import { useLoginMutation } from "../store/Userapi";
import { useAppDispatch } from "../utils/Hooks";
import { setUser } from "../store/Userslice";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "signup";

const Login = () => {
  const navigate=useNavigate()
  const [mode, setMode] = useState<Mode>("login");
  const isSignup = mode === "signup";
  const dispatch=useAppDispatch()

 


 const[login,{data:gd,isError:gie,error:ge,isSuccess:gis,isLoading:gil}]= useLoginMutation()



const handlelogin = async () => {


  try {


    const data = await signInWithPopup(auth, googleprovider);

    console.log(data);

    const token = await data.user.getIdToken();

    if (token) {
      const res = await login({ tokens: token }).unwrap();

      if (res.success) {
        console.log(res);
      }
    }
  } catch (error) {
    console.error(error);
  } 
};
  useEffect(() => {


    if(gis){
      dispatch(setUser({
        name:gd.payload.name,
        email:gd.payload.email,
        avatar:gd.payload.avatar,
        isauth:true
      }))
      navigate("/")

    }
    if(gie && ge && "data" in ge){
      dispatch(setUser({
         name:"",
        email:"",
        avatar:"",
        isauth:false
      }))
    }
  
    
  }, [gis,gd,gie,ge,dispatch,navigate])
  

  return (
    <div className="h-screen w-screen relative flex justify-center items-center bg-[#0d1117]">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        src={back}
        alt=""
      />

      <div className="relative z-10 w-[75%] max-w-275 h-[85%] flex rounded-3xl overflow-hidden border border-[#30363d] shadow-2xl shadow-black/60">
        {/* Form panel */}
        <div className="w-[54%] bg-[#161b22] flex flex-col justify-center items-center gap-8 px-14">
          <div className="w-full flex flex-col gap-8">
            {/* Brand mark */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#238636] flex items-center justify-center text-lg">
                🦬
              </div>
              <span className="text-[#f0f6fc] font-semibold text-lg">
                Buffalo<span className="text-[#58a6ff]">IDE</span>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[13px] text-[#3fb950]">
                ➜ {isSignup ? "create-account" : "welcome-back"}
              </span>
              <h1 className="font-semibold text-[28px] leading-tight text-[#f0f6fc]">
                {isSignup ? "Set up your workspace" : "Sign in to your workspace"}
              </h1>
              <p className="text-[#8b949e] text-sm">
                {isSignup
                  ? "Create an account to start building with AI assistance."
                  : "Enter your details to pick up where you left off."}
              </p>
            </div>

            <form className="flex flex-col gap-4">
              {isSignup && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-[#8b949e]" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="e.g. sujanb"
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3.5 py-2.5 text-sm text-[#f0f6fc] placeholder:text-[#484f58] outline-none focus:border-[#58a6ff] transition-colors"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-[#8b949e]" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3.5 py-2.5 text-sm text-[#f0f6fc] placeholder:text-[#484f58] outline-none focus:border-[#58a6ff] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] text-[#8b949e]" htmlFor="password">
                    Password
                  </label>
                  {!isSignup && (
                    <span className="text-[12px] text-[#58a6ff] cursor-pointer hover:underline">
                      Forgot password?
                    </span>
                  )}
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3.5 py-2.5 text-sm text-[#f0f6fc] placeholder:text-[#484f58] outline-none focus:border-[#58a6ff] transition-colors"
                />
              </div>

              <button
            type="button"
                className="mt-2 bg-[#238636] hover:bg-[#2ea043] transition-colors text-white text-sm font-semibold rounded-lg py-2.5 cursor-pointer"
              >
                {isSignup ? "Create account" : "Sign in"}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#30363d]" />
              <span className="text-[12px] text-[#484f58]">or</span>
              <div className="h-px flex-1 bg-[#30363d]" />
            </div>

            <button
              type="button"
              onClick={handlelogin}
              disabled={gil}


              className="flex items-center justify-center gap-2.5 bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] transition-colors rounded-lg py-2.5 text-sm text-[#f0f6fc] cursor-pointer"
            >
              <FcGoogle size={18} />
              Continue with Google
            </button>

            <div className="text-center text-[13px] text-[#8b949e]">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                onClick={() => setMode(isSignup ? "login" : "signup")}
                className="text-[#58a6ff] font-medium cursor-pointer hover:underline"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </span>
            </div>
          </div>
        </div>

        {/* Visual panel */}
        <div className="w-[46%] relative flex flex-col justify-end p-9 bg-[#0d1117]">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={back}
            alt=""
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent" />

          <div className="relative z-10 bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#21262d]">
              <span className="text-[11px] text-[#8b949e] font-mono">
                terminal — session.sh
              </span>
              <span className="text-[10px] text-[#6e7681]">● ● ●</span>
            </div>
            <div className="px-4 py-3.5 font-mono text-[13px] leading-[1.9]">
              <div className="text-[#58a6ff]">
                <span className="text-[#3fb950]">➜</span>{" "}
                <span className="text-[#c9d1d9]">buffaloide</span>{" "}
                <span className="text-[#8b949e]">status</span>
              </div>
              <div className="text-[#3fb950]">✓ AI agents online</div>
              <div className="text-[#f0f6fc]">
                Build faster with <span className="text-[#58a6ff]">BuffaloIDE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;