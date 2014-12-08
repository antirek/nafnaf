ConfScheme = require 'astconf-template'

class Trunk  

  constructor: (configurator, obj)->
    @configurator = configurator
    @attributes = new ConfScheme.UserConf(obj)
    #super(obj)


  save: (callback) ->
    @_appendContextForTrunk()
    @_appendObjectToUsersConf(callback)


  _appendObjectToUsersConf: (callback)->
    users_conf = @configurator.files['users.conf']
    users_conf[@attributes.name] = @attributes

    @configurator.saveFile 'users.conf', callback
  

  _appendContextForTrunk: ()->
    extensions_conf = @configurator.files['extensions.conf']
    D = @configurator.dialplan
    App = D.Application
    @attributes['context'] = 'trunk-' + @attributes.name;

    context = new D.Context @attributes['context']
    console.log 'extensions_conf', extensions_conf

    context
      .append [
        new D.Extension('s')
          .append(App.Dial('SIP/gate')),
        new D.Include('international_calls')
        ]

    extensions_conf[@attributes.context] = context.makeObject()
  
    @configurator.saveFile 'extensions.conf', ()-> 
      console.log 'extensions.conf updated'

module.exports = Trunk