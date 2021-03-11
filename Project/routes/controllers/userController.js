import * as userService from "../../services/userService.js";
import {bcrypt,validate,required,minLength,isEmail} from "../../deps.js"

  const showreg = async({render,session, response}) => {
    const user = await session.get('authenticated')
    if (user){
       response.redirect('/')
    }
    const data = {
      errors: null,
      email: "",
      password: "",
      verification: ""
    }
    render('auth/registration.ejs',data);
  }

  const login = async({request,response,render, session}) => {
    const body = request.body();
    const params = await body.value;
  
    const email = params.get('email');
    const password = params.get('password');
    
    const errors = {};

    const res = await userService.getEmail(email)
    if (res.rowCount === 0) {
        errors.error = "Invalid email or password"
        render('auth/login.ejs',errors)
        return
    }


    const userObj = res.rowsOfObjects()[0];

    const hash = userObj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
      errors.error = "Invalid email or password"
      render('auth/login.ejs',errors)
      return
    }

    await session.set('authenticated', true);
    await session.set('user', {
      id: userObj.id,
      email: userObj.email
    });
    render('auth/loginok.ejs')  
  }

  
  const register = async({render,request, response, session}) => {
    const body = request.body();
    const params = await body.value;

    
    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');

    const validationRules = {
      password: [required, minLength(4)],
      email: [required, isEmail]
  };
    

    const data = {
      password: password,
      email: email,
      errors: null
    }
  
    let [passes, errors] = await validate(data, validationRules);
    if (password != verification){
      passes = false
      errors.match = {
        verification: "password did not match"
      }
    }

    const res = await userService.getEmail(email)
    if (res.rowCount>0){
        passes = false
        errors.inuse = {
          emailinuse: "The email is already in use"
        }
    }

    if (passes){
    const hash = await bcrypt.hash(password);
    userService.addUser(email,hash)

    response.redirect('/login')
  } else {
    data.errors = errors
    data.password = ""
    render('auth/registration.ejs',data)
  }

  }

  const showlogin = async({render, session, response}) => {
    const user = await session.get('authenticated')
    if (user){
       response.redirect('/')
    }
    const errors = {
      error: null
    }
    render('auth/login.ejs',errors);
  }
  const showLogout = async({session,render, response}) => {
    const user = await session.get('authenticated')
    if (!user){
       response.redirect('/')
    }
    render('auth/logout.ejs');
  }

  const logout = async({session,response}) => {
    await session.set('authenticated', false);
    await session.set('user', null)
      response.redirect('/')
  }


  export {showLogout,logout,showlogin,showreg,register,login}