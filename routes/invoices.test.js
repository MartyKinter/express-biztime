const request = require("supertest");
const app = require("../app");
const {createData} = require("../_test-common");
const db = require("../db");

beforeEach(createData);

afterAll(async function(){
    await db.end()
});

describe("GET /", function () {

    test("Test get all invoices", async function () {
      const response = await request(app).get("/invoices");
      expect(response.body).toEqual({
        "invoices": [
          {id: 1, comp_code: "apple"},
          {id: 2, comp_code: "apple"},
          {id: 3, comp_code: "ibm"},
        ]
      });
    })
  
  });
  
  
  describe("GET /1", function () {
  
    test("Test get specific invoice", async function () {
      const response = await request(app).get("/invoices/1");
      expect(response.body).toEqual(
          {
            "invoice": {
              id: 1,
              amt: 100,
              add_date: '2018-01-01T08:00:00.000Z',
              paid: false,
              paid_date: null,
              company: {
                code: 'apple',
                name: 'Apple',
                description: 'Maker of OSX.',
              }
            }
          }
      );
    });
  
    test("Test 404 for invoice not found", async function () {
      const response = await request(app).get("/invoices/999");
      expect(response.status).toEqual(404);
    })
  });
  
  
  describe("POST /", function () {
  
    test("Test adding an invoice", async function () {
      const response = await request(app)
          .post("/invoices")
          .send({amt: 400, comp_code: 'ibm'});
  
      expect(response.body).toEqual(
          {
            "invoice": {
              id: 4,
              comp_code: "ibm",
              amt: 400,
              add_date: expect.any(String),
              paid: false,
              paid_date: null,
            }
          }
      );
    });
  });
  
  
  describe("PUT /", function () {
  
    test("Test updating an invoice", async function () {
      const response = await request(app)
          .put("/invoices/1")
          .send({amt: 1000, paid: false});
  
      expect(response.body).toEqual(
          {
            "invoice": {
              id: 1,
              comp_code: 'apple',
              paid: false,
              amt: 1000,
              add_date: expect.any(String),
              paid_date: null,
            }
          }
      );
    });
  
    test("Test 404 for invoice not found", async function () {
      const response = await request(app)
          .put("/invoices/9999")
          .send({amt: 1000});
  
      expect(response.status).toEqual(404);
    });
  
    test("Test incorrect update", async function () {
      const response = await request(app)
          .put("/invoices/1")
          .send({});
  
      expect(response.status).toEqual(500);
    })
  });
  
  
  describe("DELETE /", function () {
  
    test("Test deleting an invoice", async function () {
      const response = await request(app)
          .delete("/invoices/1");
  
      expect(response.body).toEqual({"status": "deleted"});
    });
  
    test("Test 404 for invoice not found", async function () {
      const response = await request(app)
          .delete("/invoices/999");
  
      expect(response.status).toEqual(404);
    });
  });
  