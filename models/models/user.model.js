'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    displayName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        index: {
            unique: true,
            sparse: true
        }
    },
    phoneNumber: {
        type: String,
        trim: true,
        match: [/^0?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, 'Please fill a valid phone number.'],
        index: {
            unique: true,
            sparse: true
        }
    },
    avatarUrl: {
        type: String,
        default: 'img/default-avatar-icon.png'
    },
    username: {
        type: String,
        require: true,
        unique: true,
        match: [/^[a-zA-Z0-9_]{2,16}/, 'Username illegal!'],
        trim: true,
        index: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },

    salt: {
        type: String
    },
    accessToken: String,

    roles: {
        type: [{
            type: String,
            enum: 'user editor admin super-admin tenant'.split(' ')
        }],
        default: ['user']
    },
    album: [String],
    address: String,
    gender: {
        type: String,
        default: 'unknown',
        enum: ['male', 'female', 'unknown']
    },
    hobby: String,
    job: String,
    birthday: Date,
    selfDescription: String,
    school: String,
    bloodType: String,
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    locationLastUpdated: {
        type: Date
    },
    currentLocation: {
        index: '2dsphere',
        type: [Number]
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});


//UserSchema.index({username:1,email:1},{sparse: true, unique: true});
/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
    if (this.password && this.password.length > 6 && this.password.length < 32) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

UserSchema.methods.inUserBlackList = function (user) {
    for (var index = 0; index < user.blackList.length; index++) {
        if (user.blackList[index].equals(this.id)) {
            return true;
        }
    }
    return false;
};

/**
 * 检验用户注册数据是否符合要求。
 * @param user
 * @returns {*}
 */
UserSchema.statics.checkArgument = function (user) {
    if (!user.username) {
        return statusCode.USERNAME_EMPTY;
    }
    if (!user.username.match(/^[a-zA-Z0-9_]{6,32}/)) {
        return statusCode.USERNAME_INVALID;
    }
    if(user.phoneNumber){
        if(!user.phoneNumber.match(/^0?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)){
            return statusCode.INVALID_PHONE_NUMBER;
        }
    }
    if (!user.password) {
        return statusCode.PASSWORD_EMPTY;
    }
    if (user.password.length < 8 || user.password.length > 32) {
        return statusCode.PASSWORD_INVALID;
    }
    return statusCode.SUCCESS;
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (+suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};
UserSchema.options.toJSON = {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.created;
        delete ret.salt;
        delete ret.password;
        delete ret.updated;
        delete ret.blackList;
        delete ret.friends;
        delete ret.belongToGroups;
        delete ret.friendsCategory;
        delete ret.album;
        if (ret.currentLocation) {
            ret.currentLocation = {
                longitude: ret.currentLocation[0],
                latitude: ret.currentLocation[1]
            };
        }
    }
};