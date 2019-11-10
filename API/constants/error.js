const errorMap = {
    INVALID_PARAMETER: {
        code: 400,
        message: "Invalid Parameter for endpoint"
    },
    UNAUTHORIZED_ACCESS: {
        code: 401,
        message: "Unauthorized Access"
    },
    UNHANDLED_EXCEPTION: {
        code: 500,
        message: "Unhandled Exception at server"
    }
}

module.exports = errorMap;