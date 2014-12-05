
class ConfTemplate

  constructor: ()->
    @schema = require('./templates/' + @file)
    @attributes = {}
    @create()


  getSection: (key)->
    if @schema.sections[key]
      @schema.sections[key]

  
  create:->
    fields = @getSection(@section).fields
    for key of fields
      if fields[key].required
        @attributes[key] = fields[key].default || ''
    
    if @obj
      for key of @attributes
        if @obj[key]
          @attributes[key] = @obj[key]
        else 
          throw new Error 'No required param'


  getGeneral: ->
    fields = @getSection('general').fields
    general = {}
    for key of fields
      if fields[key].required
        general[key] = fields[key].default || ''
    general
      

  getAttributeFromSection: (section, key)->
    @getSection(section).fields[key]


  set: (key, value)->
    attribute = @getAttributeFromSection(@section, key)

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

  constructor: ->
    @file = 'users.json'
    super



class UserConf extends UsersConfTemplate

  constructor: (obj)->
    @section = '__user'
    @obj = obj
    super





user = new UserConf name: 'Vasya', secret: '1234'
user.set 'registersip', 'yes'
user.set 'hasiax', 'yes'
user.set 'fullname', 'Vasya Sokolov'

console.log user.getGeneral()
console.log 'user', user
console.log 'get', user.get 'name'
console.log 'user attributes', user.attributes

