"use strict";

module.exports = {
    get: function(request) {
        var user = request.user;
        
        if(typeof user === "undefined")
            return undefined;
        
        user.age = this.getAgeByBirthday(user.birthday);
        
        return {
            user: user
        };
    },
    
    getAgeByBirthday: function(birthday) {
        return this.getAge(new Date(birthday));
    },
    
    getAge: function(d1, d2) {
        d2 = d2 || new Date();
        var diff = d2.getTime() - d1.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
};