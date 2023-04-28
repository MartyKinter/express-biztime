const request = require("supertest");
const app = require("../app");
const {createData} = require("../_test-common");
const db = require("../db");

beforeEach(createData);

afterAll(async function(){
    await db.end()
});

describe("GET /", function () {

    test("Test getting all companies", async function () {
      const response = await request(app).get("/companies");
      expect(response.body).toEqual({
        "companies": [
          {code: "apple", name: "Apple"},
          {code: "ibm", name: "IBM"},
        ]
      });
    });
  
  });
  
  
  describe("GET /apple", function () {
  
    test("Test getting specific company", async function () {
      const response = await request(app).get("/companies/apple");
      expect(response.body).toEqual(
          {
            "company": {
              code: "apple",
              name: "Apple",
              description: "Maker of OSX.",
              invoices: [1, 2],
            }
          }
      );
    });
  
    test("Test 404 for no company found", async function () {
      const response = await request(app).get("/companies/blargh");
      expect(response.status).toEqual(404);
    })
  });
  
  
  describe("POST /", function () {
  
    test("Test adding a company", async function () {
      const response = await request(app)
          .post("/companies")
          .send({name: "TacoTime", description: "Yum!"});
  
      expect(response.body).toEqual(
          {
            "company": {
              code: "tacotime",
              name: "TacoTime",
              description: "Yum!",
            }
          }
      );
    });
  
    test("Test invalid add", async function () {
      const response = await request(app)
          .post("/companies")
          .send({name: "Apple", description: "Huh?"});
  
      expect(response.status).toEqual(500);
    })
  });
  
  
  describe("PUT /", function () {
  
    test("Test updating a company", async function () {
      const response = await request(app)
          .put("/companies/apple")
          .send({name: "AppleEdit", description: "NewDescrip"});
  
      expect(response.body).toEqual(
          {
            "company": {
              code: "apple",
              name: "AppleEdit",
              description: "NewDescrip",
            }
          }
      );
    });
  
    test("Test 404 for company not found", async function () {
      const response = await request(app)
          .put("/companies/blargh")
          .send({name: "Blargh"});
  
      expect(response.status).toEqual(404);
    });
  
    test("Test incorrect update", async function () {
      const response = await request(app)
          .put("/companies/apple")
          .send({});
  
      expect(response.status).toEqual(500);
    })
  });
  
  
  describe("DELETE /", function () {
  
    test("Test deleting a company", async function () {
      const response = await request(app)
          .delete("/companies/apple");
  
      expect(response.body).toEqual({"status": "deleted"});
    });
  
    test("Test 404 for company not found", async function () {
      const response = await request(app)
          .delete("/companies/blargh");
  
      expect(response.status).toEqual(404);
    });
  });
  
  