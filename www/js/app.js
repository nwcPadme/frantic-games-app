angular.module("frantic_games_app", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","frantic_games_app.controllers", "frantic_games_app.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Frantic Games App" ;
		$rootScope.appLogo = "data/images/header/mylogo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_welcome = false ;
		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_help = false ;
		$rootScope.hide_menu_faqs = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "frantic_games_app",
				storeName : "frantic_games_app",
				description : "The offline datastore for Frantic Games App app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("frantic_games_app.quiz");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?mad\-agency\.xyz/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?crypto\-world\.pp\.ua/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?mad\-universe\.pp\.ua/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("frantic_games_app",{
		url: "/frantic_games_app",
			abstract: true,
			templateUrl: "templates/frantic_games_app-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("frantic_games_app.about_us", {
		url: "/about_us",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.bubble_one", {
		url: "/bubble_one",
		cache:false,
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-bubble_one.html",
						controller: "bubble_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.faqs", {
		url: "/faqs",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.first_game", {
		url: "/first_game",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-first_game.html",
						controller: "first_gameCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.game_five", {
		url: "/game_five",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-game_five.html",
						controller: "game_fiveCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.game_four", {
		url: "/game_four",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-game_four.html",
						controller: "game_fourCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.game_three", {
		url: "/game_three",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-game_three.html",
						controller: "game_threeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.game_two", {
		url: "/game_two",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-game_two.html",
						controller: "game_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.games", {
		url: "/games",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-games.html",
						controller: "gamesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.games_list", {
		url: "/games_list",
		cache:false,
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-games_list.html",
						controller: "games_listCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.help", {
		url: "/help",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-help.html",
						controller: "helpCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.main", {
		url: "/main",
		cache:false,
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-main.html",
						controller: "mainCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.menu_two", {
		url: "/menu_two",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.quiz", {
		url: "/quiz",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-quiz.html",
						controller: "quizCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("frantic_games_app.welcome", {
		url: "/welcome",
		views: {
			"frantic_games_app-side_menus" : {
						templateUrl:"templates/frantic_games_app-welcome.html",
						controller: "welcomeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/frantic_games_app/quiz");
});
