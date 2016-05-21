var fbook = angular.module('foodbookpro');
fbook.factory('recipeService',function($firebaseArray){
  var fb = new Firebase('https://recipebookpro.firebaseio.com');
  var recs = $firebaseArray(fb);
  var recipeService = {
    all : recs,
    get : function(recId){
      return recs.$getRecord(recId);
    }
  };
  return recipeService;
});
