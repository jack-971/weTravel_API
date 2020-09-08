exports.errorHandling = {
    notFound: function(req, res, next) {
        const error = new Error('Not found');
        console.log("not found");
        error.status = 404;
        next(error);
    }
,
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