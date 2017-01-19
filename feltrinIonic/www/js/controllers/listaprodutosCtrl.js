angular.module('starter.listaprodutos', [])

.controller('listaprodutosCtrl', function($rootScope, $scope, $localStorage, $http, $timeout, $ionicModal, $ionicLoading) {

    $scope.topTitle = $rootScope.linhaSelecionada.titulo;
    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $scope.showListaProdutos = 1;
    $scope.dadosGerais = [];
    $scope.dados = [];
    $scope.dados2 = [];
    $rootScope.dadosTecnicos = [];
    $ionicLoading.show();

    $rootScope.orientation = screen.orientation.type;

    if($rootScope.larguraTela >= 830){
        $scope.showListaProdutos = 2;
    }
    else
        $scope.showListaProdutos = 1;

    // CRIA O ARRAY PARA O LOGIN
      $scope.loginData = {};

      

      // ESCONDE O MODAL DE LOGIN
      $scope.closeModalDetalhes = function() {
        console.log('fechar');
        $scope.modal.hide();
      };

      // ABRE O MODAL DE LOGIN
      $scope.showModalDetalhes = function() {
        //alert('modal');
        
        // CRIA O MODAL CHAMANDO O TEMPLATE
        if($rootScope.larguraTela >= 830){
            $ionicModal.fromTemplateUrl('templates/detalhesModal.html', {
                scope: $scope,
                animation:'none',
              }).then(function(modal) {
                $scope.modal = modal;
              });
            $timeout(function() {
                $scope.modal.show();
                $ionicLoading.hide();
            }, 100);
            
        }else{
            $ionicModal.fromTemplateUrl('templates/detalhesModal.html', {
                scope: $scope,
              }).then(function(modal) {
                $scope.modal = modal;
              });

            $timeout(function() {
                $scope.modal.show();
                $ionicLoading.hide();
            }, 100);
        }
          
      };

    for (var i=0; i < $localStorage.produtos.length; i++) {
                
        if($rootScope.categoriaSelecionada == $localStorage.produtos[i]['IdDaCategoria']){
            $localStorage.produtos[i].Foto = cordova.file.dataDirectory+$localStorage.produtos[i].id+".jpg";
            $scope.dadosGerais.push($localStorage.produtos[i]);
        }
        

        if(i == $localStorage.produtos.length-1){
            $timeout(function() {   
                $scope.carregarDados();
            }, 400);
        }
    };

    $scope.carregarDados = function(){ 

        var meio = parseInt($scope.dadosGerais.length/2);

        if($scope.dadosGerais.length <= 1){
            for (var i=0; i < $scope.dadosGerais.length; i++) {
                if(i == $scope.dadosGerais.length-1)
                    $ionicLoading.hide();
                if($rootScope.categoriaSelecionada == $scope.dadosGerais[i]['IdDaCategoria'])
                $scope.dados.push($scope.dadosGerais[i]);
            };
        }else{
            for (var i=0; i < meio; i++) {
                if($rootScope.categoriaSelecionada == $scope.dadosGerais[i]['IdDaCategoria'])
                $scope.dados.push($scope.dadosGerais[i]);
            };

            for (var i=meio; i < $scope.dadosGerais.length; i++) {
                if(i == $scope.dadosGerais.length-1){
                    $ionicLoading.hide();
                    $rootScope.produto = $scope.dados[0];
                }
                
                if($rootScope.categoriaSelecionada == $scope.dadosGerais[i]['IdDaCategoria'])
                $scope.dados2.push($scope.dadosGerais[i]);
            };
        }

        
    }

    $scope.clickProdutoDetalhes = function(produto){
        $ionicLoading.show();
        console.log(produto);
        $rootScope.produto = produto;
        $rootScope.dadosTecnicos = [];
        for (var i=0; i < produto.DadosTecnicos.length; i++) { 
            if(i == produto.DadosTecnicos.length-1){
                $ionicLoading.hide();
            }        
            $rootScope.dadosTecnicos.push({Nome: produto.DadosTecnicos[i].Nome, Descricao: produto.DadosTecnicos[i].Descricao});
        };
        $scope.showModalDetalhes();


        /*
        if($rootScope.orientation.indexOf('landscape') != -1 ){
            $rootScope.produto = produto;
            $scope.$apply();
        }else{
          console.log(produto);
          $rootScope.produtoSelecionado = produto;
        }*/
    }

    window.addEventListener("orientationchange", function(){
        console.log(screen.orientation.type); // e.g. portrait 
        $rootScope.orientation = screen.orientation.type;
        $scope.telaDetalhesLado();
        $rootScope.larguraTela = window.screen.width+30;
        //alert($rootScope.larguraTela);
    });

    $scope.telaDetalhesLado = function(){
        console.log($rootScope.orientation.indexOf('landscape'));
        if($rootScope.orientation.indexOf('landscape') != -1 ){
          $scope.showListaProdutos = 2;
        }
        else{
          $scope.showListaProdutos = 1;
        }
        $scope.$apply();
    }



})