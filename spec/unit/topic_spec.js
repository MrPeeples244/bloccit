const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Post", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description:
          "A compilation of reports from recent visitors to the star system."
      })
        .then(topic => {
          this.topic = topic;

          Post.create({
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            topicId: this.topic.id
          }).then(post => {
            this.post = post;
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("#create()", () => {
    it("should create a topic object with a title and description", done => {
      Topic.create({
        title: "Interdimensional Travel",
        description: "Utilizing the hyperdimension"
      })
        .then(topic => {
          expect(topic.title).toBe("Interdimensional Travel");
          expect(topic.description).toBe("Utilizing the hyperdimension");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it("should not create a topic with missing title or description", done => {
      Topic.create({
        title: "Interdimensional Travel"
      })
        .then(topic => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Topic.description cannot be null");
          done();
        });
    });
  });

  describe("#getPosts()", () => {
    it("should return an array of posts associated with the topic", done => {
      this.topic.getPosts().then(associatedPosts => {
        expect(associatedPosts[0].title).toBe(
          "My first visit to Proxima Centauri b"
        );
        expect(associatedPosts[0].body).toBe("I saw some rocks.");
        expect(associatedPosts[0].topicId).toBe(this.topic.id);
        done();
      });
    });
  });
});
