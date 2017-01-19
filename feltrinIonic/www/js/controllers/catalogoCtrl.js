angular.module('starter.catalogo', [])

.controller('catalogoCtrl', function($scope, $rootScope, $http, $localStorage, $ionicLoading) {

    $scope.topTitle = "CATÁLOGO";
    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $rootScope.linhaSelecionada = "";
    $scope.linhas = [];

    $ionicLoading.show();

    for (var i=0; i < $localStorage.linhas.length; i++) {
      $scope.linhas.push({id:$localStorage.linhas[i]['id'], titulo:$localStorage.linhas[i]['Linha']});
      if(i == $localStorage.linhas.length-1)
              $ionicLoading.hide();
    };
    
    $scope.clickLinha = function(linha){
      $rootScope.linhaSelecionada = linha;
    }

})