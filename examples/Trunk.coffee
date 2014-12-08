ConfScheme = require 'astconf-template'

class Trunk extends ConfScheme.UserConf

  constructor: (asterisk, obj)->
    @asterisk = asterisk
    super(obj)


  save: (callback) ->
    @appendContextForTrunk()
    @appendObjectToUsersConf(callback)


  appendObjectToUsersConf: (callback)->
    users_conf = @asterisk.conffiles['users.conf']
    users_conf[@attributes.name] = @attributes

    @asterisk.saveConfFile 'users.conf', callback
  

  appendContextForTrunk: ()->
    extensions_conf = @asterisk.conffiles['extensions.conf']
    D = @asterisk.dialplan
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
  
    @asterisk.saveConfFile 
      'extensions.conf', ()-> 
        console.log 'extensions_conf updated'

module.exports = Trunk