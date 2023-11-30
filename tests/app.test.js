const app = require("../app");
const request = require("supertest");

describe("GET db/users", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/db/users");
    expect(response.statusCode).toBe(200);
  });

  test("should respond with an array", async () => {
    const response = await request(app).get("/db/users");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should have a content-type: application/json in header", async () => {
    const response = await request(app).get("/db/users");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
  });
});

describe("GET db/user/:email", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/db/user/jessica.munoz-o_mail.escuelaing.edu.co");
    expect(response.statusCode).toBe(200);
  });

  test("should respond with an array", async () => {
    const response = await request(app).get(
      "/db/user/laura.garcia-a_mail.escuelaing.edu.co#EXT#@avatarnavi.onmicrosoft.com"
    );
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should have a content-type: application/json in header", async () => {
    const response = await request(app).get("/db/user/jose.olarte_mail.escuelaing.edu.co");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });

  test("should respond with the email of the user", async () => {
    const response = await request(app).get("/db/user/juan.teran_mail.escuelaing.edu.co");
    expect(response.body[0].email).toBe("juan.teran_mail.escuelaing.edu.co#EXT#@avatarnavi.onmicrosoft.com");
  });

  test("should respond with the user's name", async () => {
    const response = await request(app).get("/db/user/juan.teran_mail.escuelaing.edu.co");
    expect(response.body[0]._id).toBe("6536ff3e69aaf1b314365bd1");
  });

  test("should respond if no email to search is sent", async () => {
    const response = await request(app).get("/db/user/");
    expect(response.body).toEqual(expect.objectContaining({ error: "Send an email to search the user" }));
  });

  test("should respond if user is not found", async () => {
    const response = await request(app).get("/db/user/thisisnotanemail@avatarnavi");
    expect(response.body).toEqual(expect.objectContaining({ error: "User not found" }));
  });

  test("should respond with a 404 status code if no user is sent to search", async () => {
    const response = await request(app).get("/db/user/");
    expect(response.statusCode).toBe(404);
  });

  test("should respond with a 404 status code if email is not found", async () => {
    const response = await request(app).get("/db/user/thisisnotanemail@avatarnavi");
    expect(response.statusCode).toBe(404);
  });

  test("should respond in json if error", async () => {
    const response = await request(app).get("/db/user/thisisnotanemail@avatarnavi");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });
});

describe("GET db/user/:email/balance", () => {
  test("should respond with a 200 status code", async () => {
    const response = await request(app).get("/db/user/juan.teran_mail.escuelaing.edu.co/balance");
    expect(response.statusCode).toBe(200);
  });

  test("should respond with an array", async () => {
    const response = await request(app).get("/db/user/laura.garcia-a_mail.escuelaing.edu.co/balance");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should have a content-type: application/json in header", async () => {
    const response = await request(app).get("/db/user/jose.olarte_mail.escuelaing.edu.co/balance");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });

  //test("should respond if no email to search is sent", async () => {
  //const response = await request(app).get("/db/user//balance");
  //expect(response.body).toEqual(expect.objectContaining({ error: "Send an email to search the user's data"}));
  //});

  test("should verify the user's balance", async () => {
    const response = await request(app).get(
      "/db/user/jessica.munoz-o_mail.escuelaing.edu.co#EXT#@avatarnavi.onmicrosoft.com/balance"
    );
    expect(response.body[0].balance).toBeGreaterThanOrEqual(0);
  });

  test("should verify the user's wallet", async () => {
    const response = await request(app).get("/db/user/prueba_na_vi@avatarnavi.onmicrosoft.com/balance");
    expect(response.body[0].wallet[0].crypto).toEqual(expect.stringContaining("Ethereum"));
  });

  test("should respond if user is not found", async () => {
    const response = await request(app).get("/db/user/thisisnotanemail@avatarnavi/balance");
    expect(response.body).toEqual(expect.objectContaining({ error: "User not found" }));
  });

  test("should respond with a 404 status code if email is not found", async () => {
    const response = await request(app).get("/db/user/thisisnotanemail@avatarnavi/balance");
    expect(response.statusCode).toBe(404);
  });

  test("should respond in json if error", async () => {
    const response = await request(app).get("/db/user/thisisnotanemail@avatarnavi/balance");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });
});

describe("GET db/cryptos", () => {
  test("should respond with an array", async () => {
    const response = await request(app).get("/db/cryptos");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should have a content-type: application/json in header", async () => {
    const response = await request(app).get("/db/cryptos");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });

  test("should respond with a defined id", async () => {
    const response = await request(app).get("/db/cryptos");
    expect(response.body[0]._id).toBeDefined();
  });
});

describe("GET db/cryptos_last", () => {
  test("should respond with an array", async () => {
    const response = await request(app).get("/db/cryptos_last");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should have a content-type: application/json in header", async () => {
    const response = await request(app).get("/db/cryptos_last");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });

  test("should respond with a defined date", async () => {
    const response = await request(app).get("/db/cryptos_last");
    expect(response.body[0].date).toBeDefined();
  });

  test("should respond in json if error", async () => {
    const response = await request(app).get("/db/cryptos_last");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });
});

describe("GET db/cryptos/:name", () => {
  test("should respond with an array", async () => {
    const response = await request(app).get("/db/cryptos/bitcoin");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should have a content-type: application/json in header", async () => {
    const response = await request(app).get("/db/cryptos/bitcoin");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });

  test("should respond with the last querys of the crypto", async () => {
    const response = await request(app).get("/db/cryptos/bitcoin");
    expect(response.body[0].cryptocurrencies[0].name).toEqual(expect.stringContaining("Bitcoin"));
  });

  test("should respond if concurrency is not found", async () => {
    const response = await request(app).get("/db/cryptos/avatarcoin");
    expect(response.body).toEqual(expect.objectContaining({ error: "Cryptocurrency not found" }));
  });

  test("should respond with a 404 status code if error", async () => {
    const response = await request(app).get("/db/cryptos/avatarcoin");
    expect(response.statusCode).toBe(404);
  });

  test("should respond in json if error", async () => {
    const response = await request(app).get("/db/cryptos/avatarcoin");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });
});

describe("GET db/offers", () => {
  test("should respond with an array", async () => {
    const response = await request(app).get("/db/offers");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("should have a content-type: application/json in header", async () => {
    const response = await request(app).get("/db/offers");
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));
  });

  test("should respond with a defined offer id", async () => {
    const response = await request(app).get("/db/offers");
    expect(response.body[0].offer_id).toBeDefined();
  });

  test("should respond with open offers", async () => {
    const response = await request(app).get("/db/offers");
    expect(response.body[0].state).toEqual(expect.stringContaining("Open"));
  });
});
