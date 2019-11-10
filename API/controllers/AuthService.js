const serverMap = require('../constants/server');

global.fetch = require('node-fetch');
global.navigator = () => null;

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const poolData = {    
    UserPoolId : serverMap.AWS_COGNITO_USER_POOL_ID,
    ClientId : serverMap.AWS_COGNITO_CLIENT_ID
}; 
const pool_region = serverMap.AWS_COGNITO_REGION;

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.Register = function (body, callback) {
    return new Promise(function (resolve, reject) {
        var email = body.email;
        var password = body.password;
        var attributeList = [];
        
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:"Nicholas Griffin"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"family_name",Value:"Griffin"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"given_name",Value:"Nicholas"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"preferred_username",Value:"Nicholas"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:"male"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:"1992-02-14"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:"me@nicholasgriffin.co.uk"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:"+5412614324321"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:scope",Value:"admin"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"nickname",Value:"Nicholas"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"picture",Value:"https://avatars0.githubusercontent.com/u/12116098?s=60&v=4"}));

        userPool.signUp(email, password, attributeList, null, function (err, result) {
            if (err) {
                console.log(err);
                var responseData = { 
                    status: 'Fail',
                    message: 'Something Unexpected Happened.',
                    data: err,
                }

                reject(responseData);
            } else {
                var cognitoUser = result.user;

                var responseData = { 
                    status: 'Success',
                    message: 'Successfully Registered.',
                    data: result,
                    username: cognitoUser.getUsername()
                }

                resolve(responseData);
            }
        })
    })
}

exports.Login = function (body, callback) {
    return new Promise(function (resolve, reject) {
        var userName = body.username;
        var password = body.password;
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: userName,
            Password: password
        });
        var userData = {
            Username: userName,
            Pool: userPool
        }
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                let resultToPass = {
                    Success: 'true',
                    Message: 'Successfully authenticated',
                    Result: {
                        AccessToken: result.getAccessToken().getJwtToken(),
                        IdToken: result.getIdToken().getJwtToken(),
                        RefreshToken: result.getRefreshToken().getToken()
                    }
                }

                resolve(resultToPass)
            },
            onFailure: function(err) {
                console.log(err);

                reject(err)
            },
            mfaRequired: function(codeDeliveryDetails) {
                // MFA is required to complete user authentication. 
                // Get the code from user and call 
                console.log(codeDeliveryDetails);
                // cognitoUser.sendMFACode(mfaCode, this)
            },

            newPasswordRequired: function(userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new 
                // password and required attributes, if any, to complete 
                // authentication.

                // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user. 
                // Required attributes according to schema, which don’t have any values yet, will have blank values.
                // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.

                
                // Get these details and call 
                // newPassword: password that user has given
                // attributesData: object with key as attribute name and value that the user has given.
                console.log(userAttributes, requiredAttributes)

                let newPassword = 'Password123!';

                var attributesData = {
                    name: 'Nicholas Griffin',
                    family_name: 'Griffin',
                    given_name: 'Nicholas',
                    preferred_username: 'Nicholas',
                    gender: 'male',
                    birthdate: '1992-02-14',
                    address: 'NA',
                    email: 'me@nicholasgriffin.co.uk',
                    phone_number: '+447767676767',
                    nickname: 'Nicholas',
                    picture: 'https://avatars0.githubusercontent.com/u/12116098?s=60&v=4',
                    'custom:scope': 'Demo',
                    'custom:websitegroup': 'Demo',
                };

                cognitoUser.completeNewPasswordChallenge(newPassword, attributesData, this)
            }
        })
    })
 };

 exports.ValidateToken = function (token, callback) {
    return new Promise(function (resolve, reject) {
        // TODO: This should be used for the login API instead of just passing the payload from the API
        request({
            url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    reject("Not a valid JWT token");
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    reject('Invalid token');
                }

                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        reject("Invalid Token.");
                    } else {
                        let resultToPass = {
                            Success: 'true',
                            Message: 'Successfully validated',
                            Payload: payload
                        }

                        resolve(resultToPass)
                    }
                });
            } else {
                reject("Error! Unable to download JWKs");
            }
        });
    });
 };

 exports.ChangeUserPassword = function (body, callback) {
     return new Promise(function (resolve, reject) {
         // TODO: Make this a thing
         var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
             Username: body.username,
             Password: body.password,
         });
 
         var userData = {
             Username: body.username,
             Pool: userPool
         };
         var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
 
         cognitoUser.authenticateUser(authenticationDetails, {
             onSuccess: function (result) {
                 cognitoUser.changePassword(body.password, body.newpassword, (err, result) => {
                     if (err) {
                         reject(err);
                     } else {
                         let resultToPass = {
                             Success: 'true',
                             Message: 'Successfully changed password of the user',
                             Result: result
                         }
                         resolve(resultToPass);
                     }
                 });
             },
             onFailure: function (err) {
                 reject(err);
             },
         });
     });
 }
 
 exports.RenewToken = function (body, callback) {
    return new Promise(function (resolve, reject) {
        // TODO: Make this a thing
        const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: body.token});
    
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
        const userData = {
            Username: body.username,
            Pool: userPool
        };
    
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
        cognitoUser.refreshSession(RefreshToken, (err, session) => {
            if (err) {
                reject(err);
            } else {
                let retObj = {
                    "access_token": session.accessToken.jwtToken,
                    "id_token": session.idToken.jwtToken,
                    "refresh_token": session.refreshToken.token,
                }

                let resultToPass = {
                    Success: 'true',
                    Message: 'Successfully refreshed',
                    Payload: retObj
                }
                resolve(resultToPass);
            }
        });
    });
};


exports.DeleteUser = function (body, callback) {
    return new Promise(function (resolve, reject) {
        // TODO: Admin only tool
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: body.username,
            Password: body.password,
        });

        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userData = {
            Username: body.username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.deleteUser((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        let resultToPass = {
                            Success: 'true',
                            Message: 'Successfully deleted the user',
                            Result: result
                        }
                        resolve(resultToPass);
                    }
                });
            },
            onFailure: function (err) {
                reject(err);
            },
            mfaRequired: function(codeDeliveryDetails) {
                reject('MFA Reqquired');
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                reject('New password Reqquired');
            }
        });
    });
};

exports.UpdateUserScope = function (body, callback) {
    return new Promise(function (resolve, reject) {
        // TODO: Admin only tool
        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "custom:scope",
            Value: body.newUserScope
        }));

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: body.username,
            Password: body.password,
        });

        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userData = {
            Username: body.username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.updateAttributes(attributeList, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        let resultToPass = {
                            Success: 'true',
                            Message: 'Successfully updated the users scope',
                            Result: result
                        }
                        resolve(resultToPass);
                    }
                });
            },
            onFailure: function (err) {
                reject(err);
            },
            mfaRequired: function(codeDeliveryDetails) {
                reject('MFA Reqquired');
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                reject('New password Reqquired');
            }
        });
    });
}

exports.UpdateUserWebsiteGroup = function (body, callback) {
    return new Promise(function (resolve, reject) {
        // TODO: Admin only tool
        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "custom:websitegroup",
            Value: body.newWebsiteGroup
        }));

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: body.username,
            Password: body.password,
        });

        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userData = {
            Username: body.username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.updateAttributes(attributeList, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        let resultToPass = {
                            Success: 'true',
                            Message: 'Successfully updated the users website group',
                            Result: result
                        }
                        resolve(resultToPass);
                    }
                });
            },
            onFailure: function (err) {
                reject(err);
            },
            mfaRequired: function(codeDeliveryDetails) {
                reject('MFA Reqquired');
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                reject('New password Reqquired');
            }
        });
    });
}

exports.RetrieveUserAttributes = function (body, callback) {
    return new Promise(function (resolve, reject) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: body.username,
            Password: body.password,
        });

        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userData = {
            Username: body.username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.getUserAttributes((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        let resultToPass = {
                            Success: 'true',
                            Message: 'Successfully retrieved the users attributes',
                            Result: result
                        }
                        resolve(resultToPass);
                    }
                });
            },
            onFailure: function (err) {
                reject(err);
            },
            mfaRequired: function(codeDeliveryDetails) {
                reject('MFA Reqquired');
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                reject('New password Reqquired');
            }
        });
    });
}

exports.ListUserDevices = function (body, callback) {
    return new Promise(function (resolve, reject) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: body.username,
            Password: body.password,
        });

        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userData = {
            Username: body.username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.listDevices(body.limit, body.paginationToken, {
                    onSuccess: function (result) {
                        let resultToPass = {
                            Success: 'true',
                            Message: 'Successfully retrieved the users attributes',
                            Result: result
                        }
                        resolve(resultToPass);
                    },
                    onFailure: function(err) {
                        reject(err);
                    }
                });
            },
            onFailure: function (err) {
                reject(err);
            },
            mfaRequired: function(codeDeliveryDetails) {
                reject('MFA Reqquired');
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                reject('New password Reqquired');
            }
        });
    });
}

