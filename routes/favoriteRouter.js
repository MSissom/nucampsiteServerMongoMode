const express = require("express");
const authenticate = require("../authenticate");
const bodyParser = require("body-parser");
const cors = require('./cors');
const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user:req.user._id})
      .populate('user')
      .populate('campsite')
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>)
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
    res.statusCode = 403;
    res.end("PUT operation not supported!");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
    Favorite.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  })


  favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    Favorite.findById({})
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Favorite.findOne({user:req.user._id})
      .then(favorite => {
          if (favorite){
              if(!favorite.campsites.includes(req.params.campsiteId)){
                  favorite.campsite.push(req.params.campsiteId);
                  favorite.save()
              }
      })
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
    res.statusCode = 403;
    res.end("PUT operation not supported!");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>)





module.exports = favoriteRouter;