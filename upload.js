var imageStore = new FS.Store.GridFS('images');

Images = new FS.Collection('images', {
  stores: [imageStore]
});

if (Meteor.isClient) {

  Meteor.subscribe('theImages');

  Template.hello.events({
    'change .myFileInput': function(event,template){

      // event.preventDefault();
      FS.Utility.eachFile(event, function(file){
        Images.insert(file, function(err, fileObj){
          if(err){
            console.log('there is an error');
          } else{
            var userId = Meteor.userId();
            var imagesURL = {
              'profile.image':'cfs/files/images/'+fileObj._id
            };
            Meteor.users.update(userId, {$set: imagesURL});
          }
        });
      });
    }
  });

  Template.show.helpers({
    theImage: function(){
      return Meteor.user().profile.image;
    }
  });

  Template.list.helpers({
    images: function(){
      return Images.find().fetch();
    }
  });

  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Images.allow({
       insert: function(){
         return true;
       },
       update: function(){
         return true;
       },
       remove: function(){
         return true;
       },
       download: function(){
         return true;
       }
    });
  });

Meteor.publish('theImages', function(){
  return Images.find({});
});

}
