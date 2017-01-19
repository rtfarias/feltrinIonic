angular.module('starter.novopedido', [])

.controller('novopedidoCtrl', function($rootScope, $scope, $ionicPopup, $ionicHistory, $localStorage, $ionicLoading, $http, $timeout, $ionicModal) {

    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $rootScope.bottomMenu = true;
    $scope.showListaProdutos = 1;
    $scope.dadosGerais = [];
    $scope.dados = [];
    $scope.dados2 = [];
    $rootScope.dadosTecnicos = [];
    $scope.showMsgListaPedido = false;
    $ionicLoading.show();
    $scope.valorTotal = 0;
    $rootScope.maisDeUmaCategoria = 0;

    $scope.ComissaoVariavel = $localStorage.ComissaoVariavel;

    $scope.cliente = $rootScope.cpfClientePedido+' - '+$rootScope.nomeClientePedido;

    if($localStorage.pedidosSalvos == undefined || $localStorage.pedidosSalvos.length == 0){
        $scope.idPedido = 1;
    }else{
        $scope.idPedido = $localStorage.pedidosSalvos.length+1;
    }

    if($rootScope.cpfClientePedido == undefined){
        $scope.cliente = 'Não selecionado';
    }

    if($rootScope.itensPedido == undefined){
        $rootScope.itensPedido = [];
        $rootScope.objetoComentario = {comentario: ""};
        $ionicLoading.hide();
    }

    if($rootScope.arrayPedido != undefined){
        $rootScope.itensPedido = $rootScope.arrayPedido.Itens;
        
        $rootScope.cpfClientePedido = $rootScope.arrayPedido.Cliente;
        $rootScope.nomeClientePedido = $rootScope.arrayPedido.nomeCliente;
        $scope.cliente = $rootScope.arrayPedido.Cliente+' - '+$rootScope.arrayPedido.nomeCliente;
        $scope.idPedido = $rootScope.arrayPedido.IdDoPedido;
        $rootScope.objetoComentario.comentario =  $rootScope.arrayPedido.Comentarios;
        $scope.tipoPedido = $rootScope.arrayPedido.tipo;

    }else{
        $rootScope.objetoComentario = {comentario: ""};
    }


    $rootScope.orientation = screen.orientation.type;

    if($rootScope.larguraTela >= 830){
        $scope.showListaProdutos = 2;
    }
    else
        $scope.showListaProdutos = 1;

    

    // CRIA O ARRAY PARA O Comentario
      $scope.loginData = {};
        
        // CRIA O MODAL CHAMANDO O TEMPLATE
        if($rootScope.larguraTela >= 830){
            $ionicModal.fromTemplateUrl('templates/comentarios.html', {
                scope: $scope,
                animation:'none',
              }).then(function(modal) {
                $scope.modal = modal;
              });
            
        }else{
            $ionicModal.fromTemplateUrl('templates/comentarios.html', {
                scope: $scope,
              }).then(function(modal) {
                $scope.modal = modal;
              });
            
        }
        
      // ABRE O MODAL DE Comentario
      $scope.showComentarios = function() {

            $timeout(function() {
                $scope.modal.show();
            }, 50);
      };

      // ESCONDE O MODAL DE comentario
      $scope.closeModal = function() {
        $scope.modal.hide();
      };




    $scope.init = function(){
        if($rootScope.itensPedido.length == 0){
            $scope.showMsgListaPedido = true;
            $ionicLoading.hide();
        }else{
            for (var i=0; i < $rootScope.itensPedido.length; i++) {
                      
                if($rootScope.itensPedido[i].Grade != null && $rootScope.itensPedido[i].Grade != 'Não possui grade'){
                    var arrayItensGrade = [];
                    arrayItensGrade = $rootScope.itensPedido[i].Itens;  

                    var quantidade = 0;
                    for (var j = 0; j < arrayItensGrade.length; j++) { 
                        console.log(arrayItensGrade[j].Quantidade);
                        if(arrayItensGrade[j].Quantidade != undefined && arrayItensGrade[j].Quantidade != NaN && arrayItensGrade[j].Quantidade != null)
                            quantidade+= parseInt(arrayItensGrade[j].Quantidade);
                    }

                    var PrecoOriginal = $rootScope.itensPedido[i].PrecoDeVenda.toString();
                    $rootScope.itensPedido[i].PrecoOriginal = PrecoOriginal;

                    console.log('valor preco venda: '+parseFloat((parseFloat($rootScope.itensPedido[i].PrecoDeVenda)*(parseInt($rootScope.itensPedido[i].Multiplicador))*parseInt(quantidade))).toFixed(2));

                    var PrecoTotal = parseFloat((parseFloat($rootScope.itensPedido[i].PrecoDeVenda)*(parseInt($rootScope.itensPedido[i].Multiplicador))*parseInt(quantidade))).toFixed(2);
                    $rootScope.itensPedido[i].PrecoTotal = PrecoTotal;

                    var valorTotal = parseFloat(PrecoTotal)+parseFloat($scope.valorTotal);
                    $scope.valorTotal = valorTotal.toFixed(2);

                    $rootScope.itensPedido[i].Quantidade = parseInt(quantidade);
                    $rootScope.itensPedido[i].index = i;
                    $scope.dadosGerais.push($rootScope.itensPedido[i]);

                }else{

                    var PrecoOriginalEnviar = $rootScope.itensPedido[i].PrecoOriginalEnviar.toString();
                    $rootScope.itensPedido[i].PrecoOriginalEnviar = PrecoOriginalEnviar;

                    var PrecoOriginal = $rootScope.itensPedido[i].PrecoDeVenda.toString();
                    $rootScope.itensPedido[i].PrecoOriginal = PrecoOriginal;

                    console.log('preco liq: '+parseFloat($rootScope.itensPedido[i].PrecoTotalItem));
                    
                    var PrecoTotal = parseFloat(parseFloat($rootScope.itensPedido[i].PrecoTotalItem)*$rootScope.itensPedido[i].Quantidade).toFixed(2);
                    $rootScope.itensPedido[i].PrecoTotal = PrecoTotal;

                    var valorTotal = parseFloat(PrecoTotal)+parseFloat($scope.valorTotal);
                    $scope.valorTotal = valorTotal.toFixed(2);
                    
                    $rootScope.itensPedido[i].index = i;
                    $scope.dadosGerais.push($rootScope.itensPedido[i]);



                }
                

                if(i == $rootScope.itensPedido.length-1){
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

    $scope.clickClientes = function(){
        $rootScope.buscaClientesPedido = 1;
        $rootScope.goto('app.buscaclientes');
    }

    $scope.clickEditarItem = function(){
        $scope.valorTotal = 0;
        if($scope.itemLista.Quantidade != null){

            var item = $rootScope.itensPedido[$scope.index];
            var Quantidade = $scope.itemLista.Quantidade;

            if(Quantidade > 0 && Quantidade != "" && Quantidade != null){

                var PesoLiquido = parseFloat(item.PesoLiquido);

                console.log(PesoLiquido);
                console.log(Quantidade);

                var correto=true;
                var j=0;
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

                console.log(correto);

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
                                item.PrecoTotalItem = item.PrecoDeVenda;
                                item.PrecoDeVenda = parseFloat(item.PrecoDeVenda)*item.PesoLiquido;
                                $rootScope.itensPedido.push(item);
                            }else{
                                console.log('soma item: '+item.Quantidade);
                                filter[0].Quantidade=item.Quantidade;
                            }

                            $rootScope.itensPedido[$scope.index].Quantidade = $scope.itemLista.Quantidade;
                            $scope.dadosGerais = [];
                            $scope.dados = [];
                            $scope.dados2 = [];
                            $scope.init();
                            $timeout(function(){
                              $scope.myPopup.close();
                            }, 200);

                    }else{
                        $rootScope.alerta('', 'O valor deve ser multiplo do peso liquido e diferente de zero.');
                    }
                }else{

                    if((parseFloat(item.Quantidade) == parseInt(item.Quantidade)) && !isNaN(item.Quantidade)){
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
                                item.PrecoTotalItem = item.PrecoDeVenda;
                                $rootScope.itensPedido.push(item);
                            }else{

                                console.log('soma item: '+item.Quantidade);
                                filter[0].Quantidade=item.Quantidade;
                            }

                            $rootScope.itensPedido[$scope.index].Quantidade = $scope.itemLista.Quantidade;
                            $scope.dadosGerais = [];
                            $scope.dados = [];
                            $scope.dados2 = [];
                            $scope.init();
                            $timeout(function(){
                              $scope.myPopup.close();
                            }, 200);

                    }else{
                        $rootScope.alerta('', 'O valor deve ser inteiro e maior do que zero.');
                    }
                }

            }else{
                $rootScope.alerta('','Quantidade deve ser maior do que zero.');
            }

        }else{

            var arrayItens = $rootScope.itensPedido[$scope.index].Itens;

            for (var i = 0; i < arrayItens.length; i++) {
                if(arrayItens[i].Quantidade == null || arrayItens[i].Quantidade == '' || arrayItens[i].Quantidade == 0)
                    var removed = arrayItens.splice(i, 1); 
            }

            $rootScope.itensPedido[$scope.index].Itens = arrayItens;

            $scope.dadosGerais = [];
            $scope.dados = [];
            $scope.dados2 = [];
            $scope.init();
            $timeout(function(){
              $scope.modal.hide();
            }, 200);
        }

        
    }

    $scope.clickDeletarItem = function(){
        $scope.valorTotal = 0;
        if($rootScope.itensPedido.length == 1){
            $rootScope.itensPedido = [];
            $scope.dadosGerais = [];
            $scope.dados = [];
            $scope.dados2 = [];
            $scope.init();
        }
        else{
            var removed = $rootScope.itensPedido.splice($scope.index, 1);
            $scope.dadosGerais = [];
            $scope.dados = [];
            $scope.dados2 = [];
            $scope.init();
        }
        if($scope.itemLista.Quantidade != null){
            $timeout(function(){
              $scope.myPopup.close();
            }, 200);
        }else{
            $timeout(function(){
              $scope.modal.hide();
            }, 200);
        }
    }

    $scope.clickCancelar = function(){
        if($scope.itemLista.Quantidade != null){
            $timeout(function(){
              $scope.myPopup.close();
            }, 200);
        }else{
            $timeout(function(){
              $scope.modal.hide();
            }, 200);
        }
    }


    $scope.longClickDelete = function(item, index){

        $scope.index = index;
        $scope.itemLista = {Quantidade:null};

        if(item.Grade == null){

            $scope.itemLista = {Quantidade:item.Quantidade};

            $scope.myPopup = $ionicPopup.show({
              templateUrl: 'templates/popupeditaritem.html',
              title: '',
              scope: $scope,
              buttons: []
            });
        }else{
            $scope.itensGrade = [];
            $scope.itensGrade = item.Itens;

            $ionicModal.fromTemplateUrl('templates/gradeModal.html', {
                scope: $scope,
              }).then(function(modal) {
                $scope.modal = modal;
              });
            $timeout(function() {
                $scope.modal.show();
            }, 50);
        }

    }

    $scope.blurPrecoUn = function(valorUn, valorTotal, Quantidade, i){

        console.log('index: '+i);

        var valorTotalFloat = parseFloat(valorTotal);
        var valorUnFloat = parseFloat(valorUn);
        Quantidade = parseFloat(Quantidade);


        if(valorUnFloat >= parseFloat($rootScope.itensPedido[i].PrecoOriginal)){

            if($rootScope.itensPedido[i].Grade != null){
                $rootScope.itensPedido[i].PrecoTotal  = (valorUnFloat*parseInt($rootScope.itensPedido[i].Multiplicador))*Quantidade;
                $scope.valorTotal = 0;
                $scope.dadosGerais = [];
                $scope.dados = [];
                $scope.dados2 = [];
                $scope.init(); 
            }else{
                var PrecoTotal = parseFloat(valorUnFloat/$rootScope.itensPedido[i].PesoLiquido).toFixed(2);
                $rootScope.itensPedido[i].PrecoTotalItem = PrecoTotal;
                $rootScope.itensPedido[i].PrecoDeVenda = valorUnFloat;
                $scope.valorTotal = 0;
                $scope.dadosGerais = [];
                $scope.dados = [];
                $scope.dados2 = [];
                $scope.init(); 
            }

        }else{
            $rootScope.alerta('', 'O valor deve ser igual ou maior que o valor original');
            console.log('valor original: '+parseFloat($rootScope.itensPedido[i].PrecoOriginal));
            $rootScope.itensPedido[i].PrecoDeVenda  = parseFloat($rootScope.itensPedido[i].PrecoOriginal);

        }

        

    }

    $scope.blurPrecoTotal = function(valorUn, valorTotal, Quantidade, i){

        console.log('index: '+i);

        var valorTotalFloat = parseFloat(valorTotal);
        var valorUnFloat = parseFloat(valorUn);
        Quantidade = parseFloat(Quantidade);


        console.log(parseFloat($rootScope.itensPedido[i].PrecoOriginal));
        console.log('total: '+valorTotalFloat);
        console.log('total: '+valorUnFloat);
        console.log('Quantidade: '+Quantidade);

        if($rootScope.itensPedido[i].Grade != null){
            console.log( (parseFloat($rootScope.itensPedido[i].PrecoOriginal)*$rootScope.itensPedido[i].Multiplicador)*Quantidade);
            if(valorTotalFloat >= (parseFloat($rootScope.itensPedido[i].PrecoOriginal)*parseInt($rootScope.itensPedido[i].Multiplicador))*Quantidade){
                $rootScope.itensPedido[i].PrecoDeVenda = valorTotalFloat/Quantidade;
                $scope.valorTotal = 0;
                $scope.dadosGerais = [];
                $scope.dados = [];
                $scope.dados2 = [];
                $scope.init(); 
            }else{
                $rootScope.alerta('', 'O valor deve ser igual ou maior que o valor original');
                $rootScope.itensPedido[i].PrecoTotal  = (parseFloat($rootScope.itensPedido[i].PrecoOriginal)*parseInt($rootScope.itensPedido[i].Multiplicador))*Quantidade;
            }
        }else{
            if(valorTotalFloat >= parseFloat($rootScope.itensPedido[i].PrecoOriginal)*Quantidade){
                console.log('pso liq.: '+$rootScope.itensPedido[i].PesoLiquido);
                console.log('pso liq.: '+parseFloat(valorTotalFloat/Quantidade));
                var PrecoUN = parseFloat(valorTotalFloat/Quantidade)*parseFloat($rootScope.itensPedido[i].PesoLiquido).toFixed(2);
                console.log(PrecoUN);
                var PrecoTotal = valorTotalFloat/Quantidade;
                $rootScope.itensPedido[i].PrecoTotalItem = PrecoTotal;
                $rootScope.itensPedido[i].PrecoDeVenda = PrecoUN;
                $scope.valorTotal = 0;
                $scope.dadosGerais = [];
                $scope.dados = [];
                $scope.dados2 = [];
                $scope.init();
            }else{
                $rootScope.alerta('', 'O valor deve ser igual ou maior que o valor original');

                $rootScope.itensPedido[i].PrecoTotal  = parseFloat($rootScope.itensPedido[i].PrecoOriginal)*Quantidade;

            }
        }

    }

    $scope.clickSalvarEnviar = function(){
        $scope.salvaPedidoOffline('Aguardando envio'); 
        $timeout(function(){
          $scope.myPopup.close();
        }, 200);
    }

    $scope.clickSalvarRascunho = function(){
        $scope.salvaPedidoOffline('Rascunho'); 
        $timeout(function(){
          $scope.myPopup.close();
        }, 200);
    }

    $scope.clickCancelarPedido = function(){
        $timeout(function(){
          $scope.myPopup.close();
        }, 200);
    }

    $scope.salvarPedido = function(){

        console.log($rootScope.objetoComentario.comentario);

        if($rootScope.cpfClientePedido == undefined){
            $rootScope.alerta('Salvar Pedido', 'Você deve selecionar um cliente.');
        }else if($rootScope.itensPedido.length == 0){
            $rootScope.alerta('Salvar Pedido', 'Selecione ao menos um item.');
        }
        else{

            $scope.myPopup = $ionicPopup.show({
              templateUrl: 'templates/popupsalvarpedido.html',
              title: 'O que você deseja fazer?',
              scope: $scope,
              buttons: []
            });
        } 
        

    }

    $scope.salvaPedidoOffline = function(tipo){

        $ionicLoading.show();


        var arrayItens = [];
        for (var i = 0; i < $rootScope.itensPedido.length; i++){

            if($rootScope.itensPedido[i].Grade != null && $rootScope.itensPedido[i].Grade != 'Não possui grade'){

                var arrayItensGrade = [];
                arrayItensGrade = $rootScope.itensPedido[i].Itens; 
                var enumeradorSimouNao = 1;

                var itens = []; 

                console.log(arrayItensGrade);

                var quantidade = 0;
                for (var j = 0; j < arrayItensGrade.length; j++) { 
                    itens.push({ 
                        IdDoPedido: $scope.idPedido, 
                        CodigoItem: arrayItensGrade[j].Grade, 
                        CodigoGrade: arrayItensGrade[j].CodigoDoItem, 
                        Quantidade: arrayItensGrade[j].Quantidade*$rootScope.itensPedido[i].Multiplicador });
                }

                arrayItens.push({IdDoPedido: $scope.idPedido, CodigoItem: arrayItensGrade[0].Grade, Quantidade: $rootScope.itensPedido[i].Quantidade*$rootScope.itensPedido[i].Multiplicador, PrecoOriginal: parseFloat($rootScope.itensPedido[i].PrecoDecimal), Preco: parseFloat($rootScope.itensPedido[i].PrecoDeVenda), Grade: enumeradorSimouNao, Itens: itens});


            }else{
                var enumeradorSimouNao = 0;
                arrayItens.push({IdDoPedido: $scope.idPedido, CodigoItem: $rootScope.itensPedido[i].CodigoDoItem, Quantidade: $rootScope.itensPedido[i].Quantidade, PrecoOriginal: parseFloat($rootScope.itensPedido[i].PrecoOriginalEnviar), Preco: parseFloat($rootScope.itensPedido[i].PrecoDeVenda), Grade: enumeradorSimouNao, Itens: []});
            }
        }

        var arrayPedido = { 
            IdDoPedido: $scope.idPedido, 
            Usuario: $localStorage.CodigoDeUsuario,
            Cliente: $rootScope.cpfClientePedido,
            IdDoVendedor: $localStorage.IdDoVendedor,
            Comentarios: $rootScope.objetoComentario.comentario,
            Itens: arrayItens
        };

        var arraySalvarPedido = {
            tipo: tipo,
            IdDoPedido: $scope.idPedido, 
            Usuario: $localStorage.CodigoDeUsuario,
            Cliente: $rootScope.cpfClientePedido,
            nomeCliente: $rootScope.nomeClientePedido,
            IdDoVendedor: $localStorage.IdDoVendedor,
            Comentarios: $rootScope.objetoComentario.comentario,
            ItensParaReenvio: arrayItens,
            Itens: $rootScope.itensPedido
        };

        console.log(tipo);

        if($rootScope.arrayPedido != undefined){
            var index = $rootScope.arrayPedido.index;
            console.log($localStorage.pedidosSalvos[index].tipo);
            if($localStorage.pedidosSalvos[index].tipo != 'Rascunho')
            arraySalvarPedido.tipo = $localStorage.pedidosSalvos[index].tipo;
        }   

        console.log(JSON.stringify(arrayPedido));

        console.log(arraySalvarPedido);

        console.log('array pedido (tem que ser undefined): '+$rootScope.arrayPedido);
        
        if(arraySalvarPedido.tipo == 'Aguardando envio'){
            $scope.enviaPedidoBanco(arrayPedido, arraySalvarPedido);
        }else if(arraySalvarPedido.tipo == 'Sincronizado'){
            $rootScope.alerta('Salvar Pedido', 'O pedido já foi sincronizado.');
            $ionicLoading.hide();
            $rootScope.arrayPedido = undefined;
        }else{

            $scope.cliente = 'Não selecionado';
            $rootScope.cpfClientePedido = undefined;
            $rootScope.objetoComentario = {comentario: ""};
            $rootScope.itensPedido = [];

            if($rootScope.arrayPedido == undefined){
                $localStorage.pedidosSalvos.push(arraySalvarPedido);
            }else{
                var index = $rootScope.arrayPedido.index;
                $localStorage.pedidosSalvos[index] = arraySalvarPedido;
            }
            $rootScope.alerta('Salvar Pedido', 'Rascunho salvo com sucesso.');
            $ionicHistory.goBack(-1);
            $ionicLoading.hide();
            $rootScope.arrayPedido = undefined;
        }

    }

    $scope.enviaPedidoBanco = function(array, arraySalvarPedido){

            $timeout(function() {
                $rootScope.login($localStorage.usuario , $localStorage.senha, 1);
            }, 2000);
            

            $scope.cliente = 'Não selecionado';
            $rootScope.cpfClientePedido = undefined;
            $rootScope.objetoComentario = {comentario: ""};
            $rootScope.itensPedido = [];

            var url = $rootScope.url+'pedido/novo';
            $http.post(url, array).then(function(resposta) {

                console.log(resposta);
                $rootScope.alerta('Salvar Pedido', 'Pedido salvo com sucesso.');

                arraySalvarPedido.tipo = 'Sincronizado';
                if($rootScope.arrayPedido == undefined){
                    $localStorage.pedidosSalvos.push(arraySalvarPedido);
                }else{
                    var index = $rootScope.arrayPedido.index;
                    $localStorage.pedidosSalvos[index] = arraySalvarPedido;
                }
                $ionicHistory.goBack(-1);
                $ionicLoading.hide();
                $rootScope.arrayPedido = undefined;

            }, function(err) {
                arraySalvarPedido.tipo = 'Aguardando envio';
                if($rootScope.arrayPedido == undefined){
                    $localStorage.pedidosSalvos.push(arraySalvarPedido);
                }else{
                    var index = $rootScope.arrayPedido.index;
                    $localStorage.pedidosSalvos[index] = arraySalvarPedido;
                }
                $ionicHistory.goBack(-1);

                $rootScope.alerta('Ops', 'Não foi possível enviar os dados, tente sincronizar novamente mais tarde. '); 
                $ionicLoading.hide();
                $rootScope.arrayPedido = undefined;
            });
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