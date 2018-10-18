const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {
  beforeEach(done => {
    this.advertisement;
    sequelize.sync({ force: true }).then(res => {
      Advertisement.create({
        title: "Got Milk?",
        description: "The USDA does!"
      })
        .then(advertisement => {
          this.advertisement = advertisement;
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("GET /advertisements", () => {
    it("should return a status code 200 and all advertisements", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Advertisements");
        expect(body).toContain("Got Milk?");
        done();
      });
    });
  });

  describe("GET /advertisements/new", () => {
    it("should render a new advertisment form", done => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Advertisement");
        done();
      });
    });
  });

  describe("POST /advertisements/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Where's the Beef?",
        description: "At your local Wendy's!"
      }
    };

    it("should create a new advertisement and redirect", done => {
      request.post(options, (err, res, body) => {
        Advertisement.findOne({ where: { title: "Where's the Beef?" } })
          .then(advertisement => {
            expect(res.statusCode).toBe(303);
            expect(advertisement.title).toBe("Where's the Beef?");
            expect(advertisement.description).toBe("At your local Wendy's!");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /advertisements/:id", () => {
    it("should render a view with the selected advertisement", done => {
      request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Got Milk?");
        done();
      });
    });
  });

  describe("POST /advertisements/:id/destroy", () => {
    it("should delete the advertisement with the associated ID", done => {
      Advertisement.all().then(advertisement => {
        const adCountBeforeDelete = advertisement.length;
        expect(adCountBeforeDelete).toBe(1);
        request.post(
          `${base}${this.advertisement.id}/destroy`,
          (err, res, body) => {
            Advertisement.all().then(advertisement => {
              expect(err).toBeNull();
              expect(advertisement.length).toBe(adCountBeforeDelete - 1);
              done();
            });
          }
        );
      });
    });
  });

  describe("GET /advertisements/:id/edit", () => {
    it("should render a view with an edit advertisement form", done => {
      request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Advertisement");
        expect(body).toContain("Got Milk?");
        done();
      });
    });
  });

  describe("POST /advertisements/:id/update", () => {
    it("should update the advertisement with the given values", done => {
      const options = {
        url: `${base}${this.advertisement.id}/update`,
        form: {
          title: "Got Milk?",
          description: "The USDA does!"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Advertisement.findOne({
          where: { id: this.advertisement.id }
        }).then(advertisement => {
          expect(advertisement.title).toBe("Got Milk?");
          done();
        });
      });
    });
  });
});
