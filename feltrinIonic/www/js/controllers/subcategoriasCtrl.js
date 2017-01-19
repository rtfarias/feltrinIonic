angular.module('starter.subcategorias', [])

.controller('subcategoriasCtrl', function($scope, $rootScope, $ionicLoading, $localStorage, $timeout) {

    $scope.topTitle = $rootScope.linhaPedidoSelecionada.Linha;
    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $rootScope.categoriaPedidoSelecionada = "";
    $scope.items = [];
    $ionicLoading.show();


    $scope.init = function(){
      for (var i=0; i < $localStorage.SubLinhas.length; i++) {
          console.log($localStorage.SubLinhas[i]['Linha']);

            if(i == $localStorage.SubLinhas.length-1)
                $ionicLoading.hide();

            if($rootScope.linhaPedidoSelecionada.id == $localStorage.SubLinhas[i]['IdDaLinha'] && $localStorage.SubLinhas[i]['SubLinha'] != null)
        $scope.items.push({id:$localStorage.SubLinhas[i]['id'], titulo:$localStorage.SubLinhas[i]['SubLinha']});
            
      };
    }

    $scope.initGrade = function(){
      for (var i=0; i < $localStorage.categoriasPedido.length; i++) {
          console.log($localStorage.categoriasPedido[i]['Linha']);

            if(i == $localStorage.categoriasPedido.length-1)
                $ionicLoading.hide();

            if($rootScope.linhaPedidoSelecionada.id == $localStorage.categoriasPedido[i]['IdDaLinha'] && $localStorage.categoriasPedido[i]['Categoria'] != null)
        $scope.items.push({id:$localStorage.categoriasPedido[i]['id'], titulo:$localStorage.categoriasPedido[i]['Categoria']});
            
      };
    }
    
    $scope.clickSubCategoria = function(categoria){
      $rootScope.categoriaPedidoSelecionada = categoria;
      $rootScope.goto('app.produtospedido');
    }

    $timeout(function(){
        if($rootScope.linhaPedidoSelecionada.Grade != null){
            $scope.initGrade();
        }else{
            $scope.init();
        }
        
    },100);

})