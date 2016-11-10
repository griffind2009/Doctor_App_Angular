// NHO: careful of your indentation
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
    // NHO: is this method being used?
    this.testSelect = function(){
      console.log(this.currentDoctor)
    }
    this.doctors = DoctorFactory.query()
    // NHO:  are lines 44 - 48 being used?
    this.searchDoctor = ""
    this.searchSpecialty=""
    $('.button').on('click',()=>{
      var keyword = $('#doctor-search').val()
    })

  }

  function DoctorShowControllerFunction(DoctorFactory, ReviewFactory, $state, $stateParams){
    this.doctor = DoctorFactory.get({id: $stateParams.id})
    this.review = new ReviewFactory ();
    this.create = function () {
      this.review.$save({doctor_id: this.doctor.id}).then( review => {
        this.review = new ReviewFactory ();
        $state.go("doctorShow",{doctor_id: this.doctor.id}, {reload: true})
      })
      // NHO: recommend removing all console.logs / other debugging info before you show your code to potential employers
      console.log(this.review)
    }

    this.destroy = function(review){
      ReviewFactory.delete({doctor_id: this.doctor.id, id: review.id}).$promise.then( () => {

        $state.go("doctorShow",{doctor_id: this.doctor.id}, {reload: true})
      })
    }
  }

  function ReviewEditControllerFunction ( ReviewFactory, $state, $stateParams) {
    // NHO: reminder to remove unused / commented out code
    // this.review = ReviewFactory.get({id: review.id, doctor_id: review.doctor.id})

    // NHO: does this method work?
    this.update = function(response){
      this.review.$update({ doctor_id: this.doctor.id, id: review.id}).$promise. then( response => {
        $state.go("doctorShow",{doctor_id: review.doctor.id}, {reload: true})
      })
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
  // NHO: any reason why this method is Patch?
  function ReviewFactoryFunction( $resource ){
    return $resource( "https://aceso-app.herokuapp.com/doctors/:doctor_id/reviews/:id", {}, {
      update: { method: "PATCH" }
    });
  }
