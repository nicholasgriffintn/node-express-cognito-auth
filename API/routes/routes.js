// import other routes
const authRoutes = require('./auth');

const authService = require('../controllers/AuthService');

const appRouter = (app, authenticatedRoute, apiRoute, apiContentRoute, serverMap, errorMap, fs, typeis) => {

    // default route
    app.get('/', (req, res) => {
        res.status('200').json({ 
            status: 'Success',
            message: 'Successfully Accessed.',
            data: ''
        })
    });

    // health check route
    app.get('/health', (req, res) => {
        res.status('200').json({ 
            status: 'Success',
            message: 'It is alive!.',
            data: ''
        })
    });

    authenticatedRoute.get("/test", function(req, res, next) {
        res.status('200').json({ 
            status: 'Success',
            message: 'Successfully Authenticated.',
            data: res.locals.user
        })
    });

    // // other routes
    authRoutes(apiRoute, errorMap, serverMap, authService);

};

module.exports = appRouter;