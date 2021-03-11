import { superoak, assertEquals,assert } from "../deps.js";
import * as summaryController from "../routes/controllers/summaryController.js"
import { app } from "../app.js"

//most of my POST functionalities use redirection, which seems to not work with superoak as it redirects to POST, which limits my testing quite a bit


Deno.test({
  name: "GET to root path returns code 200", 
  async fn()  {
    const testClient = await superoak(app);
    await testClient.get("/").expect(200)
},
sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
  name : "GET to /behavior/summary path returns code 200 and renders correct page",
   async fn() {
let testClient = await superoak(app);
  let res = await testClient
    .post("/auth/login")
    .send("email=a@a&password=a")

  let headers = res.headers["set-cookie"];
  let cookie = headers.split(";")[0];

  const testClient2 = await superoak(app);
  const response = await testClient2.get('/behavior/summary')
    .set("Cookie", cookie)
    .expect(200)    
    assert(response.text.includes("Month"))
  },
  sanitizeResources: false,
    sanitizeOps: false
});

  Deno.test({
    name: "POST to /auth/login path returns code 200 and render the correct page",
     async fn() {
    let testClient = await superoak(app);
    let res = await testClient
      .post("/auth/login")
      .send("email=a@a&password=a")
      .expect(200)
      assert(res.text.includes("Welcome back!"))
      },
      sanitizeResources: false,
    sanitizeOps: false
    });

Deno.test({
  name: "GET to /behavior/reporting path returns code 200 and renders correct page", 
  async fn() {
  let testClient = await superoak(app);
  let res = await testClient
          .post("/auth/login")
          .send("email=a@a&password=a")
        
  let headers = res.headers["set-cookie"];
  let cookie = headers.split(";")[0];
        
  const testClient2 = await superoak(app);
  const response = await testClient2.get('/behavior/reporting')
  .set("Cookie", cookie)
  .expect(200)    
  assert(response.text.includes("Choose morning/evening report"))
          },
          sanitizeResources: false,
          sanitizeOps: false 
        });

Deno.test({
  name: "GET to /behavior/reporting/morning path returns code 200 and renders correct page",
   async fn() {
  let testClient = await superoak(app);
  let res = await testClient
          .post("/auth/login")
          .send("email=a@a&password=a")
                  
  let headers = res.headers["set-cookie"];
  let cookie = headers.split(";")[0];
                  
  const testClient2 = await superoak(app);
  const response = await testClient2.get('/behavior/reporting/morning')
  .set("Cookie", cookie)
  .expect(200)

  assert( response.text.includes("Morning"))
  
 
},
sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
  name:"GET to /auth/registration redirects the user to root if already logged in", 
  async fn() {
    let testClient = await superoak(app);
      let res = await testClient
        .post("/auth/login")
        .send("email=a@a&password=a")
    
      let headers = res.headers["set-cookie"];
      let cookie = headers.split(";")[0];
    
      const testClient2 = await superoak(app);
      const response = await testClient2.get('/auth/registration')
        .set("Cookie", cookie)
        .expect(200)
        assert(response.text.includes("Welcome"))    
      },
      sanitizeResources: false,
    sanitizeOps: false,
    });
    
Deno.test({
  name:"GET to /auth/login redirects the user to root if already logged in", 
  async fn() {
        let testClient = await superoak(app);
          let res = await testClient
            .post("/auth/login")
            .send("email=a@a&password=a")
        
          let headers = res.headers["set-cookie"];
          let cookie = headers.split(";")[0];
        
          const testClient2 = await superoak(app);
          const response = await testClient2.get('/auth/login')
            .set("Cookie", cookie)
            .expect(200)
            assert(response.text.includes("Welcome"))    
          },
          sanitizeResources: false,
    sanitizeOps: false
        });
        
Deno.test({
  name:"POST to /behavior/reporting/morning with bad values renders the page again", 
  async fn() {
  let testClient = await superoak(app);
  let res = await testClient
      .post("/auth/login")
      .send("email=a@a&password=a")
            
  let headers = res.headers["set-cookie"];
  let cookie = headers.split(";")[0];
            
  const testClient2 = await superoak(app);
  let response = await testClient2
      .post("/behavior/reporting/morning")
      .set("Cookie", cookie)
      .send("date=2020-02-02&sleep=-10&sleepQuality=3&mood=3")
      .expect(200)
      assert(response.text.includes("Morning"))
},
sanitizeResources: false,
sanitizeOps: false
});
        
Deno.test({
  name:"GET to /behavior/reporting/morning when not logged in redirects the user to login",
   async fn() {

            
  const testClient = await superoak(app);
  let response = await testClient
      .get("/behavior/reporting/morning")
      .expect(200)
  assert(response.text.includes("Login"))


},
sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
  name:"Weeklystats returns a object with .errorW 'no data for week number ${week} of ${year}'",
   async fn(){

  const res = await summaryController.weeklyStats(-1)
  assert(res.errorW===`no data for week number ${summaryController.currweek} of ${summaryController.curryearW}`)

},
sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
  name:"POST to /behavior/reporting/morning adds data to the database, and landingpage shows that data", 
  async fn() {
  let testClient = await superoak(app);
  let res = await testClient
      .post("/auth/login")
      .send("email=a@a&password=a")
            
  let headers = res.headers["set-cookie"];
  let cookie = headers.split(";")[0];
            
  const testClient2 = await superoak(app);
  let response = await testClient2
      .post("/behavior/reporting/morning")
      .set("Cookie", cookie)
      .send("date=2020-12-08&sleep=10&sleepQuality=3&mood=3")
      //todays date
  const testClient3 = await superoak(app);
  let response2 = await testClient3
    .get("/")
    .set("Cookie",cookie)
    .expect(200)
      assert(!response2.text.includes('no data from today'))
},
sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
  name:"POST to /behavior/reporting/morning adds data to the database, and '/behaviour/summary' shows that data", 
  async fn() {
  let testClient = await superoak(app);
  let res = await testClient
      .post("/auth/login")
      .send("email=a@a&password=a")
            
  let headers = res.headers["set-cookie"];
  let cookie = headers.split(";")[0];
          
  const testClient2 = await superoak(app);
  let response = await testClient2
    .get("/behavior/summary")
    .set("Cookie",cookie)
    .expect(200)
    assert(!response.text.includes('no data for week number 50 of 2020'))
},
sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
  name:"POST to /auth/login gives validation error if credentials are wrong",
   async fn() {
let testClient = await superoak(app);
let res = await testClient
  .post("/auth/login")
  .send("email=aaaaaa@aaaaaaaa&password=aaaaaaaaa")
  .expect(200)
  assert(res.text.includes("Invalid email or password"))
},
sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
  name:"POST to /auth/registration gives validation error if credentials are wrong", 
  async fn() {
  let testClient = await superoak(app);
  let res = await testClient
    .post("/auth/registration")
    .send("email=a@a&password=a&verification=c")
    .expect(200)
    assert(res.text.includes("password cannot be lower than 4 characters") && res.text.includes("email is not a valid email address")&&res.text.includes("password did not match") &&res.text.includes("The email is already in use"))
  },
  sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
  name:"After POST to /auth/logout the user can not access /behavior/summary and is sent to login page" , 
  async fn() {
  let testClient = await superoak(app);
  let res = await testClient
      .post("/auth/login")
      .send("email=a@a&password=a")
            
  let headers = res.headers["set-cookie"];
  let cookie = headers.split(";")[0];

  const testClient2 = await superoak(app);
  await testClient2
    .post("/auth/logout")
    .set("Cookie",cookie)
  
  const testClient3 = await superoak(app);
  const response = await testClient3
    .get("/behavior/summary")
    .expect(200)

    assert(response.text.includes("Login"))

},
sanitizeResources: false,
    sanitizeOps: false
})


Deno.test({
  name:"POST to /behavior/reporting/evening with invalid parameters does not add to the database" , 
  async fn()  {
  let testClient = await superoak(app);
  let res = await testClient
      .post("/auth/login")
      .send("email=a@a&password=a")
            
  let headers = res.headers["set-cookie"];
  let cookie = headers.split(";")[0];

  const testClient2 = await superoak(app);
  const response = await testClient2
    .post("/behavior/reporting/evening")
    .send("date=2020-12-08&exercise=-5&study=-10&eating=3&mood=2")
    .set("Cookie",cookie)
    .expect(200)
  
  
    assert(response.text.includes("Evening log!") && response.text.includes("exercise cannot be lower than 0"))

},
sanitizeResources: false,
    sanitizeOps: false
})




Deno.test({
  name:"Monthlystats returns a object with avarage values for user id 1 (no error)", 
  async fn() {
  const res = await summaryController.monthlyStats(1)
  assert(res.errorM===null)
},
sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
  name:"Monthlystats returns a object with an error for user id -1",
   async fn()  {
  const res = await summaryController.monthlyStats(-1)
  assert(res.errorM.includes("No data from month number"))
},
sanitizeResources: false,
    sanitizeOps: false
});

