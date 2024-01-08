const service = require("./search.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for controller resources
 */

async function search (req, res, next) {
    console.log("We're hitting back1: ", req.query);
    const { mobile_number } = req.query;
    const results = await service.search(mobile_number);

    console.log("We're hitting back2: ", mobile_number, results);

    res.status(200).json({
        success: true,
        data: results,
      });
}


module.exports = {
    search,
}