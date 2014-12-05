// Generated by CoffeeScript 1.8.0
(function() {
  var ConfTemplate, ContextConf, ExtensionsConfTemplate, UserConf, UsersConfTemplate, sugar,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  sugar = require('sugar');

  ConfTemplate = (function() {
    function ConfTemplate() {
      this.schema = require('./templates/' + this.file);
      this.attributes = {};
      this.create();
    }

    ConfTemplate.prototype.getSection = function(key) {
      if (this.schema.sections[key]) {
        return this.schema.sections[key];
      }
    };

    ConfTemplate.prototype.create = function() {
      var fields, key, _i, _len, _ref, _results;
      fields = this.getSection(this.section).fields;
      for (key in fields) {
        if (fields[key].required) {
          this.attributes[key] = fields[key]["default"] || '';
        }
      }
      if (this.obj) {
        _ref = (Object.keys(fields)).intersect(Object.keys(this.obj));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          _results.push(this.attributes[key] = this.obj[key]);
        }
        return _results;
      }
    };

    ConfTemplate.prototype.getGeneral = function() {
      var fields, general, key;
      fields = this.getSection('general').fields;
      general = {};
      for (key in fields) {
        if (fields[key].required) {
          general[key] = fields[key]["default"] || '';
        }
      }
      return general;
    };

    ConfTemplate.prototype.getAttributeFromSection = function(section, key) {
      return this.getSection(section).fields[key];
    };

    ConfTemplate.prototype.set = function(key, value) {
      var attribute;
      attribute = this.getAttributeFromSection(this.section, key);
      if (attribute) {
        if (attribute.available) {
          if (__indexOf.call(attribute.available, value) >= 0) {
            return this.attributes[key] = value;
          } else {
            throw new Error('Not available value');
          }
        } else {
          return this.attributes[key] = value;
        }
      } else {
        throw new Error('This key not in schema');
      }
    };

    ConfTemplate.prototype.get = function(key) {
      return this.attributes[key];
    };

    return ConfTemplate;

  })();

  UsersConfTemplate = (function(_super) {
    __extends(UsersConfTemplate, _super);

    function UsersConfTemplate() {
      this.file = 'users.json';
      UsersConfTemplate.__super__.constructor.apply(this, arguments);
    }

    return UsersConfTemplate;

  })(ConfTemplate);

  ExtensionsConfTemplate = (function(_super) {
    __extends(ExtensionsConfTemplate, _super);

    function ExtensionsConfTemplate() {
      this.file = 'extensions.json';
      ExtensionsConfTemplate.__super__.constructor.apply(this, arguments);
    }

    return ExtensionsConfTemplate;

  })(ConfTemplate);

  UserConf = (function(_super) {
    __extends(UserConf, _super);

    function UserConf(obj) {
      this.section = '__user';
      this.obj = obj;
      UserConf.__super__.constructor.apply(this, arguments);
    }

    return UserConf;

  })(UsersConfTemplate);

  ContextConf = (function(_super) {
    __extends(ContextConf, _super);

    function ContextConf(obj) {
      this.section = '__context';
      this.obj = obj;
      ContextConf.__super__.constructor.apply(this, arguments);
    }

    return ContextConf;

  })(ExtensionsConfTemplate);

  module.exports = {
    ContextConf: ContextConf,
    UserConf: UserConf
  };

}).call(this);
