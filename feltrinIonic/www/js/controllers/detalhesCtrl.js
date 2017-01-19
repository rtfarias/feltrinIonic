angular.module('starter.detalhes', [])

.controller('detalhesCtrl', function($scope, $rootScope, $localStorage, $ionicLoading) {

    $scope.topTitle = $rootScope.produtoSelecionado.Categoria;
    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $scope.dadosTecnicos = [];
    $ionicLoading.show();

    for (var i=0; i < $rootScope.produtoSelecionado.DadosTecnicos.length; i++) { 
        if(i == $rootScope.produtoSelecionado.DadosTecnicos.length-1){
            $ionicLoading.hide();
        }        
        $scope.dadosTecnicos.push({Nome: $rootScope.produtoSelecionado.DadosTecnicos[i].Nome, Descricao: $rootScope.produtoSelecionado.DadosTecnicos[i].Descricao});
    };

    $scope.dados = $rootScope.produtoSelecionado;
    $rootScope.showLoadingPaginas = false;

})