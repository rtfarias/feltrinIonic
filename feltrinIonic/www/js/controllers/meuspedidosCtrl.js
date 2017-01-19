angular.module('starter.meuspedidos', [])

.controller('meuspedidosCtrl', function($rootScope, $scope, $ionicPopup, $ionicHistory, $localStorage, $ionicLoading, $http, $timeout, $ionicModal) {

    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $rootScope.bottomMenu = true;
    $scope.showListaProdutos = 1;
    $scope.dadosGerais = [];
    $scope.dados = [];
    $scope.dados2 = [];
    $scope.showMsgListaPedido = false;
    $ionicLoading.show();


    if($localStorage.pedidosSalvos == undefined || $localStorage.pedidosSalvos.length == 0){
        $scope.showMsgListaPedido = true;
        $ionicLoading.hide();
    }



    $rootScope.orientation = screen.orientation.type;

    if($rootScope.larguraTela >= 830){
        $scope.showListaProdutos = 2;
    }
    else
        $scope.showListaProdutos = 1;




    $scope.init = function(){
        if($localStorage.pedidosSalvos.length == 0){
            $scope.showMsgListaPedido = true;
            $ionicLoading.hide();
        }else{

            console.log('Vai tentar carregar: '+$localStorage.pedidosSalvos.length);

            var index = 0;

            for (var i=$localStorage.pedidosSalvos.length-1; i >= 0; i--) {

              console.log($localStorage.pedidosSalvos[i]);
                        
                //if($rootScope.categoriaSelecionada == $localStorage.produtos[i]['IdDaCategoria'])
                $scope.dadosGerais.push($localStorage.pedidosSalvos[i]);
                $scope.dadosGerais[index].index = i;

                index++;

                if(i == 0){
                    $timeout(function() {   
                        $scope.carregarDados();
                    }, 400);
                }
            };
        }
    }

    $scope.carregarDados = function(){ 

        var meio = parseInt($scope.dadosGerais.length/2);

        if($scope.dadosGerais.length <= 1){
            for (var i=0; i < $scope.dadosGerais.length; i++) {
                if(i == $scope.dadosGerais.length-1)
                    $ionicLoading.hide();
                //if($rootScope.categoriaSelecionada == $scope.dadosGerais[i]['IdDaCategoria'])
                $scope.dados.push($scope.dadosGerais[i]);
            };
        }else{
            for (var i=0; i < meio; i++) {
                //if($rootScope.categoriaSelecionada == $scope.dadosGerais[i]['IdDaCategoria'])
                $scope.dados.push($scope.dadosGerais[i]);
            };

            for (var i=meio; i < $scope.dadosGerais.length; i++) {
                if(i == $scope.dadosGerais.length-1){
                    $ionicLoading.hide();
                    $rootScope.produto = $scope.dados[0];
                }
                
                //if($rootScope.categoriaSelecionada == $scope.dadosGerais[i]['IdDaCategoria'])
                $scope.dados2.push($scope.dadosGerais[i]);
            };
        }

        
    }

    $scope.longClickDelete = function(item, index){
        var myPopup = $ionicPopup.show({
          title: 'Deseja deletar esse item?',
          scope: $scope,
          buttons: [
            
            {
              text: 'Sim',
              type: 'button-positive',
              onTap: function(e) {
                //alert('Tapped!'+res);
                if($rootScope.itensPedido.length == 1)
                    $rootScope.itensPedido = [];
                else
                    var removed = $rootScope.itensPedido.splice(index+1, 1);
                
                $timeout(function(){
                  $scope.dadosGerais = [];
                  $scope.dados = [];
                  $scope.dados2 = [];
                  $scope.init();
                  myPopup.close();
                }, 200);                
              }
            },
            {
              text: 'Não',
              type: 'button-calm',
              onTap: function(e) {
                //$scope.getCamera();
              }
            }
          ]
        });

    }

    $scope.salvarPedido = function(){
        if($rootScope.cpfClientePedido == undefined){
            $rootScope.alerta('Salvar Pedido', 'Você deve selecionar um cliente.');
        }else if($rootScope.itensPedido.length == 0){
            $rootScope.alerta('Salvar Pedido', 'Selecione ao menos um item.');
        }
        else{



            var myPopup = $ionicPopup.show({
              title: 'O que você deseja fazer?',
              scope: $scope,
              buttons: [
                {
                  text: 'Salvar e Enviar',
                  type: 'button-positive',
                  onTap: function(e) {
                       $scope.salvaPedidoOffline('enviar'); 
                  }
                },
                {
                  text: 'Salvar Rascunho',
                  type: 'button-calm',
                  onTap: function(e) {
                    $scope.salvaPedidoOffline('rascunho'); 
                  }
                }
              ]
            });
        } 
        

    }

    $scope.clickPedido = function(dados){
        $rootScope.arrayPedido = dados;
        $rootScope.goto('app.novopedido');
    }

    $scope.enviaPedidoBanco = function(array){

            $rootScope.login($localStorage.usuario , $localStorage.senha);

            var url = 'https://api.sementesfeltrin.com.br/?usuario=';
            $http.get(url).then(function(resposta) {

                console.log(resposta);
                $rootScope.alerta('Salvar Pedido', 'Pedido salvo com sucesso.');

            }, function(err) {$rootScope.alerta('Erro', 'Não foi possível enviar os dados, o pedido será salvo, entre em "Meus Pedidos" para tentar enviar novamente. '); });
    }

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

    $timeout(function(){
        $scope.init();
    },100);


})