const flairQueries = require("../db/queries.flairs.js");
module.exports = {
  new(req, res, next) {
    res.render("flair/new", {
      topicId: req.params.topicId
    });
  },

  create(req, res, next) {
    let newFlair = {
      name: req.body.name,
      color: req.body.color,
      topicId: req.params.topicId
    };
    flairQueries.addFlair(newFlair, (err, flair) => {
      if (err) {
        res.redirect(500, "/flair/new");
      } else {
        res.redirect(303, `/topics/${newFlair.topicId}/flair/${flair.id}`);
      }
    });
  },

  show(req, res, next) {
    flairQueries.getFlair(req.params.id, (err, flair) => {
      if (err || flair == null) {
        res.redirect(404, "/");
      } else {
        res.render("flair/show", { flair });
      }
    });
  },

  destroy(req, res, next) {
    flairQueries.deleteFlair(req.params.id, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(
          500,
          `/topics/${req.params.topicId}/flair/${req.params.id}`
        );
      } else {
        res.redirect(303, `/topics/${req.params.topicId}`);
      }
    });
  },

  edit(req, res, next) {
    flairQueries.getFlair(req.params.id, (err, flair) => {
      if (err || flair == null) {
        res.redirect(404, "/");
      } else {
        res.render("flair/edit", { flair });
      }
    });
  },

  update(req, res, next) {
    flairQueries.updateFlair(req.params.id, req.body, (err, flair) => {
      if (err || flair == null) {
        res.redirect(
          404,
          `/topics/${req.params.topicId}/flair/${req.params.id}/edit`
        );
      } else {
        res.redirect(`/topics/${req.params.topicId}/flair/${req.params.id}`);
      }
    });
  }
};
