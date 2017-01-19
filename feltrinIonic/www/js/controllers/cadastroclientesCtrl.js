angular.module('starter.cadastroclientes', [])

.controller('cadastroclientesCtrl', function($scope, $rootScope, $localStorage, $ionicHistory, $http, $timeout, $ionicLoading) {

    $rootScope.bottomMenu = false;
    $rootScope.logoLogin = false;
    $rootScope.showEnderecoEntrega = false;
    $rootScope.showOpcoes = 3;
    $scope.items = [];
    $scope.checkboxEndereco = {checked:false};

    $scope.showSalvar = false;
    $rootScope.cadastro = {inputNome: "", inputSobrenome: "",inputTipoPessoa: "2",inputCPF: "",inputRG: "",inputIE: "",inputDataNascimento: "",inputTelFixo: "",inputTelMovel: "",inputEmail: "",inputTipoEndereco: "C",inputRua: "",inputNumero: "",inputBairro: "",inputComplemento: "",inputUF: "",inputCidade: "",inputCEP: "", inputTipoEndereco2: "E",inputRua2: "",inputNumero2: "",inputBairro2: "",inputComplemento2: "",inputUF2: "",inputCidade2: "",inputCEP2: ""};

    $ionicLoading.hide();

    $scope.changeEndereco = function(){
        console.log($scope.checkboxEndereco.checked);
        if($scope.checkboxEndereco.checked == true){
            $rootScope.showEnderecoEntrega = true;
        }else{
            $rootScope.showEnderecoEntrega = false;
        }

    }

    $rootScope.clickSalvar = function(cadastro){
    	console.log(cadastro);

        //console.log(cadastro.inputCPF.toString().length);

        if(cadastro.inputNome == "") $rootScope.alerta('Cadastro Cliente', 'Digite o Nome/Razão Social');
        else if(cadastro.inputTipoPessoa == "") $rootScope.alerta('Cadastro Cliente', 'Selecione o Tipo de Pessoa (Física ou Jurídica)');
        else if((cadastro.inputDataNascimento == "" || cadastro.inputDataNascimento == null) && cadastro.inputTipoPessoa == 1) $rootScope.alerta('Cadastro Cliente', 'Selecione a data de nascimento');
        else if(cadastro.inputCPF.toString().length>11 && cadastro.inputTipoPessoa == "1") $rootScope.alerta('Cadastro Cliente', 'O tipo deve ser Pessoa Jurídica.');
        else if(cadastro.inputCPF.toString().length<=11 && cadastro.inputTipoPessoa == "2") $rootScope.alerta('Cadastro Cliente', 'O tipo deve ser Pessoa Física.');
        else if(cadastro.inputCPF == "" || cadastro.inputCPF == undefined) $rootScope.alerta('Cadastro Cliente', 'Digite o CPF ou CNPJ corretamente.');
        else if(cadastro.inputEmail == "") $rootScope.alerta('Cadastro Cliente', 'Digite seu e-mail');
        else if(cadastro.inputRua == "" || cadastro.inputBairro == "" || cadastro.inputUF == "" || cadastro.inputCEP=="") $rootScope.alerta('Cadastro Cliente', 'Digite os dados do endereço de Cobrança/Entrega');
        else if($scope.checkboxEndereco.checked && (cadastro.inputRua2 == "" || cadastro.inputBairro2 == "" || cadastro.inputUF2 == "" || cadastro.inputCEP2 =="")){
                $rootScope.alerta('Cadastro Cliente', 'Digite os dados do endereço de Cobrança/Entrega');

        } 
        else if(cadastro.inputEmail == "") $rootScope.alerta('Cadastro Cliente', 'Digite seu e-mail');
        else{

            $ionicLoading.show();

            function getMeusClientes(obj) {
                return obj.CpfCnpj == cadastro.inputCPF;
            }
            var filterMeusClientes = $localStorage.clientes.filter(getMeusClientes);
            console.log(filterMeusClientes);

            //10193839000147

            function getCliente(obj) {
                return obj == cadastro.inputCPF;
            }
            var filterOutros = $localStorage.clientesGeral.filter(getCliente);
            console.log(filterOutros);

            if(filterMeusClientes != null && filterMeusClientes != undefined && filterMeusClientes != ""){
                $rootScope.alerta('Cadastro Cliente', 'Cliente já cadastrado na sua carteira.');
                $ionicLoading.hide();
            }else if(filterOutros != null && filterOutros != undefined && filterOutros != ""){
                $rootScope.alerta('Cadastro Cliente', 'Cliente cadastrado em outra carteira.');
                $ionicLoading.hide();
            }else{

                var arrayEnderecos = [];
                arrayEnderecos.push({ Tipo: cadastro.inputTipoEndereco,Endereco: cadastro.inputRua,Nro: cadastro.inputNumero, Complemento: cadastro.inputComplemento, Bairro: cadastro.inputBairro, Estado: cadastro.inputUF,Cidade: cadastro.inputCidade,CEP: cadastro.inputCEP});

                console.log('vai tentar adicionar endereco 2');
                if($scope.checkboxEndereco.checked){
                    console.log('vai adicionar endereco 2');
                    arrayEnderecos.push({ Tipo: cadastro.inputTipoEndereco2,Endereco: cadastro.inputRua2,Nro: cadastro.inputNumero2, Complemento: cadastro.inputComplemento2, Bairro: cadastro.inputBairro2,Estado: cadastro.inputUF2,Cidade: cadastro.inputCidade2,CEP: cadastro.inputCEP2})
                }


                var d = new Date(cadastro.inputDataNascimento);
                var month = '' + (d.getMonth() + 1);
                var day = '' + d.getDate();
                var year = d.getFullYear();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                var DataNasc = year+'-'+month+'-'+day+'T00:00:00';


                var dados = {Nome: cadastro.inputNome, 
                            IdDoVendedor: $localStorage.IdDoVendedor,
                            Sobrenome: cadastro.inputSobrenome,
                            Contato: cadastro.inputNome, 
                            Tipo: cadastro.inputTipoPessoa,
                            CpfCnpj: cadastro.inputCPF, 
                            RG: cadastro.inputRG,
                            IE: cadastro.inputIE,
                            DataNasc: DataNasc,
                            TelefoneFixo: cadastro.inputTelFixo,
                            TelefoneMovel: cadastro.inputTelMovel,
                            Email: cadastro.inputEmail,
                            Endereco: arrayEnderecos
                }

                /*if(filterMeusClientes.length > 0){
                    filterMeusClientes = { Tipo: cadastro.inputTipoEndereco,Endereco: cadastro.inputRua,Nro: cadastro.inputNumero, Bairro: cadastro.inputBairro,UF: cadastro.inputUF,Cidade: cadastro.inputCidade,CEP: cadastro.inputCEP};
                }else{*/
                    $localStorage.clientes.push({id: dados.CpfCnpj, IdDoVendedor: $localStorage.usuario, VendedorPai: "", Email: dados.Email, TelefoneMovel: dados.TelefoneMovel, TelefoneFixo: dados.TelefoneFixo, Nome: dados.Nome, Sobrenome: dados.Sobrenome, Fantasia: "", Tipo: dados.Tipo, CpfCnpj: dados.CpfCnpj, RG: dados.RG, IE: dados.IE, DataNasc: dados.DataNasc, Endereco: dados.Endereco});
                    $scope.arrayGeralClientes.push({id:dados.CpfCnpj, cpf:dados.CpfCnpj, nome:dados.Nome});
                //}

                console.log(dados);

                var url = $rootScope.url+'cliente/Novo';
                $http.post(url, dados).then(function(resposta){
                    console.log(resposta);
                    if(resposta.statusText == "OK"){
                        $rootScope.alerta('Cadastro Cliente', 'Cliente cadastrado com sucesso!');
                        $ionicHistory.goBack();
                        $rootScope.showOpcoes = 2;
                    }
                    $ionicLoading.hide();
                }, function(err) { $ionicLoading.hide(); $localStorage.clientesTemp.push(dados); $ionicHistory.goBack();  $rootScope.alerta('Cadastro Cliente', 'Você está sem internet, mas seu cliente será salvo mesmo assim.');});


            }


            
        }

    }


    $scope.carregaDadosCliente = function(){

        function getCliente(obj) {
            return obj.id == $rootScope.idCliente;
        }
        var filter = $localStorage.clientes.filter(getCliente);

        console.log(filter);

    	$rootScope.cadastro = {inputNome: filter[0].Nome, inputSobrenome: filter[0].Sobrenome,inputTipoPessoa: filter[0].Tipo.toString(),inputCPF: filter[0].CpfCnpj.toString(), inputRG: filter[0].RG,inputIE: filter[0].IE,inputDataNascimento: new Date(filter[0].DataNasc),inputTelFixo: filter[0].TelefoneFixo, inputTelMovel: filter[0].TelefoneMovel, inputEmail:  filter[0].Email, inputTipoEndereco: filter[0].Endereco[0].Tipo.toString(), inputRua:  filter[0].Endereco[0].Endereco, inputNumero:  filter[0].Endereco[0].Nro, inputBairro:  filter[0].Endereco[0].Bairro,inputComplemento:  filter[0].Endereco[0].Complemento ,inputUF:  filter[0].Endereco[0].Estado, inputCidade:  filter[0].Endereco[0].Cidade,inputCEP:  filter[0].Endereco[0].Cep};
        
        if(filter[0].Endereco.length > 1){
            $scope.checkboxEndereco.checked = true;
            $rootScope.showEnderecoEntrega = true;
            $rootScope.cadastro = {inputTipoEndereco2: filter[0].Endereco[0].Tipo.toString(), inputRua2:  filter[0].Endereco[0].Endereco, inputNumero2:  filter[0].Endereco[0].Nro, inputBairro2:  filter[0].Endereco[0].Bairro,inputComplemento2:  filter[0].Endereco[0].Complemento ,inputUF2:  filter[0].Endereco[0].Estado, inputCidade2:  filter[0].Endereco[0].Cidade,inputCEP2:  filter[0].Endereco[0].Cep}
        }
    }

    if($rootScope.idCliente != ''){
    	$scope.carregaDadosCliente();
    }else{
        $scope.showSalvar = true;
    }

})