/* Copyright (C) Relevance Lab Private Limited- All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Relevance UI Team,
 * Aug 2015
 */

(function(angular){
	"use strict";
	angular.module('workzone.instance')
		.controller('instanceImportByIpCtrl', ['$scope', '$modalInstance', 'items', 'workzoneServices','$rootScope','workzoneEnvironment','toastr', function($scope, $modalInstance, items, workzoneServices,$rootScope,workzoneEnvironment,toastr) {
			var configAvailable = items[0].data;
			var osList = items[1].data;
			var configList = items[2].data;
			var reqBody = {};
			if (!configAvailable.length) {
				$scope.cancel();
				toastr.error('Chef Or Puppet is not Available');
				return false;
			}
			angular.extend($scope, {
				osList: osList,
				configList: configList,
				isPemActive: 'password',
				os: '',
				pemfile: '',
				csvbulkimportfile: '',
				username: '',
				passwordModel: '',
				ipAddress: '',
				appLinkSecondOption: false,
				selectedConfig: configList[0].rowid,
				importErrorMessage: '',
				pemFileSelection: function($event) {
					if (FileReader) {
						var fileContent = new FileReader();
						fileContent.onload = function(e) {
							$scope.addPemText(e.target.result);
						};
						fileContent.onerror = function(e) {
							toastr.error(e);
						};
						fileContent.readAsText($event);
					} else {
						toastr.error('HTMl5 File Reader is not Supported. Please upgrade your browser');
					}
				},
				csvbulkfileSelection : function($event){
					console.log($event);
					if (FileReader) {
						var fileContent = new FileReader();
						fileContent.onload = function(e) {
							$scope.addCsvBulkText(e.target.result);
						};
						fileContent.onerror = function(e) {
							alert(e);
						};
						fileContent.readAsText($event);
					} else {
						alert('HTMl5 File Reader is not Supported. Please upgrade your browser');
					}
				},
				ok: function() {
					reqBody.fqdn = $scope.ipAddress;
					reqBody.os = $scope.os;
					reqBody.configManagmentId = $scope.selectedConfig;
					reqBody.credentials = {
						username: $scope.username
					};
					var appUrls = [];
					$.each($scope.app, function(index, element) {
						if (element.name && element.url) {
							appUrls.push({
								name: element.name,
								url: element.url
							});
						}
					});
					if (appUrls.length) {
						reqBody.appUrls = appUrls;
					}
					$scope.isSubmitLoading = true;
					//post method for import by ip
					$scope.postMethodImportByIp = function(){
						workzoneServices.postImportByIP(workzoneEnvironment.getEnvParams(),reqBody)
						.then(function(response) {
							if(response.data){
								$modalInstance.close(response.data);
							}
						},function(response){
							$scope.isSubmitLoading = false;
                            if(response.data.message){
                                $scope.importErrorMessage = response.data.message;
                            }else{
                                $scope.importErrorMessage = response.data;
                            }
						});
					};
					if ($scope.isPemActive === "password") {
						reqBody.credentials.password = $scope.passwordModel;
						$scope.postMethodImportByIp();	
					} else {
						$scope.pemFileSelection($scope.pemfile);
					}
					$scope.addPemText = function(pemfileText){
						reqBody.credentials.pemFileData = pemfileText;
						$scope.postMethodImportByIp();
					};
				},
				okBulkImport: function() {
					reqBody.configManagmentId = $scope.selectedConfig;
					$scope.isSubmitLoading = true;
					$scope.isBulkimport = true;
					//post method for import by ip
					$scope.postMethodCsvBulkImport = function(){

						 workzoneServices.postBulkImport(workzoneEnvironment.getEnvParams(),reqBody)
						 .then(function(response) {
						 	if(response.data){
						 		console.log(response.data);
						 		$modalInstance.close(response.data);
						 	}
						 	//console.log('*********************** Hit Here *********************');
						 },function(response){
						 	$scope.isSubmitLoading = false;
						 	$scope.importErrorMessage = response.data.message;
						 });
					};
					$scope.csvbulkfileSelection($scope.csvbulkimportfile);
					
					$scope.addCsvBulkText = function(csvbulkfileText){
						reqBody.csvData = csvbulkfileText;
						$scope.postMethodCsvBulkImport();
					};
				},
				cancel: function() {
					$modalInstance.dismiss('cancel');
				},
				app: [{
					name: '',
					url: ''
				}, {
					name: '',
					url: ''
				}]
			});
			//system default configuration variables
		}
	]);
})(angular);