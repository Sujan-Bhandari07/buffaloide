import proxy from "express-http-proxy"

export const proxywithheader=(serviceurl:string)=>{
    return proxy(serviceurl,{
        proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
            if (srcReq.user) {
        proxyReqOpts.headers["id"] = srcReq.user.toString()
    }
    return proxyReqOpts
        }
    })
}