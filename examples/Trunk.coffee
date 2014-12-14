Template = require 'astconf-template'

class Trunk  

  constructor: (configurator, obj) ->
    @configurator = configurator
    @user = Template['users']('__user', obj);


  save: (callback) ->
    @_appendContextForTrunk()
    @_appendObjectToUsersConf(callback)


  _appendObjectToUsersConf: (callback) ->
    users_conf = @configurator.files['users.conf']
    users_conf[@user.getName()] = @user.getAttributes()

    @configurator.saveFile 'users.conf', callback
  

  _appendContextForTrunk: () ->
    extensions_conf = @configurator.files['extensions.conf']
    D = @configurator.dialplan
    App = D.Application
    name = 'trunk-' + @user.getName();

    context = new D.Context name

    context
      .append [
        new D.Extension('s')
          .append(App.Dial('SIP/gate')),
        new D.Include('international_calls')
        ]

    extensions_conf[name] = context.makeObject()
  
    @configurator.saveFile 'extensions.conf', () ->
      console.log 'extensions.conf updated'


module.exports = Trunk