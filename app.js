angular
  .module("doc", [
    "ui.router",
    "ngResource"
])
.config([
  "$stateProvider",
  "$locationProvider",
  RouterFunction
])
.controller("DoctorIndexController", [
  "DoctorFactory",
  DoctorIndexControllerFunction
])
.controller("DoctorShowController", [
  "DoctorFactory",
  "ReviewFactory",
    "$state",
  "$stateParams",
  DoctorShowControllerFunction
])
.controller("ReviewEditController", [
  "ReviewFactory",
    "$state",
  "$stateParams",
  ReviewEditControllerFunction
])
.factory( "DoctorFactory", [
      "$resource",
    FactoryFunction
    ])
.factory( "ReviewFactory", [
          "$resource",
        ReviewFactoryFunction
        ]);

function DoctorIndexControllerFunction(DoctorFactory){
  this.doctors = DoctorFactory.query()
}

function DoctorShowControllerFunction(DoctorFactory, ReviewFactory, $state, $stateParams){
  this.doctor = DoctorFactory.get({id: $stateParams.id})
  this.review = new ReviewFactory ();
  this.create = function () {
    this.review.$save({doctor_id: this.doctor.id}).then( review => {
      this.review = new ReviewFactory ();
      $state.go("doctorShow",{doctor_id: this.doctor.id}, {reload: true})
    })
  }
    this.destroy = function(review){
    ReviewFactory.delete({doctor_id: this.doctor.id, id: review.id}).$promise.then( () => {
      $state.go("doctorShow",{doctor_id: this.doctor.id}, {reload: true})
    })
   }
  }

function ReviewEditControllerFunction ( ReviewFactory, $state, $stateParams) {
  // this.review = ReviewFactory.get({id: review.id, doctor_id: review.doctor.id})
  this.review.$update({ doctor_id: this.doctor.id, id: review.id}).promise. then( response => {
  this.update = function(response){
        $state.go("doctorShow",{doctor_id: review.doctor.id}, {reload: true})
    })
  }
}

function RouterFunction($stateProvider, $locationProvider){
  $stateProvider, $locationProvider.html5Mode(true);
    .state("doctorIndex", {
      url: "/doctors",
      templateUrl: "js/ng-views/index.html",
      controller: "DoctorIndexController",
      controllerAs: "vm"
    })
    .state("doctorShow", {
      url: "/doctors/:id",
      templateUrl: "js/ng-views/show.html",
      controller: "DoctorShowController",
      controllerAs: "vm"
    })
    .state("reviewEdit", {
      url: "/doctors/:doctor_id/reviews/:id/edit",
      templateUrl: "js/ng-views/edit.html",
      controller: "ReviewEditController",
      controllerAs: "vm"
    })
}

function FactoryFunction( $resource ){
  return $resource( "https://aceso-app.herokuapp.com/doctors/:id", {}, {
        update: { method: "PUT" }
    });
  }
  function ReviewFactoryFunction( $resource ){
    return $resource( "https://aceso-app.herokuapp.com/doctors/:doctor_id/reviews/:id", {}, {
          update: { method: "PUT" }
      });
    }
