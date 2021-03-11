import {assertEquals,assert,superoak} from "../deps.js"
import { app } from "../app.js";

Deno.test({
  name:"GET to /api/summary/ is a json file", 
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/api/summary/").expect('Content-Type', new RegExp('application/json')).expect(200)
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "GET to /api/summary/1001/01/01 is an json file with empty values(assuming there is no report for this date)", 
  async fn()  {
    const testClient = await superoak(app);
    await testClient.get("/api/summary/1001/01/01")
    .expect('Content-Type', new RegExp('application/json'))
    .expect(200)
    .expect({ avarage_mood: null,
        avarage_sleep: null,
        avarage_sleep_quality: null,
        avarage_exercise: null,
        avarage_studytime: null,
        eatingquality: null })
  },

  sanitizeResources: false,
  sanitizeOps: false
});

  