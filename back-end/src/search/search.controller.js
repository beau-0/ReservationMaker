const service = require("./search.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for controller resources
 */

async function search (req, res, next) {

    const { mobile_number } = req.query;
    const results = await service.search(mobile_number);

    console.log("We're hitting back: ", mobile_number, results);

    res.status(200).json({
        success: true,
        data: results,
      });
}


module.exports = {
    search,
}