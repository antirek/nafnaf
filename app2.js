var User = function(obj){

  var userSchema = require('./templates/users.json');
  console.log('userSchema', userSchema);

  var attributes = {};
  
  var fields =  userSchema.sections.__user.fields;
  for (var field in fields){
    if(fields[field].required){
      attributes[field] = fields[field].default;
    }
  }

  console.log(attributes);

  for (var key in attributes){
  	if(obj[key]){
  		attributes[key] = obj[key];
  	}else{
  		throw new Error('No required param')
  	}
  }

  console.log(attributes);

  var getAttributeRuleFromSchema = function(key){
  	return userSchema.sections.__user.fields[key];
  }

  var set = function(key, value){
  	var rule = getAttributeRuleFromSchema(key);
  	
  }

  return {
  	name: attributes.name,
 		set: set
  }

};


var user = new User({name: 'Vasya', secret: "1234"});
console.log