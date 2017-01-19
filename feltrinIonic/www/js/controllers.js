angular.module('starter.controllers', [])

.directive('input', function($rootScope, $timeout){
     return {
         restrict: 'E',
         scope: {
             'returnClose': '=',
             'onReturn': '&'
        },
        link: function(scope, element, attr){
            element.bind('keydown', function(e){
              //console.log(e.which);
                if(e.which == 13){
                        //alert($rootScope.valorBusca.value);
                        if($rootScope.blurTeclado == true){
                            $rootScope.carregaLista($rootScope.valorBusca.value);
                            $rootScope.blurTeclado=false;
                        }
                        if($rootScope.proximoInput == null)
                          element[0].blur();
                        else
                        $rootScope.proximoInput.focus();

                } 
            });   
        }
    }
})


.controller('AppCtrl', function($scope, $ionicModal, $ionicHistory, $timeout, $ionicLoading, $ionicPopup, $rootScope, $state, $location, $http, storage, $localStorage) {


    
  $rootScope.goto = function(pagina){
        //$rootScope.showLoadingPaginas = true;
        //$ionicLoading.show();
        $state.go(pagina);
  } 

  $rootScope.backCarrinho = function(){
        console.log($rootScope.verficaValor);
        console.log('mais de umna categoria: '+$rootScope.maisDeUmaCategoria);

        $rootScope.clickCarrinho = 1;

        if($state.current.name == "app.categorias"){
            $ionicHistory.goBack(-1);
        }else if($state.current.name == "app.produtospedido"){
            if($rootScope.maisDeUmaCategoria != 1)
                $ionicHistory.goBack(-2);
            else
                $ionicHistory.goBack(-3);
        }else if($state.current.name == "app.subprodutospedido"){
            if($rootScope.verficaValor != 1){
                if($rootScope.maisDeUmaCategoria != 1)
                    $ionicHistory.goBack(-2);
                else
                    $ionicHistory.goBack(-3);
            }else{
                $rootScope.alerta('', 'A quantidade deve estar correta.');
            }
                // cancel custom back behaviour
              $scope.$on('$destroy', function() {
                  deregisterHardBack();
                  deregisterSoftBack();
                  customBack();
              });
        }else{
            $state.go('app.novopedido');
        }
  }

    $rootScope.alerta = function(titulo, texto){
        navigator.notification.alert(texto,null,titulo,'OK');
    }

    $rootScope.clickNovoPedido = function(){
        if($rootScope.arrayPedido != undefined){
            $rootScope.arrayPedido = undefined;
            $rootScope.itensPedido = [];
            $rootScope.cpfClientePedido = undefined;
            $rootScope.nomeClientePedido = undefined;
        }
        $rootScope.goto('app.novopedido');
    }

    $rootScope.menuBuscaClientes = function(){
        $rootScope.buscaClientesPedido = 0;
        $rootScope.goto('app.buscaclientes');
    }

    $rootScope.clickAdicionarNovo = function(){
        $rootScope.buscaClientes();
    }

    $rootScope.clickBtSalvarCliente = function(){
        $rootScope.clickSalvar($rootScope.cadastro);
    }


    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $rootScope.listaProdutos = [];
    $rootScope.showLoading = false;
    //$rootScope.showLoadingPaginas = true;
    $rootScope.valorProgress = 0;
    $rootScope.url = 'http://api.sementesfeltrin.com.br/';
    //$scope.valorSoma = 0;
    $rootScope.labelCarregando = "Carregando dados, aguarde...";

    $rootScope.showOpcoes = 1;

    console.log($rootScope.url);

    console.log($localStorage.pedidosSalvos);

    if($localStorage.pedidosSalvos == undefined)
            $localStorage.pedidosSalvos = [];

    if($localStorage.clientesTemp == undefined)
            $localStorage.clientesTemp = [];



    $rootScope.alertaPersonalizado = function(titulo){    
        var myPopup = $ionicPopup.show({
          title: titulo,
          hardwareBackButtonClose: false,
          backdropClickToClose: false,
          scope: $scope,
          buttons: [
            
            {
              text: 'OK',
              type: 'button-positive',
              onTap: function(e) {
                $timeout(function(){
                  myPopup.close();
                }, 200);
              }
            }
          ]
        });
    } 

    $rootScope.apiTesteOuProducao = 0; //0 == producao, 1 == teste
    $rootScope.contadorApi = 0; //contador, ao clicar 10 vezes no botao ativaa mudança de API
    $rootScope.clickAlteraApi = function(){
        $rootScope.contadorApi++;
        if($rootScope.contadorApi == 10){
            if($rootScope.apiTesteOuProducao == 0){
                $rootScope.contadorApi = 0;
                $rootScope.apiTesteOuProducao = 1;
                $rootScope.url = 'http://apiteste.sementesfeltrin.com.br/';
               
                $rootScope.alertaPersonalizado('Api alterada para desenvolvimento!');
                
            }else{
                $rootScope.contadorApi = 0;
                $rootScope.apiTesteOuProducao = 0;
                $rootScope.url = 'http://api.sementesfeltrin.com.br/';
                $rootScope.alertaPersonalizado('Api alterada para produção!');
                
            }
        }
        
    }

    
    document.addEventListener('deviceready',function(){

        $rootScope.larguraTela = window.screen.width+30;
        //alert($rootScope.larguraTela);

        $scope.verificaDadosDesatualizados();

        $scope.clickLogar = function(dadosLogin){
            console.log(dadosLogin);
            if($scope.logout == 1){
                var retornoLogin = $rootScope.login(dadosLogin.usuario, dadosLogin.senha, 2);
                $scope.logout = 0;
            }else{
                var retornoLogin = $rootScope.login(dadosLogin.usuario, dadosLogin.senha, 4);
            }
            
        }



        // CRIA O ARRAY PARA O LOGIN
      $scope.loginData = {};
      console.log($localStorage.logado);
        
      // ABRE O MODAL DE LOGIN
      $scope.showModalLogin = function() {
        // CRIA O MODAL CHAMANDO O TEMPLATE
        if($rootScope.larguraTela >= 830){
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope,
                animation:'none',
                hardwareBackButtonClose: false,
                backdropClickToClose: false,
              }).then(function(modal) {
                $scope.modal = modal;
              });
            $timeout(function() {
                $scope.modal.show();
            }, 50);
            
        }else{
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope,
                hardwareBackButtonClose: false,
                backdropClickToClose: false,
              }).then(function(modal) {
                $scope.modal = modal;
              });
            $timeout(function() {
                $scope.modal.show();
            }, 50);   
        }
            
      };

      // ESCONDE O MODAL DE LOGIN
      $scope.closeModalLogin = function() {
        $scope.modal.hide();
      };
      console.log($localStorage.logado);


        document.addEventListener('backbutton', function (event) {
            if($state.current.name != 'app.subprodutospedido'){
                console.log($state.current.name);
                if($state.current.name == 'app.buscaclientes'){
                    $rootScope.showOpcoes = 1;
                }else if($state.current.name == 'app.cadastroclientes'){
                    $rootScope.showOpcoes = 2;
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }, false);

        var doCustomBack = function() {
            if($state.current.name != 'app.subprodutospedido'){
                 console.log($state.current.name);
                if($state.current.name == 'app.buscaclientes'){
                    $rootScope.showOpcoes = 1;
                    $ionicHistory.goBack();
                }else if($state.current.name == 'app.cadastroclientes'){
                    $rootScope.showOpcoes = 2;
                    $ionicHistory.goBack();
                }else if($state.current.name == 'app.home'){
                    navigator.app.exitApp();
                }else{
                    $ionicHistory.goBack();
                }
            }
        };

        // override soft back
        var oldSoftBack = $rootScope.$ionicGoBack;
        $rootScope.$ionicGoBack = function() {
            if($state.current.name != 'app.subprodutospedido')
            doCustomBack();
        };
        var deregisterSoftBack = function() {
            if($state.current.name != 'app.subprodutospedido')
            $rootScope.$ionicGoBack = oldSoftBack;
        };


        $scope.deslogar = function(){

            $scope.verificarPedidosNoLogout(2);

            //navigator.app.exitApp();
        }

        $rootScope.enviaDadosTemp = function(index){

            console.log('entrou na funcao: '+index);
            console.log('tamanho array temp: '+$localStorage.clientesTemp.length);

            if(index < $localStorage.clientesTemp.length){
                var url = $rootScope.url+'cliente/Novo';
                $http.post(url, $localStorage.clientesTemp[index]).then(function(resposta){
                    console.log(resposta);
                    if(resposta.statusText == "OK"){
                        $ionicHistory.goBack();

                        if($localStorage.clientesTemp.length == 1){
                            $scope.enviaPedidoNaoEnviados();
                            $localStorage.clientesTemp = [];
                        }
                        else
                            var removed = $localStorage.clientesTemp.splice(index+1, 1);

                        index++;

                        if($localStorage.clientesTemp.length > 0){
                            $rootScope.enviaDadosTemp(index);
                        }

                    }
                }, function(err) { $rootScope.showLoadingPaginas = false; $rootScope.alerta('Cliente', 'Falha na comunicação com o servidor.');});
            }else{
                $scope.enviaPedidoNaoEnviados();
            }
            
        }

        $scope.clickSimples = function(){
            if(navigator.connection.type == Connection.NONE) {
                navigator.notification.alert('Sua internet não está ativa, você não pode sincronizar os dados!',null,'Enviar Dados','OK');
            }else{

                $rootScope.showLoadingPaginas = true;
                $rootScope.login($localStorage.usuario, $localStorage.senha, 2);
            }
            $timeout(function(){
              $scope.myPopup.close();
            }, 200);
        }

        $scope.clickCompleta = function(){
            if(navigator.connection.type == Connection.NONE) {
                navigator.notification.alert('Sua internet não está ativa, você não pode sincronizar os dados!',null,'Enviar Dados','OK');
            }else{

                $localStorage.produtos = [];
                $localStorage.linhas = [];
                $localStorage.categorias = [];
                $localStorage.subcategorias = [];
                $localStorage.clientes = [];
                $localStorage.produtosPedido = [];
                $localStorage.linhasPedido = [];
                $localStorage.categoriasPedido = [];
                $localStorage.SubLinhas = [];
                $localStorage.tamanhoProdutos = 0;

                $rootScope.showLoading = true;
                $rootScope.login($localStorage.usuario, $localStorage.senha, 4);
            }
            $timeout(function(){
              $scope.myPopup.close();
            }, 200);
        }

        $scope.clickCancelarSincronizacao = function(){
            $timeout(function(){
              $scope.myPopup.close();
            }, 200);
        }

        $scope.sincronizarDados = function(){
            $scope.myPopup = $ionicPopup.show({
              templateUrl: 'templates/popup.html',
              title: 'O que você deseja sincronizar?',
              //subTitle: 'Please use normal things',
              scope: $scope,
              buttons: [
              ]
            });

        }

        $rootScope.login = function(idVendedor, senha, simples){
            var url = $rootScope.url+'?usuario='+idVendedor+'&senha='+senha;
            $http.get(url).then(function(resposta) {

                console.log("resposta login: "+resposta);
                //$scope.getDadosPedido();
                if(resposta.data.Id == undefined){
                $rootScope.alerta('Login', resposta.data);
                }else{
                    var usuario = "";
                    if(resposta.data.LDAP != "" && resposta.data.LDAP != null)
                        usuario = resposta.data.LDAP;
                    else
                        usuario = resposta.data.CodigoDeUsuario;

                    console.log('usuario par asalvar: '+usuario);

                    if(simples == 1){
                        $localStorage.logado = 1;
                        $localStorage.nomeVendedor = resposta.data.Nome;
                        $rootScope.nomeVendedor = resposta.data.Nome;
                        $localStorage.CodigoDeUsuario = resposta.data.CodigoDeUsuario;
                        $localStorage.IdDoVendedor = resposta.data.IdDoVendedor;
                        $localStorage.usuario = usuario;
                        $localStorage.senha = senha;
                    }else if(simples==2){
                        $localStorage.logado = 1;
                        $localStorage.nomeVendedor = resposta.data.Nome;
                        $rootScope.nomeVendedor = resposta.data.Nome;
                        $localStorage.CodigoDeUsuario = resposta.data.CodigoDeUsuario;
                        $localStorage.IdDoVendedor = resposta.data.IdDoVendedor;
                        $localStorage.usuario = usuario;
                        $localStorage.senha = senha;
                        $rootScope.enviaDadosTemp(0);
                    }else if(simples==3){
                        $localStorage.logado = 1;
                        $localStorage.nomeVendedor = resposta.data.Nome;
                        $localStorage.CodigoDeUsuario = resposta.data.CodigoDeUsuario;
                        $localStorage.IdDoVendedor = resposta.data.IdDoVendedor;
                        $localStorage.ComissaoVariavel = resposta.data.Vendedor.ComissaoVariavel;
                        $rootScope.nomeVendedor = resposta.data.Nome;
                        $localStorage.usuario = usuario;
                        $localStorage.senha = senha;
                        $rootScope.carregaDados(simples);
                    }else{
                        $localStorage.logado = 1;
                        $localStorage.nomeVendedor = resposta.data.Nome;
                        $localStorage.CodigoDeUsuario = resposta.data.CodigoDeUsuario;
                        $localStorage.IdDoVendedor = resposta.data.IdDoVendedor;
                        $localStorage.ComissaoVariavel = resposta.data.Vendedor.ComissaoVariavel;
                        $rootScope.nomeVendedor = resposta.data.Nome;
                        $localStorage.usuario = usuario;
                        $localStorage.senha = senha;

                        $rootScope.carregaDados(simples);
                    }
                

                    console.log('tamanho array temp: '+$localStorage.clientesTemp.length);

                    $scope.closeModalLogin();

                }

            }, function(err) {  if(simples != 1)$scope.tentarNovamenteConectar(simples);/*$rootScope.alerta('Erro', 'Não foi possível logar, verifique sua internet.');*/ });
        }

        $rootScope.carregaDados = function(simples){
            if($localStorage.produtos == null || $localStorage.produtos == undefined|| $localStorage.produtos.length == 0 || $localStorage.tamanhoProdutos == undefined ||$localStorage.tamanhoProdutos < $localStorage.produtos.length){
                navigator.splashscreen.hide();
                $rootScope.showLoading = true;
                if($localStorage.produtos == undefined){
                    $localStorage.produtos = [];
                    $localStorage.linhas = [];
                    $localStorage.categorias = [];
                    $localStorage.subcategorias = [];
                    $localStorage.clientes = [];
                    $localStorage.produtosPedido = [];
                    $localStorage.linhasPedido = [];
                    $localStorage.categoriasPedido = [];
                    $localStorage.SubLinhas = [];
                    $localStorage.tamanhoProdutos = 0;
                }
                else{
                    $localStorage.produtos = [];
                    $localStorage.linhas = [];
                    $localStorage.categorias = [];
                    $localStorage.subcategorias = [];
                    $localStorage.clientes = [];
                    $localStorage.produtosPedido = [];
                    $localStorage.linhasPedido = [];
                    $localStorage.categoriasPedido = [];
                    $localStorage.SubLinhas = [];
                }

                console.log($localStorage.tamanhoProdutos);

                var url = $rootScope.url+'catalogo/obter?Id=0';
                $http.get(url).then(function(resposta) {
                    console.log(resposta);

                    if(simples == 2){
                        $rootScope.getClientes(simples);
                        $scope.getDadosPedido(simples);
                    }else{
                        $localStorage.produtos = [];
                        $localStorage.linhas = [];
                        $localStorage.categorias = [];
                        $localStorage.subcategorias = [];

                        $rootScope.getClientes(simples);
                        $scope.getDadosPedido(simples);

                        $timeout(function() {
                            storage.add(resposta);
                        }, 3000);
                        
                        $timeout(function() {
                            storage.addlinhas($localStorage.produtos, $localStorage.linhas, 'IdDaLinha', 'Linha');
                        }, 3000);

                        $timeout(function() {
                            storage.addcategorias($localStorage.produtos, $localStorage.categorias, 'IdDaCategoria', 'Categoria', 'IdDaLinha', 'Linha');
                        }, 300);

                        
                    }


                }, function(err) { $scope.tentarNovamenteConectar();/*$rootScope.alerta('Erro', 'Não foi possível carregar os dados, verifique sua internet.');*/ });
            }else{

                //$rootScope.showLoadingPaginas = true;
                if($rootScope.arrayGeralClientes == undefined){
                  $rootScope.arrayGeralClientes = [];
                  for (var i=0; i < $localStorage.clientes.length; i++) {
                    console.log($localStorage.clientes[i]);
                    $rootScope.arrayGeralClientes.push({id:$localStorage.clientes[i]['id'], cpf:$localStorage.clientes[i]['CpfCnpj'], nome:$localStorage.clientes[i]['Nome']});
                    //$scope.$apply();
                    if(i == $localStorage.clientes.length-1)
                            $rootScope.showLoadingPaginas = false;
                            navigator.splashscreen.hide();
                            $rootScope.showLoading = false;
                  };
                  $rootScope.showLoadingPaginas = false;
                }else{
                  navigator.splashscreen.hide();
                  $rootScope.showLoadingPaginas = false;
                }
                //$scope.$apply();

            }
        };

        if($localStorage.logado != 1 || $localStorage.usuario == null || $localStorage.usuario==undefined){
            $scope.showModalLogin();
            navigator.splashscreen.hide();
            $scope.dadosLogin = {usuario: "", senha: ""};
          }else{
            navigator.splashscreen.hide();
            //$rootScope.showLoadingPaginas = true;
            $rootScope.idVendedor = $localStorage.usuario;
            $rootScope.senha = $localStorage.senha;
            $rootScope.nomeVendedor = $localStorage.nomeVendedor;    
                    
            if($localStorage.produtos == null || $localStorage.produtos == undefined || $localStorage.produtos.length == 0 || $localStorage.tamanhoProdutos == undefined ||$localStorage.tamanhoProdutos < $localStorage.produtos.length){        
                $rootScope.login($localStorage.usuario, $localStorage.senha, 3);
                alert('algo está zerado>   produto:'+$localStorage.produtos+'  produtos length '+$localStorage.produtos.length+' tamanho produtos  '+$localStorage.tamanhoProdutos);
            }
            else{

                //alert($localStorage.clientes[0]['Nome']);

                
                  $rootScope.arrayGeralClientes = [];
                  for (var i=0; i < $localStorage.clientes.length; i++) {
                    console.log($localStorage.clientes[i]);
                    $rootScope.arrayGeralClientes.push({id:$localStorage.clientes[i]['id'], cpf:$localStorage.clientes[i]['CpfCnpj'], nome:$localStorage.clientes[i]['Nome']});
                    //$scope.$apply();
                    if(i == $localStorage.clientes.length-1)
                            $rootScope.showLoadingPaginas = false;
                            navigator.splashscreen.hide();
                            $rootScope.showLoading = false;
                  };
                  $rootScope.showLoadingPaginas = false;
                
            }
          }

    },false);

    $scope.verificaDadosDesatualizados = function(){
        var verificaPedidosEnviados = $scope.verificaPedidosEnviados();
        if(verificaPedidosEnviados > 0 || $localStorage.clientesTemp.length > 0)
            $rootScope.alerta('', 'Dados desatualizados. Clique no menu Sincronizar para atualizar os dados.');
    }

    $scope.verificaPedidosEnviados = function(){

        var contador = 0;
        for (var i = 0; i < $localStorage.pedidosSalvos.length; i++) {
            if($localStorage.pedidosSalvos[i].tipo == 'Aguardando envio')
                contador++;
        }
        return contador;

    }

    $scope.tentarNovamenteConectar = function(simples){
        var myPopup = $ionicPopup.show({
          //template: '<input type="password" ng-model="data.wifi">',
          title: 'Você está sem internet. Deseja tentar conectar-se novamente?',
          //subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            
            {
              text: 'Sim',
              type: 'button-positive',
              onTap: function(e) {
                $timeout(function(){
                 $rootScope.login($localStorage.usuario, $localStorage.senha, simples);
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

        myPopup.then(function(res) {
          //alert('Tapped!'+res);
        });

    }

    $scope.getDadosPedido = function(){

        var url = $rootScope.url+'listadepreco/obterporvendedor?id='+$localStorage.IdDoVendedor;
        //var url = $rootScope.url+'listadepreco/obter?Id=0';
        $http.get(url).then(function(resposta) {
            $localStorage.produtosPedido = [];
            console.log("resposta dados pedido: "+resposta.data);
            $localStorage.produtosPedido = resposta.data;

            storage.addlinhaspedido($localStorage.produtosPedido, $localStorage.linhasPedido, 'Id', 'Descricao');
            storage.addcategoriaspedido($localStorage.produtosPedido, $localStorage.categoriasPedido, 'CodigoDoGrupo', 'DescricaoDoGrupo', 'Id', 'Descricao');
            //storage.addclientes(resposta);

        }, function(err) {$scope.tentarNovamenteConectar(); /*$rootScope.alerta('Erro', 'Não foi possível carregar os dados, verifique sua internet.');*/ });
    }


    $rootScope.getClientes = function(simples){
        var url = $rootScope.url+'cliente/obterporvendedor?Id='+$localStorage.IdDoVendedor;
        $http.get(url).then(function(resposta) {

            $localStorage.clientes = [];
            $localStorage.clientesGeral = [];

            $rootScope.getClientesGeral();

            storage.addclientes(resposta);

            if(simples==2){
                console.log('simples: '+simples);
                $ionicLoading.hide();
                $rootScope.showLoadingPaginas = false;
                $rootScope.showLoading = false;
                $rootScope.alerta('', 'Dados sincronizados com sucesso!');
            }

        }, function(err) { $scope.tentarNovamenteConectar();/*$rootScope.alerta('Erro', 'Não foi possível carregar os dados, verifique sua internet.');*/ });
    }

    $rootScope.getClientesGeral = function(){
        var url = $rootScope.url+'cliente/obterchavesporvendedor?Id='+$localStorage.IdDoVendedor;
        $http.get(url).then(function(resposta) {

            $localStorage.clientesGeral = [];
            $localStorage.clientesGeral = resposta.data;

        }, function(err) { $scope.tentarNovamenteConectar();/*$rootScope.alerta('Erro', 'Não foi possível carregar os dados, verifique sua internet.');*/ });
    }


    $rootScope.getImagens = function(index, id, tamanho, imagem){
            var uri = encodeURI(imagem);   
            var filePath = cordova.file.dataDirectory+id+".jpg";
            console.log("imagem: "+uri+"  id: "+id+"   tamanho: "+tamanho+"  index: "+index);
            console.log("local storage: "+$localStorage.produtos[index].id);

            //$scope.valorSoma = (100/tamanho)/3;

            
            //alert($localStorage.tamanhoProdutos);
            $timeout(function() {
                salvaImagem(uri, filePath, id, tamanho, index);
            }, 100);
              
            
            
    }


//SALVA FOTO NO STORAGE DO CELULAR -------------------------------------------------------------------------------------------------------------------------------------------------------
    function salvaImagem(uri, filePath, id, tamanho, index) {

        $localStorage.tamanhoProdutos++;
        var fileTransfer = new FileTransfer();

        fileTransfer.download(
            uri,
            filePath,
            function(entry) {
                //$localStorage.tamanhoProdutos++;
                //console.log("download complete: " + entry.nativeURL);
                $localStorage.produtos[index].Foto = entry.nativeURL;
                $rootScope.valorProgress= $rootScope.valorProgress+0.190;
                //console.log("valor progresso: "+$rootScope.valorProgress+"valor soma: "+$scope.valorSoma);
                $scope.$apply();
                
                tamanho--;
                if(tamanho > 0)
                $rootScope.getImagens(index+1, $localStorage.produtos[index+1].id, tamanho, $localStorage.produtos[index+1].Foto);
                else{
                    $rootScope.showLoading = false;
                    $scope.$apply();
                } 

            },
            function(error) {
                if(navigator.connection.type == Connection.NONE){
                    $scope.tentarNovamenteConectar();
                    //$rootScope.alerta('Erro', 'Não foi possível carregar os dados, verifique sua internet.');
                }else{  
                    //$localStorage.tamanhoProdutos++;
                    console.log("download error source/target/code " + error.source+" / "+error.target+" / "+error.code); 
                    $localStorage.produtos[index].Foto = null;
                    $rootScope.valorProgress= $rootScope.valorProgress+0.190;
                    console.log("valor progresso: "+$rootScope.valorProgress+"valor soma: "+$scope.valorSoma);
                    $scope.$apply();
                    
                    tamanho--;
                    if(tamanho > 0)
                    $rootScope.getImagens(index+1, $localStorage.produtos[index+1].id, tamanho, $localStorage.produtos[index+1].Foto);
                    else{
                        $rootScope.showLoading = false;
                        $scope.$apply();
                    }
                }
            }  
        );

    }
//FIM FUNCOES SALVA NO STORAGE----------------------------------------------------------------------------------------------------------------------------------------------------------------------------



    $scope.enviaPedidoNaoEnviados = function(){
        $scope.pedidosParaEnviar = [];
        /*var j=0;
        for (var i = 0; i < $localStorage.pedidosSalvos.length+1; i++) {
            console.log('tipo pedido: '+$localStorage.pedidosSalvos[i].tipo );
            if($localStorage.pedidosSalvos[i].tipo == 'Aguardando envio'){
                $scope.pedidosParaEnviar.push($localStorage.pedidosSalvos[i]);
                $scope.pedidosParaEnviar[j].index = i;
                j++;
                console.log('IGUAL');
            }

            if(i == $localStorage.pedidosSalvos.length-1){
                console.log($scope.pedidosParaEnviar);
                $scope.enviarPedido(0);
            }

        }*/
        console.log('tamamnho totaol: '+$localStorage.pedidosSalvos.length);
        $scope.enviarPedido(0);


    }

    $scope.enviarPedido = function(index){
        console.log(index);

        if($localStorage.pedidosSalvos.length > index){
            if($localStorage.pedidosSalvos[index].tipo == 'Aguardando envio' && index < $localStorage.pedidosSalvos.length){

                console.log('index Aguardando: '+index);

                if(index < $localStorage.pedidosSalvos.length){

                    var arrayPedido = { 
                        IdDoPedido:  $localStorage.pedidosSalvos[index].IdDoPedido, 
                        Usuario: $localStorage.CodigoDeUsuario,
                        Cliente: $localStorage.pedidosSalvos[index].Cliente,
                        IdDoVendedor: $localStorage.IdDoVendedor,
                        Comentarios: $localStorage.pedidosSalvos[index].Comentarios,
                        Itens: $localStorage.pedidosSalvos[index].ItensParaReenvio
                    };

                    var url = $rootScope.url+'pedido/novo';
                    $http.post(url, arrayPedido).then(function(resposta) {

                        console.log(resposta);

                        //var indexLista = $scope.pedidosParaEnviar[index].index;
                        $localStorage.pedidosSalvos[index].tipo = 'Sincronizado';

                        console.log($scope.pedidosParaEnviar);

                        //var removed = $scope.pedidosParaEnviar.splice(index+1, 1);

                        console.log($scope.pedidosParaEnviar);


                        if(index == $localStorage.pedidosSalvos.length-1){
                            $rootScope.arrayGeralClientes = [];
                            $localStorage.clientes = [];
                            $localStorage.clientesGeral = [];
                            $localStorage.produtosPedido = [];
                            $localStorage.linhasPedido = [];
                            $localStorage.categoriasPedido = [];
                            $localStorage.SubLinhas = [];
                            $rootScope.showLoadingPaginas = true;
                            if ($scope.logout != 1) {
                                $rootScope.getClientes(2);
                                $scope.getDadosPedido(2);
                            }

                            $scope.pedidosParaEnviar = [];
                        }
                        else{
                            index++;
                            $scope.enviarPedido(index);

                        }

                    }, function(err) {$rootScope.showLoadingPaginas = false;  $rootScope.alerta('Dados', 'Falha na comunicação com o servidor.');});
                }else{
                    $rootScope.arrayGeralClientes = [];
                    $localStorage.clientes = [];
                    $localStorage.clientesGeral = [];
                    $localStorage.produtosPedido = [];
                    $localStorage.linhasPedido = [];
                    $localStorage.categoriasPedido = [];
                    $localStorage.SubLinhas = [];
                    $rootScope.showLoadingPaginas = true;
                    if ($scope.logout != 1) {
                        $rootScope.getClientes(2);
                        $scope.getDadosPedido(2);
                    }
                }
            }else{
                if(index < $localStorage.pedidosSalvos.length-1){
                    index++;
                    $scope.enviarPedido(index);
                }else{
                    $rootScope.arrayGeralClientes = [];
                    $localStorage.clientes = [];
                    $localStorage.clientesGeral = [];
                    $localStorage.produtosPedido = [];
                    $localStorage.linhasPedido = [];
                    $localStorage.categoriasPedido = [];
                    $localStorage.SubLinhas = [];
                    $rootScope.showLoadingPaginas = true;
                    if ($scope.logout != 1) {
                        $rootScope.getClientes(2);
                        $scope.getDadosPedido(2);
                    }
                }
            }
        }else{
            $rootScope.arrayGeralClientes = [];
            $localStorage.clientes = [];
            $localStorage.clientesGeral = [];
            $localStorage.produtosPedido = [];
            $localStorage.linhasPedido = [];
            $localStorage.categoriasPedido = [];
            $localStorage.SubLinhas = [];
            $rootScope.showLoadingPaginas = true;
            if ($scope.logout != 1) {
                $rootScope.getClientes(2);
                $scope.getDadosPedido(2);
            }
        }
    }


    $scope.verificarPedidosNoLogout = function(simples){
        var myPopup = $ionicPopup.show({
          //template: '<input type="password" ng-model="data.wifi">',
          title: 'Seus dados serão perdidos. Deseja sincronizar e sair?',
          //subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            
            {
              text: 'Sim',
              type: 'button-positive',
              onTap: function(e) {
                if(navigator.connection.type == Connection.NONE) {
                    navigator.notification.alert('Sua internet não está ativa, você não pode sincronizar os dados!',null,'Enviar Dados','OK');
                    $timeout(function(){
                      myPopup.close();
                    }, 500);
                }else{
                    $rootScope.showLoadingPaginas = true;
                    $rootScope.login($localStorage.usuario, $localStorage.senha, simples);
                    $scope.logout = 1;
                    $timeout(function(){
                      $localStorage.logado = undefined;
                      /*$localStorage.usuario = "";
                      $localStorage.senha = "";
                      $localStorage.nomeVendedor = '';
                      $rootScope.nomeVendedor = '';*/
                      $rootScope.arrayGeralClientes = [];
                      $localStorage.clientes = [];
                      $localStorage.clientesGeral = [];
                      $localStorage.produtosPedido = [];
                      $localStorage.pedidosSalvos = [];
                      $localStorage.linhasPedido = [];
                      $localStorage.categoriasPedido = [];
                      $localStorage.SubLinhas = [];
                      $rootScope.showLoadingPaginas = false;
                      if($rootScope.itensPedido != undefined)
                        $rootScope.itensPedido = [];
                      //$rootScope.getClientes(2);
                      //$scope.getDadosPedido(2);

                      $scope.showModalLogin();

                      myPopup.close();
                    }, 5000);
                }
              }
            },
            {
              text: 'Não',
              type: 'button-calm',
              onTap: function(e) {
                    
              }
            }
          ]
        });

        myPopup.then(function(res) {
          //alert('Tapped!'+res);
        });

    }




})

.controller('homeCtrl', function($scope,$rootScope,$location,$http, storage, $localStorage) {

    
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
