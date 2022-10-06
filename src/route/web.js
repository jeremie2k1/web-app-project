import express from "express";
import homeController from "../controllers/homeController.js";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);

    


    // rest api

    return app.use("/", router);
}

module.exports = initWebRoutes;