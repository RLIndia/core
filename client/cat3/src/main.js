/* Copyright (C) Relevance Lab Private Limited- All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Relevance UI Team,
 * Aug 2015
 */


/*global angularApp: true*/
/*
 * This is the main Module and entry point for routes configuration.
 * All modules/feature will be through
 * */

var angularApp = angular.module('catapp', ['ui.router','ngTouch','toastr',
	'global.login',
	'global.breadcrumb',
	'authentication',
	'factory.appPermission',
	'appPermission',
	'dashboard.workzone',
	'dashboard.help',
	'dashboard.track',
	'dashboard.settings',
	'dashboard.design',
	'directive.loading',
	'ngSanitize',
	'global.cache',
	'ui.grid',
	'ui.grid.pagination',
	'ui.grid.autoResize',
	'ui.grid.resizeColumns',
	'global.uiGridOptions',
	'global.messages'
]);

angularApp.run(['$rootScope', 'auth', '$state', '$stateParams',
	function ($rootScope, Auth, $state, $stateParams) {
		'use strict';
		$rootScope.$on('$stateChangeStart', function (event, toState) {
			//More function params: function (event, toState, toParams, fromState, fromParams)
			function checkAuthentication() {
				if (toState.name !== 'signin' && !Auth.isLoggedIn()) {
					event.preventDefault();
					$state.go('signin');
				} else if ((toState.name === 'signin' || toState.name === 'signinDefault') && Auth.isLoggedIn()) {
					event.preventDefault();
					$state.go('dashboard');
				}
			}
			if (Auth.getToken() && !Auth.isLoggedInFirst()) {
				Auth.isTokenValid().then(function (token) {
					if (!token) {
						Auth.destroyUser();
						event.preventDefault();
						$state.go('signin');
					} else {
						Auth.setUserFromLocalStorage();
						checkAuthentication();
					}
				});
			} else {
				checkAuthentication();
			}
		});
		$rootScope.$on('$stateChangeError', function (evt, to, toParams, from, fromParams, error) {
			if (error.redirectTo) {
				$state.go(error.redirectTo);
			} else {
				$state.go('error', {status: error.status});
			}
		});
		$rootScope.state = $state;
		$rootScope.stateParams = $stateParams;
	}
]);

angularApp.controller('HeadNavigatorCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', '$window', 'auth', '$state', 'modulePermission', function ($scope, $rootScope, $http, $log, $location, $window, auth, $state, modulePerms) {
	'use strict';
	//global Scope Constant Defined;
	$rootScope.app = $rootScope.app || {};
	$rootScope.app.isDashboard = false;
	$rootScope.appDetails = $rootScope.appDetails || {};
	$rootScope.$on('SET_HEADER', function () {
		//permission set is included to show/hide modules.
		var _permSet = {
			workzone: modulePerms.workzoneAccess(),
			design: modulePerms.designAccess(),
			settings: modulePerms.settingsAccess(),
			track: modulePerms.trackAccess()
		};
		$rootScope.workZoneBool = _permSet.workzone;
		$rootScope.designBool = _permSet.design;
		$rootScope.settingsBool = _permSet.settings;
		$rootScope.trackBool = _permSet.track;
	});
	$rootScope.$emit('SET_HEADER', $rootScope.appDetails);
	$scope.showLogoutConfirmationSection = false;
	$scope.logoutConfirmation = function () {
		$scope.showLogoutConfirmationSection = true;
	};
	$scope.closeLogoutPanel = function () {
		$scope.showLogoutConfirmationSection = false;
	};
	$scope.doLogout = function () {
		auth.logout().then(function () {
			$rootScope.app.isDashboard = false;
			$rootScope.$emit('HIDE_BREADCRUMB');
			$state.go('signin');
		});
		$scope.showLogoutConfirmationSection = false;
	};
	$rootScope.$on('USER_LOGOUT', function () {
		$scope.doLogout();
	});
}])
.controller('dashboardCtrl', ['$rootScope', '$scope', '$http', 'uac', '$location', 'auth', '$modal' , '$state', function ($rootScope, $scope, $http, uac, $location, auth , $modal, $state) {
	'use strict';
	$rootScope.isBreadCrumbAvailable = true;
	$rootScope.app.isDashboard = true;
	$rootScope.manageUser = function (){
		$modal.open({
			templateUrl: 'src/partials/sections/dashboard/workzone/password.html',
			controller:'updatePasswordCtrl',
			backdrop: 'static',
			keyboard: false
		}).result.then(function () {
			/*auth.logout().then(function () {
				$rootScope.app.isDashboard = false;
				$rootScope.$emit('HIDE_BREADCRUMB');
				$state.go('signin');
			});
			$scope.showLogoutConfirmationSection = false;*/
		}, function () {
			console.log('Dismiss time is ' + new Date());
		});
		/*auth.logout().then(function () {
			$rootScope.app.isDashboard = false;
			$rootScope.$emit('HIDE_BREADCRUMB');
			$state.go('signin');
		});
		$scope.showLogoutConfirmationSection = false;*/
	}
	/*State will be dashboard if coming via login flow. So check permission and do default landing logic*/
	/*Otherwise dont enable default landing logic. This is so that user can land on url directly*/
	if ($state.current.name === 'dashboard') {
		if ($rootScope.workZoneBool) {
			$state.go('dashboard.workzone');
		} else if ($rootScope.designBool) {
			$state.go('dashboard.design');
		} else if ($rootScope.trackBool) {
			$state.go('dashboard.track');
		} else if ($rootScope.settingsBool) {
			$state.go('dashboard.settings');
		}
	}
}]).controller('updatePasswordCtrl', ['$rootScope', '$scope', '$http', 'auth', '$modalInstance', '$state', 'toastr' , function ($rootScope, $scope, $http, auth, $modalInstance, $state, toastr) {
	'use strict';
	$rootScope.isBreadCrumbAvailable = true;
	$rootScope.app.isDashboard = true;
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	}
	$scope.ok =function () {
		var url = '/d4dMasters/passwd';
		var reqBody = {
			"currentpasswd":$scope.passObject.oldPass,
			"newpasswd":$scope.passObject.newPass
		}
		$scope.IsPasswordMatching = false;
		if($scope.passObject.newPass != $scope.passObject.confirmPass){
			$scope.IsPasswordMatching = true;	
			return false;
		}
		$http.post(url, reqBody).success(function(data){
			toastr.success('Password Updated Successfully');
			$modalInstance.close();
		}).error(function (error){
        	toastr.error(error);
  		});
	}
}]);
