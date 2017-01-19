angular.module('starter.subprodutospedido', [])

.controller('subprodutospedidoCtrl', function($rootScope, $scope, $ionicPlatform, $ionicHistory, $localStorage, $ionicLoading, $http, $timeout, $ionicModal) {

    $scope.topTitle = $rootScope.linhaPedidoSelecionada.Linha;
    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $scope.showListaProdutos = 1;
    $scope.dadosGerais = [];
    $scope.dados = [];
    $scope.dados2 = [];
    $ionicLoading.show();
    $rootScope.clickCarrinho = 0;

    $rootScope.orientation = screen.orientation.type;

    if($rootScope.larguraTela >= 830){
        $scope.showListaProdutos = 2;
    }
    else
        $scope.showListaProdutos = 1;

 
    $scope.init = function(){

          var arrayItensCategoria = [];


          for (var i=0; i < $rootScope.ItensSubgrupo.length+1; i++) {

                if(i == $rootScope.ItensSubgrupo.length){
                    console.log(i);
                    $scope.carregarDados();
                }

                if($rootScope.ItensSubgrupo[i] != undefined){
                    //console.log('codigo item: '+JSON.stringify($rootScope.ItensSubgrupo[i]));

                    var condicao = {CodigoDoItem: $rootScope.ItensSubgrupo[i].CodigoDoItem};
                    function getItem(item) {
                        for(var key in condicao) {
                            if(item[key] === undefined || item[key] != condicao[key])
                                return null;
                        }
                        return item;
                    }
                    filter = $rootScope.itensPedido.filter(getItem);
                    //console.log(filter);


                    if(filter != null && parseFloat(filter.length) > 0 && filter[0].Quantidade != undefined)
                        $rootScope.ItensSubgrupo[i].Quantidade = filter[0].Quantidade;
                    else
                       $rootScope.ItensSubgrupo[i].Quantidade = null; 

                    $scope.dadosGerais.push($rootScope.ItensSubgrupo[i]);
                    $scope.dadosGerais[i].correto = true;
                }


                
          };


    }



    $scope.carregarDados = function(){ 

        var meio = parseInt($scope.dadosGerais.length/2);

        var j=0;

        if($scope.dadosGerais.length <= 1){
            for (var i=0; i < $scope.dadosGerais.length; i++) {
                if(i == $scope.dadosGerais.length-1)
                    $ionicLoading.hide();
                $scope.dados.push($scope.dadosGerais[i]);
                $scope.dados[j].index = i;
                j++;
            };
        }else{
            var j=0;
            for (var i=0; i < meio; i++) {
                $scope.dados.push($scope.dadosGerais[i]);
                $scope.dados[j].index = i;
                j++;
                if(i == meio-1){
                    var j=0;
                    for (var i=meio; i < $scope.dadosGerais.length; i++) {
                        if(i == $scope.dadosGerais.length-1){
                            $ionicLoading.hide();
                            $rootScope.produto = $scope.dados[0];
                        }
                        $scope.dados2.push($scope.dadosGerais[i]);
                        $scope.dados2[j].index = i;
                        j++;
                    };
                }
            };

            
        }

        
    }

    $rootScope.verificaVoltar = function(){
        console.log('entrou no voltar');
        if($rootScope.verificaCliqueVoltar != null){
            if($rootScope.verficaValor != 1){
                if($rootScope.clickCarrinho != 1)
                    $ionicHistory.goBack(-1);
                $rootScope.verificaCliqueVoltar = null;
            }else{
                $rootScope.alerta('', 'A quantidade deve estar correta.');
            }
        }
    }


      var oldSoftBack = $rootScope.$ionicGoBack;
      $rootScope.$ionicGoBack = function() {
          $timeout(function() {$rootScope.verificaVoltar();}, 200);  
      };
      var deregisterSoftBack = function() {
          $rootScope.$ionicGoBack = oldSoftBack;
      };
      var customBack = function(){
        $timeout(function() {$rootScope.verificaVoltar();}, 200);  
      }
      var deregisterHardBack = $ionicPlatform.registerBackButtonAction(
          customBack, 101
      );
      // cancel custom back behaviour
      $scope.$on('$destroy', function() {
          deregisterHardBack();
          deregisterSoftBack();
          customBack();
      });

    $rootScope.verficaValor = 0;
    $rootScope.verificaCliqueVoltar = 1;

    var array = [];


    $scope.changeItemPedido = function(item){

        if(item.Quantidade > 0 && item.Quantidade != "" && item.Quantidade != null){

            var PesoLiquido = item.PesoLiquido;
            var Quantidade = item.Quantidade;

            var correto=true;
            var valor  = 0;
            var j=0;
            if(PesoLiquido != 0.00000){
            
                while(correto){
                    if(j>100)
                        break;
                    if(Quantidade<item.PesoLiquido){
                        correto=false;
                        break;
                    }
                    valor = parseFloat(Quantidade-item.PesoLiquido).toPrecision(3);
                    if(valor==0){
                        break;
                    }else if(valor < 0){
                        correto=false;
                        break;
                    }
                    console.log('valor while: '+valor);
                    Quantidade = valor;
                    j++;
                }
            }

            //console.log(parseInt(Quantidade % PesoLiquido) + (((Quantidade * 100) % PesoLiquido) / 100));
            //var restoQuantidade = parseInt(Quantidade % PesoLiquido) + (((Quantidade * 100) % PesoLiquido) / 100);

            console.log($rootScope.verficaValor);

            //if(correto == false)
            $scope.dadosGerais[item.index].correto = correto;

            $rootScope.verficaValor = 0;

            for (var i = 0; i < $scope.dadosGerais.length; i++) {
                console.log($scope.dadosGerais[i].correto);
                if($scope.dadosGerais[i].correto == false){
                    $rootScope.verficaValor = 1;
                    break;
                }
                if(i==array.length-1){
                    $rootScope.verficaValor = 0;
                }
            }

            if(item.UnidadeDeVenda == 'KG'){
                if(correto){

                        var filter = null;
                        var condicao = {CodigoDoItem: item.CodigoDoItem};
                        function getItem(item) {
                            for(var key in condicao) {
                                if(item[key] === undefined || item[key] != condicao[key])
                                    return null;
                            }
                            return item;
                        }
                        filter = $rootScope.itensPedido.filter(getItem);
                        console.log(filter);
                        if(filter == null || filter.length == 0){
                            console.log('adiciona item: '+item);
                            item.PrecoOriginalEnviar = parseFloat(item.PrecoDeVenda)*item.PesoLiquido;
                            item.PrecoTotalItem = item.PrecoDeVenda;
                            item.PrecoDeVenda = parseFloat(item.PrecoDeVenda)*item.PesoLiquido;
                            $rootScope.itensPedido.push(item);
                        }else{
                            console.log('soma item: '+item.Quantidade);
                            filter[0].Quantidade=item.Quantidade;
                        }
                }else{
                    //$rootScope.alerta('', 'O valor deve ser multiplo do peso liquido e diferente de zero.');
                }
            }else{

                if(parseFloat(item.Quantidade) == parseInt(item.Quantidade) && !isNaN(item.Quantidade))
                    $scope.dadosGerais[item.index].correto = true;
                else
                    $scope.dadosGerais[item.index].correto = false;

                $rootScope.verficaValor = 0;

                for (var i = 0; i < $scope.dadosGerais.length; i++) {
                    console.log($scope.dadosGerais[i].correto);
                    if($scope.dadosGerais[i].correto == false){
                        $rootScope.verficaValor = 1;
                        break;
                    }
                    if(i==array.length-1){
                        $rootScope.verficaValor = 0;
                    }
                }

                if(parseFloat(item.Quantidade) == parseInt(item.Quantidade) && !isNaN(item.Quantidade)){
                        var filter = null;
                        var condicao = {CodigoDoItem: item.CodigoDoItem};
                        function getItem(item) {
                            for(var key in condicao) {
                                if(item[key] === undefined || item[key] != condicao[key])
                                    return null;
                            }
                            return item;
                        }
                        filter = $rootScope.itensPedido.filter(getItem);
                        console.log(filter);
                        if(filter == null || filter.length == 0){
                            console.log('adiciona item: '+JSON.stringify(item));
                            item.PrecoOriginalEnviar = parseFloat(item.PrecoDeVenda);
                            //item.PrecoDeVenda = item.PrecoDeVenda.replace(',', '.'); 
                            item.PrecoDeVenda = parseFloat(item.PrecoDeVenda);
                            item.PrecoTotalItem = item.PrecoDeVenda;
                            console.log('adiciona item: '+JSON.stringify(item));
                            $rootScope.itensPedido.push(item);
                        }else{

                            console.log('soma item: '+item.Quantidade);
                            filter[0].Quantidade=item.Quantidade;
                        }
                }else{
                    //$rootScope.alerta('', 'O valor deve ser inteiro e maior do que zero.');
                }
            }
        }

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


    $timeout(function(){
        $scope.init();
    },100);

})