angular.module('starter.buscaclientes', [])

.controller('buscaclientesCtrl', function($scope, $rootScope, $localStorage, $ionicHistory, $ionicLoading) {

    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $rootScope.showOpcoes = 2;
    $scope.items = [];
    $rootScope.idCliente = '';
    $ionicLoading.show();

    //$scope.arrayClientes = [];
    /*$scope.arrayClientes.push({id:1, nome: "José da Silva"});
    $scope.arrayClientes.push({id:2, nome: "Roberto Pereira"});
    $scope.arrayClientes.push({id:3, nome: "Jair Farias"});
    $scope.arrayClientes.push({id:4, nome: "Leonardo da Silva"});
    $scope.arrayClientes.push({id:5, nome: "Lucia Pereira"});*/

    $ionicLoading.hide();

    $scope.carregaArray = function(){
        if($rootScope.arrayGeralClientes == undefined){
          $rootScope.arrayGeralClientes = [];
          for (var i=0; i < $localStorage.clientes.length; i++) {

            $rootScope.arrayGeralClientes.push({id:$localStorage.clientes[i]['id'], cpf:$localStorage.clientes[i]['CpfCnpj'], nome:$localStorage.clientes[i]['Nome'], sobrenome:$localStorage.clientes[i]['Sobrenome']});
            //$scope.$apply();
            if(i == $localStorage.clientes.length-1)
                    $ionicLoading.hide();
          };
        }else{
            $rootScope.arrayGeralClientes = [];
            for (var i=0; i < $localStorage.clientes.length; i++) {

                $rootScope.arrayGeralClientes.push({id:$localStorage.clientes[i]['id'], cpf:$localStorage.clientes[i]['CpfCnpj'], nome:$localStorage.clientes[i]['Nome'], sobrenome:$localStorage.clientes[i]['Sobrenome']});
                //$scope.$apply();
                if(i == $localStorage.clientes.length-1)
                    $ionicLoading.hide();
            };
        }
    }

    $rootScope.buscaClientes = function(){
        $rootScope.idCliente = '';
        $rootScope.goto('app.cadastroclientes')
    }

    $scope.clickCliente = function(id, cpf, nome){
        console.log('cpf: '+cpf+' nome: '+nome);
        $rootScope.idCliente = id;
        if($rootScope.buscaClientesPedido == 1){
            $rootScope.idClientePedido = id;
            $rootScope.cpfClientePedido = cpf;
            $rootScope.nomeClientePedido = nome;
            $rootScope.showOpcoes = 1;
            $ionicHistory.goBack();
        }else{
           $rootScope.goto('app.cadastroclientes') 
        }
        
    }

    $scope.carregaArray();


})