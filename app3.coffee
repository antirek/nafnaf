
class ConfTemplate

  constructor: ()->
    @schema = require('./templates/' + @file)
    @attributes = {}


  getSection: (key)->
    if @schema.sections[key]
      @schema.sections[key]


  getSectionGeneral: ->
    @getSection('general')

  
  create: (section, obj)->
    fields = @getSection(section).fields

    for key of fields
      if fields[key].required
        @attributes[key] = fields[key].default || ''
   
    for key of @attributes
      if obj[key]
        @attributes[key] = obj[key]
      else 
        throw new Error 'No required param'
    @attributes


  getAttributeFromSection: (section, key)->
    @getSection(section).fields[key]


  set: (section, key, value)->
    attribute = @getAttributeFromSection(section, key)
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



class UsersConfTemplate extends ConfTemplate

  constructor: (obj) ->
    @file = 'users.json'
    super
    @create('__user', obj)


  set: (key, value)->
    super '__user', key, value



class User extends UsersConfTemplate

  constructor: (obj)->
    super name: obj.name, secret: obj.secret

  

user = new User name: 'Vasya', secret: '1234'
user.set 'fullname', 'Vasya Sokolov'

console.log 'user', user
console.log 'get', user.get 'name'