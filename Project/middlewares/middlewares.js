import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const redirectMiddleware = async({session, response,request},next) => {
    if (!(request.url.pathname.startsWith('/auth')) && !request.url.pathname.startsWith('/api') && !(request.url.pathname==='/')){
        const auth = await session.get("authenticated")
        if (auth){
            await next();
        } else {
            response.redirect("/auth/login")
        }
    } else {
        await next();
    }
}

const requestsMiddleware = async({ request, session}, next) => {
    const user = await session.get("user")
    let id = "undef"
    if (user) {
        id = user.id
    }
    const time = new Date()
    await next();
    console.log(`${request.method} ${request.url.pathname} ${time} user:${id}`);
  }
  
  const serveStaticFilesMiddleware = async(context, next) => {
    if (context.request.url.pathname.startsWith('/static')) {
      const path = context.request.url.pathname.substring(7);
    
      await send(context, path, {
        root: `${Deno.cwd()}/static`
      });
    
    } else {
      await next();
    }
  }




export { errorMiddleware , redirectMiddleware, requestsMiddleware, serveStaticFilesMiddleware};