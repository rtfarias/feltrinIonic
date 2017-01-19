angular.module('dsDbase', [])

.factory('storage', function($timeout,$rootScope, $localStorage) { 
    var obj = {};
    obj.add =  function(resposta){
      if (window.cordova){ 



      for (var i = 0; i < resposta.data.length; i++) {
          var imagem = '/img/semente.jpg';
          var cultivar = "Não informado";
          var colheita = "Não informado";
          var tipo = "Não informado";
          var cor = "Não informado";
          var destaque = "Não informado";

          var DadosTecnicos = [];

          for(var j=0; j<resposta.data[i].DadosTecnicos.length; j++){
              DadosTecnicos.push({Nome: resposta.data[i].DadosTecnicos[j].Nome, Descricao:resposta.data[i].DadosTecnicos[j].Descricao});
              //console.log(DadosTecnicos);
          }

          if(resposta.data[i].Imagens.length > 0 && resposta.data[i].Imagens != null){
            imagem = resposta.data[i].Imagens[0].Foto;
            //console.log(imagem);
          }
          if(resposta.data[i].DadosTecnicos.length > 0 && resposta.data[i].DadosTecnicos != null){
            cultivar = resposta.data[i].DadosTecnicos[1].Descricao;
            colheita = "Não informado";
            tipo = "Não informado";
            cor = "Não informado";
            destaque = "Não informado";
          }
          $localStorage.produtos.push({id: resposta.data[i].Id,IdDaLinha: resposta.data[i].IdDaLinha,Linha: resposta.data[i].Linha,IdDaCategoria: resposta.data[i].IdDaCategoria,Categoria: resposta.data[i].Categoria,IdDaSubCategoria: resposta.data[i].IdDaSubCategoria,SubCategoria: resposta.data[i].SubCategoria,SubCategoriaFoto: resposta.data[i].SubCategoriaFoto,Referencia: resposta.data[i].Referencia,Nome: resposta.data[i].Nome,NomeSeo: resposta.data[i].NomeSeo,ImagemLancamento: resposta.data[i].ImagemLancamento,LinkProduto: resposta.data[i].LinkProduto,Cultivar: resposta.data[i].Cultivar,Peletizada: resposta.data[i].Peletizada,ReferenciaPeletizada: resposta.data[i].ReferenciaPeletizada, Foto: imagem, DadosTecnicos: DadosTecnicos});
          if(i == resposta.data.length-1){
                $rootScope.labelCarregando = "Carregando imagens, isso pode demorar alguns minutos...";
                if($localStorage.tamanhoProdutos < $localStorage.produtos.length && $localStorage.tamanhoProdutos > 0){
                      $rootScope.valorProgress = (($localStorage.tamanhoProdutos*100)/$localStorage.produtos.length);
                      console.log(resposta.data[$localStorage.tamanhoProdutos]);
                      $rootScope.getImagens($localStorage.tamanhoProdutos, $localStorage.produtos[$localStorage.tamanhoProdutos].Id, resposta.data.length-$localStorage.tamanhoProdutos, $localStorage.produtos[$localStorage.tamanhoProdutos].Foto);
                }else
                $rootScope.getImagens(0, resposta.data[0].Id, resposta.data.length, resposta.data[0].Imagens[0].Foto);
          }
        };
        //console.log("retorno local sotorage: "+$localStorage.produtos);
      }

    },
    obj.addclientes = function(resposta){
      if (window.cordova){ 
        var array = [];
        console.log('tamanho retorno: '+resposta.data.length);
        var arrayClientesGeral = [];

        var meio = parseInt(resposta.data.length/2);

        for (var i = 0; i < resposta.data.length; i++) {
            //if($localStorage.IdDoVendedor == resposta.data[i].IdDoVendedor || $localStorage.IdDoVendedor == resposta.data[i].VendedorPai){
                console.log(resposta.data[i]);
                //$timeout(function() {

                  var arrayEndereco = [];
                  if(resposta.data[i].Endereco[0] != undefined){
                    arrayEndereco.push(resposta.data[i].Endereco[0]);
                  }
                  if(resposta.data[i].Endereco[1] != undefined){
                    arrayEndereco.push(resposta.data[i].Endereco[1]);
                  }


                  $localStorage.clientes.push({id: resposta.data[i].Id, IdDoVendedor: resposta.data[i].IdDoVendedor, VendedorPai: resposta.data[i].VendedorPai, Nome: resposta.data[i].Nome, Fantasia: resposta.data[i].Fantasia, Tipo: resposta.data[i].Tipo, CpfCnpj: resposta.data[i].CpfCnpj, RG: resposta.data[i].RG, IE: resposta.data[i].IE, DataNasc: resposta.data[i].DataNasc, Endereco: arrayEndereco});
                //}, 100);

                //$rootScope.showLoadingPaginas = false;
            //}

            if(i == resposta.data.length-1){
                  $rootScope.showLoadingPaginas = false;
            }

        }
        

      }
    },
    obj.addclientesgeral = function(resposta){
      if (window.cordova){ 


        var arrayClientesGeral = [];

        for (var i = 0; i < resposta.data.length; i++) {
            arrayClientesGeral.push({id: resposta.data[i].Id, IdDoVendedor: resposta.data[i].IdDoVendedor, VendedorPai: resposta.data[i].VendedorPai, Nome: resposta.data[i].Nome, Fantasia: resposta.data[i].Fantasia, Tipo: resposta.data[i].Tipo, CpfCnpj: resposta.data[i].CpfCnpj, RG: resposta.data[i].RG, IE: resposta.data[i].IE, DataNasc: resposta.data[i].DataNasc, Endereco: resposta.data[i].Endereco});
        }
        window.localStorage.setItem("arrayClientesGeral", JSON.stringify(arrayClientesGeral));
        
      }
    },
    obj.addlinhas= function(dados, tabela, campo1, campo2){
      if (window.cordova){ 
        var array = [];
        for (var i = 0; i < dados.length; i++) {
            if(array.indexOf(dados[i][campo1]) == -1){
                tabela.push({id: dados[i][campo1],Linha: dados[i][campo2]});
                array.push(dados[i][campo1]);
                //console.log('vai adicionar: '+dados[i][campo1]);
            }
        }
      }
    },
    obj.addcategorias= function(dados, tabela, campo1, campo2, campo3, campo4){
      if (window.cordova){ 
        var array = [];
        for (var i = 0; i < dados.length; i++) {
            if(array.indexOf(dados[i][campo1]) == -1){
                tabela.push({id: dados[i][campo1],Categoria: dados[i][campo2],IdDaLinha: dados[i][campo3] ,Linha: dados[i][campo4]});
                array.push(dados[i][campo1]);
                //console.log('vai adicionar: '+dados[i][campo1]);
            }
        }
      }
    },
    obj.addnovopedido= function(tabela, objeto){
      if (window.cordova){ 

          $localStorage.pedidosSalvos.push(objeto);
          console.log('salvou');
      }
    },
    obj.addlinhaspedido= function(dados, tabela, campo1, campo2){
      if (window.cordova){ 
        var array = [];
        for (var i = 0; i < dados.length; i++) {
            if(array.indexOf(dados[i][campo1]) == -1){
                //console.log('vai adicionar linha: '+dados[i]);
                tabela.push({id: dados[i][campo1],Linha: dados[i][campo2], Grade: dados[i].PrecosSubtipo[0].CodigoDaGrade});
                array.push(dados[i][campo1]);
                //console.log('vai adicionar linha: '+dados[i][campo1]);
            }
        }
      }
    },
    obj.addcategoriaspedido= function(dados, tabela, campo1, campo2, campo3, campo4){
      if (window.cordova){ 
        var array = [];
        //console.log('dados categorias: '+dados);

        var limpaLista = function(){
            for (var i = 0; i < tabela.length; i++) {

                for (var j = 0; j < tabela[i].ItensGrupoNormal.length; j++) {
                    if(tabela[i].ItensGrupoNormal[j] == undefined || tabela[i].ItensGrupoNormal[j].Referencia == undefined){
                            var removed = tabela[i].ItensGrupoNormal.splice(j, 1);
                    }
                    
                }
                
            }
        }

        var carregaProdutosGrupos = function(arrayLinha){

              console.log('entrou carregaProdutosGRupos');
              for (var i = 0; i < arrayLinha.length; i++) {
                  //console.log('codigo grupo no item: '+arrayLinha[i].CodigoDoGrupo);
                  for (var j = 0; j < tabela.length; j++) {
                      //console.log('codigo grupo no item: '+arrayLinha[i].CodigoDoGrupo);
                      if(tabela[j].id == arrayLinha[i].CodigoDoGrupo && tabela[j].IdDaLinha == arrayLinha[i].IdDoPrecoTipo){

                          tabela[j]['ItensGrupoNormal'].push(arrayLinha[i]);

                         /*if(arrayLinha[i].Referencia != "" && arrayLinha[i].Referencia != undefined){

                             if(tabela[j].ItensGrupoNormal[0].ItensSubgrupo.length == 0){
                                tabela[j].ItensGrupoNormal.push(arrayLinha[i]);
                                tabela[j].ItensGrupoNormal[0].ItensSubgrupo.push(arrayLinha[i]);

                             }else if(i > 0 &&  arrayLinha[i].Referencia == arrayLinha[i-1].Referencia){
                                var index = tabela[j].ItensGrupoNormal.length-1;
                                tabela[j].ItensGrupoNormal[0].ItensSubgrupo.push(arrayLinha[i]);


                             }else if(i > 0 &&  arrayLinha[i].Referencia != arrayLinha[i-1].Referencia){
                                tabela[j].ItensGrupoNormal.push(arrayLinha[i], {ItensSubgrupo:[]});
                                var index = tabela[j].ItensGrupoNormal.length-1;

                                tabela[j].ItensGrupoNormal[index].ItensSubgrupo.push(arrayLinha[i]);

                             }
                          }*/

                      }
                  }

                  if(i == arrayLinha.length-1){
                      limpaLista();
                  }
              }

          }
 

          for (var i = 0; i < dados.length; i++) {


              if(dados[i].PrecosSubtipo[0].CodigoDaGrade == null){

                var arrayLinhasGeral = dados[i].PrecosSubtipo;

                var arrayItensCategoria = [];

                var array = [];

                for (var k = 0; k < arrayLinhasGeral.length; k++) {

                  $localStorage.SubLinhas.push({id: arrayLinhasGeral[k].Id, SubLinha: arrayLinhasGeral[k].Descricao ,IdDaLinha: arrayLinhasGeral[k].IdDoPrecoTipo});
                    
                  var arrayLinha = [];
                  arrayLinha = dados[i]['PrecosSubtipo'][k]['PrecosItens'];

                  for (var j = 0; j < arrayLinha.length; j++) {
                      if(array.indexOf(arrayLinha[j][campo2]) == -1){
                        tabela.push({id: arrayLinha[j][campo1],Categoria: arrayLinha[j][campo2], SubLinha: arrayLinhasGeral[k].Descricao,IdDaSubLinha: arrayLinhasGeral[k].Id, IdDaLinha: dados[i][campo3] ,Linha: dados[i][campo4], ItensGrupoNormal: [{ItensSubgrupo:[] }]  });
                        array.push(arrayLinha[j][campo2]);
                        //console.log('vai adicionar categoria: '+arrayLinha[j][campo2]);
                      } 
                  }
                  carregaProdutosGrupos(arrayLinha);

                }


              }else{

                var arrayLinha = [];
                arrayLinha = dados[i].PrecosSubtipo;

                var arrayItensCategoria = [];

                for (var j = 0; j < arrayLinha.length; j++) {
                    if(array.indexOf(arrayLinha[j].Descricao) == -1){
                      tabela.push({id: arrayLinha[j]['CodigoDaGrade'] ,Categoria: arrayLinha[j]['Descricao'], IdDaLinha: dados[i]['Id'] ,Linha: dados[i]['Descricao'], ItensGrupoNormal: [{ItensSubgrupo:[] }]  });
                      console.log('vai adicionar categoria grade: '+arrayLinha[j]['Descricao']);
                      array.push(arrayLinha[j]['CodigoDaGrade']);
                      
                    } 

                }

              }
          }
        

      }
    }
    return obj; 
})