

const handelMongooseError = (error, data, next) => {
    error.status = 400;
    next();
}

module.export = handelMongooseError;