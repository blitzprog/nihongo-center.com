"use strict";

module.exports = {
    get: function(request) {
        return {
            user: request.user
        };
    }
};