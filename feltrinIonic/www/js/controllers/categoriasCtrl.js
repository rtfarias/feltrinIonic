angular.module('starter.categorias', [])

.controller('categoriasCtrl', function($scope, $rootScope, $http, $ionicLoading, $localStorage, $timeout) {

    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $rootScope.linhaPedidoSelecionada = "";
    $scope.linhas = [];
    $scope.dados = [];
    $scope.dados2 = [];
    $ionicLoading.show();
    $rootScope.maisDeUmaCategoria = 0;


    if($rootScope.larguraTela >= 830){
        $scope.showListaProdutos = 2;
    }
    else
        $scope.showListaProdutos = 1;

    $scope.init = function(){
      for (var i=0; i < $localStorage.linhasPedido.length; i++) {
        $scope.linhas.push($localStorage.linhasPedido[i]);
        if(i == $localStorage.linhasPedido.length-1){
                $scope.carregarDados();
                //$rootScope.showLoadingPaginas = false;
        }
      };
    }

    $scope.carregarDados = function(){ 

        var meio = parseInt($scope.linhas.length/2);

        if($scope.linhas.length <= 1){
            for (var i=0; i < $scope.linhas.length; i++) {
                if(i == $scope.linhas.length-1)
                    $ionicLoading.hide();
                $scope.dados.push($scope.linhas[i]);
            };
        }else{
            for (var i=0; i < meio; i++) {
                $scope.dados.push($scope.linhas[i]);
            };

            for (var i=meio; i < $scope.linhas.length; i++) {
                if(i == $scope.linhas.length-1){
                    $ionicLoading.hide();
                    $rootScope.produto = $scope.dados[0];
                }
                $scope.dados2.push($scope.linhas[i]);
            };
        }

        
    }
    
    $scope.clickLinha = function(linha){
      $rootScope.linhaPedidoSelecionada = linha;

      var maisDeUmaCategoria = 0;
      var j = 0;

      if($rootScope.linhaPedidoSelecionada.Grade != null){
        for (var i=0; i < $localStorage.categoriasPedido.length; i++) {
              if($rootScope.linhaPedidoSelecionada.id == $localStorage.categoriasPedido[i]['IdDaLinha'] && $localStorage.categoriasPedido[i]['Categoria'] != null){
                  $rootScope.categoriaPedidoSelecionada = $localStorage.categoriasPedido[i]['id'];
                  j++;
                  if(j>1){
                      $rootScope.maisDeUmaCategoria = 1;
                      maisDeUmaCategoria = 1;
                      break;
                  }
              } 
        };

        if(maisDeUmaCategoria == 1 && $rootScope.linhaPedidoSelecionada.Grade != null){
          $rootScope.goto('app.subcategorias');
        }else{
          $rootScope.goto('app.produtospedido');
        }

      }else{
        for (var i=0; i < $localStorage.SubLinhas.length; i++) {

              console.log('linha selecionada: '+$rootScope.linhaPedidoSelecionada.id);
              console.log('Sublinha: '+$localStorage.SubLinhas[i]['IdDaLinha']);

              if($rootScope.linhaPedidoSelecionada.id == $localStorage.SubLinhas[i]['IdDaLinha'] && $localStorage.SubLinhas[i]['SubLinha'] != null){
                  $rootScope.categoriaPedidoSelecionada = $localStorage.SubLinhas[i]['id'];
                  j++;
                  if(j>1){
                    $rootScope.maisDeUmaCategoria = 1;
                    console.log('MAis de um');
                      maisDeUmaCategoria = 1;
                      break;
                  }
              } 
        };

        if(maisDeUmaCategoria == 1){
          $rootScope.goto('app.subcategorias');
        }else{
          $rootScope.goto('app.produtospedido');
        }
      }




    }

    $timeout(function(){
        $scope.init();
    },100);

})