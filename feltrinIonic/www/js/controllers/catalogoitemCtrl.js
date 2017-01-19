angular.module('starter.catalogoitem', [])

.controller('catalogoitemCtrl', function($scope, $rootScope, $localStorage, $ionicLoading) {

    $scope.topTitle = $rootScope.linhaSelecionada.titulo;
    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $scope.items = [];
    $ionicLoading.show();


    for (var i=0; i < $localStorage.categorias.length; i++) {
      console.log($localStorage.categorias[i]['Linha']);

        if(i == $localStorage.categorias.length-1)
            $ionicLoading.hide();

        if($rootScope.linhaSelecionada.id == $localStorage.categorias[i]['IdDaLinha'] && $localStorage.categorias[i]['Categoria'] != null)
    $scope.items.push({id:$localStorage.categorias[i]['id'], titulo:$localStorage.categorias[i]['Categoria']});
        
  };
  
  $scope.clickCategoria = function(categoria){
    $rootScope.categoriaSelecionada = categoria;
  }

})