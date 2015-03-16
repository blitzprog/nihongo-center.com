"use strict";

module.exports = {
    get: function(data) {
        console.log("GET:", data);
        
        return {
            "email": data.email,
            "password": data.password
        };
    },
    
    post: function(data) {
        console.log("POST:", data);
        
        return {
            "email": data.email,
            "password": data.password
        };
    }
};