const authRoutes = (app, errorMap, serverMap, authService) => {

    function checkIfBodyIsCorrect(body) {
        if (body) {
            /* if ( !typeis.is(body, ['json']) && !typeis.is(body, ['JSON']) && !typeis.is(body, ['application/json']) ) {
                console.log('not JSON')
                return false;
            } */
        } else {
            return false;
        }

        return true;
    }

    // Register
    app.post('/register', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.email && body.password) {
                authService.Register(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // LOGIN
    app.post('/login', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.username && body.password) {
                authService.Login(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // Validate a token
    app.post('/validateusertoken', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.token) {
                authService.ValidateToken(body.token).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // Change User Password
    app.post('/changeuserpassword', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.username && body.password && body.newpassword) {
                authService.ChangeUserPassword(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // Renew a token
    app.post('/renewusertoken', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.token && body.username) {
                authService.RenewToken(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // Delete a user
    app.post('/deleteauser', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.password && body.username) {
                authService.DeleteUser(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // Update User Scope
    app.post('/updateusersscope', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.password && body.username && body.newUserScope) {
                authService.UpdateUserScope(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // Update User Website Group
    app.post('/updateuserswebsitegroup', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.password && body.username && body.newWebsiteGroup) {
                authService.UpdateUserWebsiteGroup(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // Retrieve User Attributes
    app.post('/retrieveuserattributes', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.password && body.username) {
                authService.RetrieveUserAttributes(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

    // List a users devices
    app.post('/listuserdevices', (req, res) => {
        if (checkIfBodyIsCorrect(req.body)) {
            let body = req.body;

            if (body && body.password && body.username && body.limit && body.paginationToken) {
                authService.ListUserDevices(body).then(function (data) {
                    return res.status(200).send(data);
                }).catch (function (error) {
                    console.error(error);

                    return res.status(500).send(error);
                });
            } else {
                return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
            }
        } else {
            return res.status(errorMap.INVALID_PARAMETER.code).send(errorMap.INVALID_PARAMETER.message);
        }
    });

};

module.exports = authRoutes;