exports.errorHandling = {
    /**
     * Error handler used to log a not found exception.
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    notFound: function(req, res, next) {
        const error = new Error('Not found');
        console.log("not found");
        error.status = 404;
        next(error);
    }
,
    /**
     * Error handler used to log a functional error.
     * @param {*} error 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    handleError: function(error, req, res, next) {
        res.status(error.status || 500);
        console.log("handle error")
        console.log(error);
        res.json({
            error: {
                message: error.message
            }
        });
    }
}