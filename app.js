angular
  .module("doc", [
    "ui.router",
    "ngResource"
])
.config([
  "$stateProvider",
  RouterFunction
])
.controller("DoctorIndexController", [
  "DoctorFactory",
  DoctorIndexControllerFunction
])
.controller("DoctorShowController", [
  // "$state",
  "DoctorFactory",
  "ReviewFactory",
  "$stateParams",
  DoctorShowControllerFunction
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
this.searchDoctor = ""
this.searchSpecialty=""
$('.button').on('click',()=>{
  var keyword = $('#doctor-search').val()
  console.log(this.doctors)
})

}

function DoctorShowControllerFunction(DoctorFactory, ReviewFactory, $stateParams){
  this.doctor = DoctorFactory.get({id: $stateParams.id})
  this.review = new ReviewFactory ();
  this.create = function () {
    // $state.go("doctorShow",{id: doctor.id})
  this.review.$save({doctor_id: this.doctor.id})
    console.log(this.review)

  }
}

function RouterFunction($stateProvider){
  $stateProvider
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
    .state("reviewNew", {
      url: "/doctors/:id",
      templateUrl: "js/ng-views/show.html",
      controller: "ReviewNewController",
      controllerAs: "vm"
    })
    .state("reviewShow", {
      url: "/doctors/:id",
      templateUrl: "js/ng-views/show.html",
      controller: "ReviewShowController",
      controllerAs: "vm"
    })
}

function FactoryFunction( $resource ){
  return $resource( "http://localhost:3000/doctors/:id", {}, {
        update: { method: "PUT" }
    });
  }
  function ReviewFactoryFunction( $resource ){
    return $resource( "http://localhost:3000/doctors/:doctor_id/reviews/:id", {}, {
          update: { method: "PUT" }
      });
    }
