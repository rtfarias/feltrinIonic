angular.module('starter.produtospedido', [])

.controller('produtospedidoCtrl', function($rootScope, $scope, $localStorage, $ionicLoading, $http, $timeout, $ionicModal) {

    $scope.topTitle = $rootScope.linhaPedidoSelecionada.Linha;
    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $scope.showListaProdutos = 1;
    $scope.showGrade = 1;
    $scope.dadosGerais = [];
    $scope.dados = [];
    $scope.dados2 = [];
    $scope.grupos = [];
    $rootScope.ItensSubgrupo = [];
    $rootScope.comentario = "";
    $ionicLoading.show();

    $rootScope.orientation = screen.orientation.type;

    if($rootScope.larguraTela >= 830){
        $scope.showListaProdutos = 2;
    }
    else
        $scope.showListaProdutos = 1;

    $scope.initGrade = function(){
            for (var i=0; i < $localStorage.produtosPedido.length; i++) {
                        
                if($rootScope.linhaPedidoSelecionada.id == $localStorage.produtosPedido[i].Id){

                    var arraySubCategorias = $localStorage.produtosPedido[i].PrecosSubtipo;

                    for (var n = 0; n < arraySubCategorias.length; n++) {

                        if($rootScope.categoriaPedidoSelecionada == arraySubCategorias[n].CodigoDaGrade){

                            $scope.grade = arraySubCategorias[n].CodigoDaGrade;
                            $scope.linha = arraySubCategorias[n].Descricao;


                            var array = [];
                            array = $localStorage.produtosPedido[i].PrecosSubtipo[n].PrecosItens;

                            var preco = parseFloat(array[0].PrecoDeVenda).toFixed(2);
                            preco = preco.replace('.',',');

                            $scope.preco = preco;
                            $scope.embalagem = array[0].Multiplicador;

                            for (var j = 0; j < array.length; j++) {
                                
                                    var encontrado = 0;

                                    array[j].Grade = arraySubCategorias[n].CodigoDaGrade;

                                    for (var k = 0; k < $rootScope.itensPedido.length; k++) {

                                        if($rootScope.linhaPedidoSelecionada.Grade == $rootScope.itensPedido[k].Grade){
                                            encontrado = 1;
                                            var filter = null;
                                            var condicao = {CodigoDoItem: array[j].CodigoDoItem};
                                            function getItem(item) {
                                                for(var key in condicao) {
                                                    if(item[key] === undefined || item[key] != condicao[key])
                                                        return null;
                                                }
                                                return item;
                                            }
                                            filter = $rootScope.itensPedido[k].Itens.filter(getItem);
                                            console.log('filter: '+filter);
                                            array[j].Grade = arraySubCategorias[n].CodigoDaGrade;

                                            if(filter != null && filter.length > 0 && filter[0].Quantidade != undefined)
                                                array[j].Quantidade = filter[0].Quantidade;
                                            else
                                               array[j].Quantidade = null;     
                                            $scope.dadosGerais.push(array[j]);
                                        }
                                    }

                                    console.log('UNIDADE de VENda: '+$localStorage.produtosPedido[i].PrecosSubtipo[n].PrecosItens[0].UnidadeDeVenda);
                                    array[j].Linha = $localStorage.produtosPedido[i].Descricao;
                                    array[j].UnidadeDeVenda = $localStorage.produtosPedido[i].PrecosSubtipo[n].PrecosItens[0].UnidadeDeVenda;

                                    if(encontrado == 0){
                                        array[j].Grade = arraySubCategorias[n].CodigoDaGrade;
                                        array[j].Quantidade = null;     
                                        $scope.dadosGerais.push(array[j]);
                                    }

                            }
                            break;
                        }

                    }

                    
                }
                

                if(i == $localStorage.produtosPedido.length-1){
                    $timeout(function() {   
                        $scope.carregarDados();
                    }, 400);
                }
            };
    }

    var arrayTemp = [];

    $scope.init = function(){

          $scope.arrayItensCategoria = [];

          

         var carregaArrayTemporario = function(){

                for (var i = 0; i < $scope.grupos.length; i++) {
                        arrayTemp.push({id:$scope.grupos.id, Descricao:$scope.grupos[i].Descricao, Linha: $scope.grupos[i].Linha, ItensGrupoNormal:$scope.grupos[i].ItensGrupoNormal});

                        if(i == $scope.grupos.length-1){
                            $timeout(function() {   
                                separaSubGrupos();
                            }, 100);
                        }
                }
          }

          var separaSubGrupos = function(){


            for (var i=0; i < arrayTemp.length; i++) {


                var arrayCat = [];
                for (var j = 0; j < arrayTemp[i].ItensGrupoNormal.length; j++) {


                    if(arrayTemp[i].ItensGrupoNormal[j].Referencia == ""){

                        var preco = parseFloat(arrayTemp[i].ItensGrupoNormal[j].PrecoDeVenda).toFixed(2);
                        preco = preco.replace('.',',');
                        if(preco == '0,00')preco = 'Consultar';
                        arrayCat.push({IdDoPrecoTipo:arrayTemp[i].ItensGrupoNormal[j].IdDoPrecoTipo, Linha:arrayTemp[i].Linha,CodigoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].CodigoDoGrupo,DescricaoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,Referencia:arrayTemp[i].ItensGrupoNormal[j].Referencia,DescricaoDaReferencia:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,CodigoDoItem:arrayTemp[i].ItensGrupoNormal[j].CodigoDoItem,DescricaoDoItem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,PesoLiquido:arrayTemp[i].ItensGrupoNormal[j].PesoLiquido,Multiplicador:arrayTemp[i].ItensGrupoNormal[j].Multiplicador,PrecoDeVenda:preco ,UnidadeDeVenda:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeVenda,DescricaoDaUnDeVenda:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeVenda,UnidadeDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeEmbalagem,DescricaoDaUnDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeEmbalagem, ItensSubgrupo: []});
                        arrayCat[j].ItensSubgrupo.push({Linha:arrayTemp[i].Linha, IdDoPrecoTipo:arrayTemp[i].ItensGrupoNormal[j].IdDoPrecoTipo,CodigoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].CodigoDoGrupo,DescricaoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoGrupo,Referencia:arrayTemp[i].ItensGrupoNormal[j].Referencia,DescricaoDaReferencia:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,CodigoDoItem:arrayTemp[i].ItensGrupoNormal[j].CodigoDoItem,DescricaoDoItem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,PesoLiquido:arrayTemp[i].ItensGrupoNormal[j].PesoLiquido,Multiplicador:arrayTemp[i].ItensGrupoNormal[j].Multiplicador,PrecoDeVenda:preco,UnidadeDeVenda:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeVenda,DescricaoDaUnDeVenda:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeVenda,UnidadeDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeEmbalagem,DescricaoDaUnDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeEmbalagem});


                    }else{

                        if(j==0){

                            var preco = parseFloat(arrayTemp[i].ItensGrupoNormal[j].PrecoDeVenda).toFixed(2);
                            preco = preco.replace('.',',');

                            if(preco == '0,00')preco = 'Consultar';

                            arrayCat.push({Linha:arrayTemp[i].Linha, IdDoPrecoTipo:arrayTemp[i].ItensGrupoNormal[j].IdDoPrecoTipo,CodigoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].CodigoDoGrupo,DescricaoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoGrupo,Referencia:arrayTemp[i].ItensGrupoNormal[j].Referencia,DescricaoDaReferencia:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaReferencia,CodigoDoItem:arrayTemp[i].ItensGrupoNormal[j].CodigoDoItem,DescricaoDoItem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,PesoLiquido:arrayTemp[i].ItensGrupoNormal[j].PesoLiquido,Multiplicador:arrayTemp[i].ItensGrupoNormal[j].Multiplicador,PrecoDeVenda:preco ,UnidadeDeVenda:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeVenda,DescricaoDaUnDeVenda:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeVenda,UnidadeDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeEmbalagem,DescricaoDaUnDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeEmbalagem, ItensSubgrupo: []});
                            
                            arrayCat[0].ItensSubgrupo.push({Linha:arrayTemp[i].Linha, IdDoPrecoTipo:arrayTemp[i].ItensGrupoNormal[j].IdDoPrecoTipo,CodigoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].CodigoDoGrupo,DescricaoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoGrupo,Referencia:arrayTemp[i].ItensGrupoNormal[j].Referencia,DescricaoDaReferencia:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaReferencia,CodigoDoItem:arrayTemp[i].ItensGrupoNormal[j].CodigoDoItem,DescricaoDoItem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,PesoLiquido:arrayTemp[i].ItensGrupoNormal[j].PesoLiquido,Multiplicador:arrayTemp[i].ItensGrupoNormal[j].Multiplicador,PrecoDeVenda:preco,UnidadeDeVenda:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeVenda,DescricaoDaUnDeVenda:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeVenda,UnidadeDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeEmbalagem,DescricaoDaUnDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeEmbalagem});
                        }else if(j>0 && arrayTemp[i].ItensGrupoNormal[j].Referencia !== "" && arrayTemp[i].ItensGrupoNormal[j].Referencia == arrayTemp[i].ItensGrupoNormal[j-1].Referencia){


                            var preco = parseFloat(arrayTemp[i].ItensGrupoNormal[j].PrecoDeVenda).toFixed(2);
                            preco = preco.replace('.',',');
                            if(preco == '0,00')preco = 'Consultar';

                            var index = arrayCat.length-1;
                            arrayCat[index].ItensSubgrupo.push({Linha:arrayTemp[i].Linha, IdDoPrecoTipo:arrayTemp[i].ItensGrupoNormal[j].IdDoPrecoTipo,CodigoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].CodigoDoGrupo,DescricaoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoGrupo,Referencia:arrayTemp[i].ItensGrupoNormal[j].Referencia,DescricaoDaReferencia:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaReferencia,CodigoDoItem:arrayTemp[i].ItensGrupoNormal[j].CodigoDoItem,DescricaoDoItem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,PesoLiquido:arrayTemp[i].ItensGrupoNormal[j].PesoLiquido,Multiplicador:arrayTemp[i].ItensGrupoNormal[j].Multiplicador,PrecoDeVenda:preco ,UnidadeDeVenda:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeVenda,DescricaoDaUnDeVenda:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeVenda,UnidadeDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeEmbalagem,DescricaoDaUnDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeEmbalagem});
                        }else{


                            var preco = parseFloat(arrayTemp[i].ItensGrupoNormal[j].PrecoDeVenda).toFixed(2);
                            preco = preco.replace('.',',');
                            if(preco == '0,00')preco = 'Consultar';
                            arrayCat.push({Linha:arrayTemp[i].Linha, IdDoPrecoTipo:arrayTemp[i].ItensGrupoNormal[j].IdDoPrecoTipo,CodigoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].CodigoDoGrupo,DescricaoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoGrupo,Referencia:arrayTemp[i].ItensGrupoNormal[j].Referencia,DescricaoDaReferencia:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaReferencia,CodigoDoItem:arrayTemp[i].ItensGrupoNormal[j].CodigoDoItem,DescricaoDoItem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,PesoLiquido:arrayTemp[i].ItensGrupoNormal[j].PesoLiquido,Multiplicador:arrayTemp[i].ItensGrupoNormal[j].Multiplicador,PrecoDeVenda: preco,UnidadeDeVenda:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeVenda,DescricaoDaUnDeVenda:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeVenda,UnidadeDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeEmbalagem,DescricaoDaUnDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeEmbalagem});
                            var index = arrayCat.length-1;

                            arrayCat[index].ItensSubgrupo = [];
                            arrayCat[index].ItensSubgrupo.push({Linha:arrayTemp[i].Linha, IdDoPrecoTipo:arrayTemp[i].ItensGrupoNormal[j].IdDoPrecoTipo,CodigoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].CodigoDoGrupo,DescricaoDoGrupo:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoGrupo,Referencia:arrayTemp[i].ItensGrupoNormal[j].Referencia,DescricaoDaReferencia:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaReferencia,CodigoDoItem:arrayTemp[i].ItensGrupoNormal[j].CodigoDoItem,DescricaoDoItem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDoItem,PesoLiquido:arrayTemp[i].ItensGrupoNormal[j].PesoLiquido,Multiplicador:arrayTemp[i].ItensGrupoNormal[j].Multiplicador,PrecoDeVenda: preco,UnidadeDeVenda:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeVenda,DescricaoDaUnDeVenda:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeVenda,UnidadeDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].UnidadeDeEmbalagem,DescricaoDaUnDeEmbalagem:arrayTemp[i].ItensGrupoNormal[j].DescricaoDaUnDeEmbalagem});
                        }
                    }
                    


                }

                $scope.grupos[i].ItensGrupoNormal = arrayCat;
            
                if(i == $scope.grupos.length-1){
                    $timeout(function() {   
                        $scope.carregarDadosSemGrade();
                    }, 100);
                }
                
            };
          }

          var array = [];
          array = $localStorage.categoriasPedido;

          for (var i=0; i < $localStorage.categoriasPedido.length; i++) {

                if($rootScope.categoriaPedidoSelecionada == $localStorage.categoriasPedido[i].IdDaSubLinha && $localStorage.categoriasPedido[i].Categoria != null){

                    $scope.Linha = $localStorage.categoriasPedido[i].Linha;
                    if($localStorage.categoriasPedido[i].ItensGrupoNormal.length > 0)
                    $scope.grupos.push({id:$localStorage.categoriasPedido[i].id, Linha: $localStorage.categoriasPedido[i].Linha, Descricao:$localStorage.categoriasPedido[i].Categoria, ItensGrupoNormal: $localStorage.categoriasPedido[i].ItensGrupoNormal});
                }
            
                if(i == $localStorage.categoriasPedido.length-1){
                    $timeout(function() {   
                        carregaArrayTemporario();
                    }, 100);
                }
                
          };


            /*for (var i=0; i < $localStorage.produtosPedido.length; i++) {
                        
                if($rootScope.linhaPedidoSelecionada.Id == $localStorage.produtosPedido[i]['Id']){

                    var array = [];
                    array = $localStorage.produtosPedido[i]['PrecosSubtipo'][0]['PrecosItens'];
                    for (var j = 0; j < array.length; j++) {
                        
                        if($rootScope.categoriaPedidoSelecionada == array[j]['CodigoDoGrupo']){
                            console.log('categoria igual codigo:  '+array[j]['CodigoDoGrupo']);

                            var condicao = {Referencia: array[j].Referencia, PrecoDeVenda: array[j].PrecoDeVenda};
                            function getItem(item) {
                                for(var key in condicao) {
                                    if(item[key] === undefined || item[key] != condicao[key])
                                        return null;
                                }
                                return item;
                            }
                            filter = $rootScope.itensPedido.filter(getItem);
                            console.log(filter);


                            if(filter != null && filter.length > 0 && filter[0].Quantidade != undefined)
                                array[j].Quantidade = filter[0].Quantidade;
                            else
                               array[j].Quantidade = 0;     
                            $scope.dadosGerais.push(array[j]);
                        }
                    }
                }
                

                if(i == $localStorage.produtosPedido.length-1){
                    $timeout(function() {   
                        $scope.carregarDadosSemGrade();
                    }, 400);
                }
            };*/
    }


    $scope.carregarDadosSemGrade = function(){ 

        console.log('carregarDadosSemGrade');

        var meio = parseInt($scope.grupos.length/2);
        

        if($scope.grupos.length <= 1){
            for (var i=0; i < $scope.grupos.length; i++) {
                if(i == $scope.grupos.length-1)
                    $ionicLoading.hide();
                $scope.dados.push(arrayTemp[i]);
            };
        }else{
            for (var i=0; i < meio; i++) {
                $scope.dados.push($scope.grupos[i]);
            };

            for (var i=meio; i < $scope.grupos.length; i++) {
                if(i == $scope.grupos.length-1){
                    $ionicLoading.hide();
                    $rootScope.produto = $scope.grupos[0];
                }
                $scope.dados2.push($scope.grupos[i]);
            };

            console.log('carregarDadosSemGrade --- caregou');
        }

        
    }


    $scope.carregarDados = function(){ 

        var meio = parseInt($scope.dadosGerais.length/2);

        if($scope.dadosGerais.length <= 1){
            for (var i=0; i < $scope.dadosGerais.length; i++) {
                if(i == $scope.dadosGerais.length-1)
                    $ionicLoading.hide();
                $scope.dados.push($scope.dadosGerais[i]);
            };
        }else{
            for (var i=0; i < meio; i++) {
                $scope.dados.push($scope.dadosGerais[i]);
            };

            for (var i=meio; i < $scope.dadosGerais.length; i++) {
                if(i == $scope.dadosGerais.length-1){
                    $ionicLoading.hide();
                    $rootScope.produto = $scope.dados[0];
                }
                $scope.dados2.push($scope.dadosGerais[i]);
            };
        }

        
    }

    $scope.clickCategoriaSemGrade = function(array){
        
        console.log(JSON.stringify(array));


        if(array.ItensSubgrupo == undefined){
            if(array.DescricaoDaReferencia == null)
                array.DescricaoDaReferencia = array.DescricaoDoItem;
            array.Linha = $scope.Linha;
            $rootScope.ItensSubgrupo = [];
            $rootScope.ItensSubgrupo.push(array);
        }else{
            $rootScope.ItensSubgrupo = [];
            $rootScope.ItensSubgrupo = array.ItensSubgrupo;
        }


        $rootScope.goto('app.subprodutospedido');
    }


    $scope.changeItemPedido = function(item){
        if(item.Quantidade != 0 && item.Quantidade != "" && item.Quantidade != null){
            if($rootScope.linhaPedidoSelecionada.Grade != null){
                var encontrado = 0;

                for (var i = 0; i < $rootScope.itensPedido.length; i++) {
                    if(item.Grade == $rootScope.itensPedido[i].Grade){
                        encontrado = 1;
                        var filter = null;
                        var condicao = {CodigoDoItem: item.CodigoDoItem, PrecoDeVenda: item.PrecoDeVenda};
                        function getItem(item) {
                            for(var key in condicao) {
                                if(item[key] === undefined || item[key] != condicao[key])
                                    return null;
                            }
                            return item;
                        }
                        filter = $rootScope.itensPedido[i].Itens.filter(getItem);
                        
                        if(filter == null || filter.length == 0){
                            
                            $rootScope.itensPedido[i].Itens.push(item);
                        }else{
                            //filter[0].quantidade+=item.quantidade;
                        }
                    }
                }
                if(encontrado==0){
                    var array = [];
                    array.push(item);
                    $rootScope.itensPedido.push({CodigoDoItem: item.CodigoDoItem, UnidadeDeVenda: item.UnidadeDeVenda, Multiplicador: item.Multiplicador, Grupo:$rootScope.linhaPedidoSelecionada.id, DescricaoDoGrupo:item.DescricaoDoGrupo, Embalagem: item.Multiplicador, Quantidade: item.Quantidade, PrecoDecimal: parseFloat(item.PrecoDeVenda).toFixed(2), PrecoDeVenda: item.PrecoDeVenda, Linha: item.Linha, Grade: item.Grade, Itens: array});

                }

            }else{
                var filter = null;
                var condicao = {Referencia: item.Referencia, PrecoDeVenda: item.PrecoDeVenda};
                function getItem(item) {
                    for(var key in condicao) {
                        if(item[key] === undefined || item[key] != condicao[key])
                            return null;
                    }
                    return item;
                }
                filter = $rootScope.itensPedido.filter(getItem);

                if(filter == null || filter.length == 0){
                    //console.log('adiciona item: '+item);
                    $rootScope.itensPedido.push(item);
                }else{
                    //console.log('soma item: '+item.quantidade);
                    //filter[0].quantidade+=item.quantidade;
                }
            }
        }

    }

    window.addEventListener("orientationchange", function(){
        //console.log(screen.orientation.type); // e.g. portrait 
        $rootScope.orientation = screen.orientation.type;
        $scope.telaDetalhesLado();
        $rootScope.larguraTela = window.screen.width+30;
        //alert($rootScope.larguraTela);
    });

    $scope.telaDetalhesLado = function(){
        //console.log($rootScope.orientation.indexOf('landscape'));
        if($rootScope.orientation.indexOf('landscape') != -1 ){
          $scope.showListaProdutos = 2;
        }
        else{
          $scope.showListaProdutos = 1;
        }
        $scope.$apply();
    }


    $timeout(function(){
        console.log('linha selecionada: '+$rootScope.linhaPedidoSelecionada);
        if($rootScope.linhaPedidoSelecionada.Grade != null){
            $scope.showGrade = 2;
            $scope.initGrade();
        }
        else{
            $scope.showGrade = 1;
            $scope.init();
        }
    },100);

})