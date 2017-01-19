//TESTE

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngStorage', 'ui.utils.masks', 'dsDbase', 'starter.subprodutospedido', 'starter.meuspedidos','starter.produtospedido', 'starter.subcategorias', 'starter.categorias', 'starter.buscaclientes', 'starter.cadastroclientes', 'starter.catalogo','starter.catalogoitem', 'starter.listaprodutos', 'starter.detalhes', 'starter.novopedido'])


//PARA FUINCIONAR O HTTP POST
.config(function($httpProvider, $ionicConfigProvider){

  $ionicConfigProvider.scrolling.jsScrolling(false);
 
  // Or for only a single platform, use
  // if( ionic.Platform.isAndroid() ) {
    // $ionicConfigProvider.scrolling.jsScrolling(false);
  // }


  

  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  //$httpProvider.defaults.cache = true;
  $ionicConfigProvider.tabs.position("top"); 
  //$ionicConfigProvider.views.maxCache(0); 

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data)
  {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */ 
    var param = function(obj)
    {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;
      for(name in obj)
      {
        value = obj[name];
        if(value instanceof Array)
        { 
          for(i=0; i<value.length; ++i)
          {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value instanceof Object)
        {
          for(subName in value)
          {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value !== undefined && value !== null)
        {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];

})


.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.alerta = function(titulo, texto){
        navigator.notification.alert(texto,null,titulo,'OK');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })
  .state('app.catalogo', {
    url: '/catalogo',
    views: {
      'menuContent': {
        templateUrl: 'templates/catalogo.html',
        controller: 'catalogoCtrl'
      }
    }
  })
  .state('app.catalogoitem', {
    url: '/catalogoitem',
    views: {
      'menuContent': {
        templateUrl: 'templates/catalogoitem.html',
        controller: 'catalogoitemCtrl'
      }
    }
  })
  .state('app.listaprodutos', {
      url: '/listaprodutos',
      views: {
        'menuContent': {
          templateUrl: 'templates/listaprodutos.html',
        controller: 'listaprodutosCtrl'
        }
      }
    })
  .state('app.produtospedido', {
      url: '/produtospedido',
      views: {
        'menuContent': {
          templateUrl: 'templates/produtospedido.html',
        controller: 'produtospedidoCtrl'
        }
      }
    })
  .state('app.subprodutospedido', {
      url: '/subprodutospedido',
      views: {
        'menuContent': {
          templateUrl: 'templates/subprodutospedido.html',
        controller: 'subprodutospedidoCtrl'
        }
      }
    })
  .state('app.detalhes', {
      url: '/detalhes',
      views: {
        'menuContent': {
          templateUrl: 'templates/detalhes.html',
        controller: 'detalhesCtrl'
        }
      }
    })
  .state('app.novopedido', {
      cache:false,
      url: '/novopedido',
      views: {
        'menuContent': {
          templateUrl: 'templates/novopedido.html',
        controller: 'novopedidoCtrl'
        }
      }
    })
  .state('app.cadastroclientes', {
      url: '/cadastroclientes',
      views: {
        'menuContent': {
          templateUrl: 'templates/cadastroclientes.html',
        controller: 'cadastroclientesCtrl'
        }
      }
    })
  .state('app.buscaclientes', {
      cache:false,
      url: '/buscaclientes',
      views: {
        'menuContent': {
          templateUrl: 'templates/buscaclientes.html',
        controller: 'buscaclientesCtrl'
        }
      }
    })
  .state('app.categorias', {
      url: '/categorias',
      views: {
        'menuContent': {
          templateUrl: 'templates/categorias.html',
        controller: 'categoriasCtrl'
        }
      }
    })
    .state('app.subcategorias', {
      url: '/subcategorias',
      views: {
        'menuContent': {
          templateUrl: 'templates/subcategorias.html',
        controller: 'subcategoriasCtrl'
        }
      }
    })
  .state('app.meuspedidos', {
      cache:false,
      url: '/meuspedidos',
      views: {
        'menuContent': {
          templateUrl: 'templates/meuspedidos.html',
        controller: 'meuspedidosCtrl'
        }
      }
    })

    


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
