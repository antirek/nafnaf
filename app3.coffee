
class User

  constructor: (obj) -> 
    @userSchema = require './templates/users.json'
    @attributes = {};

    fields = @userSchema.sections.__user.fields;
   
    for key of fields
      if fields[key].required
        @attributes[key] = fields[key].default;
   
    for key of @attributes
      if obj[key]
        @attributes[key] = obj[key]
      else 
        throw new Error 'No required param'


  getAttributeFromSchema: (key)->
    @userSchema.sections.__user.fields[key]


  set: (key, value)->
    attribute = @getAttributeFromSchema(key)
    if attribute 
      if attribute.available
        if value in attribute.available
          @attributes[key] = value
        else
          throw new Error 'Not available value'
      else
        @attributes[key] = value
    else
      throw new Error 'This key not in schema'


  get: (key)->
    @attributes[key]


user = new User name: 'Vasya', secret: '1234'
user.set 'fullname', 'Vasya Sokolov'

console.log 'user', user
console.log 'get', user.get 'name'