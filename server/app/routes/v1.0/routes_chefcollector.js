/*
Copyright [2016] [Relevance Lab]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


// This file act as a Controller which contains chef server related all end points.


var Chef = require('_pr/lib/chef');
var EC2 = require('_pr/lib/ec2');
var instancesDao = require('_pr/model/classes/instance/instance');
var environmentsDao = require('_pr/model/d4dmasters/environments.js');
var logsDao = require('_pr/model/dao/logsdao.js');
var configmgmtDao = require('_pr/model/d4dmasters/configmgmt');
var fileIo = require('_pr/lib/utils/fileio');
var appConfig = require('_pr/config');
var uuid = require('node-uuid');
var taskStatusModule = require('_pr/model/taskstatus');
var credentialCryptography = require('_pr/lib/credentialcryptography');
var Curl = require('_pr/lib/utils/curl.js');
var errorResponses = require('./error_responses');
var waitForPort = require('wait-for-port');
var logger = require('_pr/logger')(module);
var masterUtil = require('_pr/lib/utils/masterUtil.js');
var Docker = require('_pr/model/docker.js');

module.exports.setRoutes = function(app, verificationFunc) {

    // app.all('/chefcollector/*', verificationFunc);
   app.get('/d4dMastersCICD/readmasterjsonnew/:id', function(req, res) {
        logger.debug("Enter get() for /d4dMasters/readmasterjsonnew/%s", req.params.id);
        logger.debug("Logged in user: ", req.session.user.cn);
        logger.debug("incomming id: ", req.params.id);
        var loggedInUser = 'superadmin';
        masterUtil.getLoggedInUser(loggedInUser, function(err, anUser) {
            if (err) {
                res.status(500).send("Failed to fetch User.");
                return;
            }
            if (!anUser) {
                res.status(500).send("Invalid User.");
                return;
            }
            if (anUser.orgname_rowid[0] === "") {
                // For Org
                masterUtil.getAllActiveOrg(function(err, orgList) {
                    logger.debug("got org list ==>", JSON.stringify(orgList));
                    if (err) {
                        res.status(500).send('Not able to fetch Orgs.');
                        return;
                    }
                    if (orgList.length === 0 && req.params.id === '21') {
                        d4dModelNew.d4dModelMastersTeams.find({
                            id: "21"
                        }, function(err, data) {
                            if (err) {
                                logger.error("Failed to fetch Team.");
                            }
                            res.send(data);
                        });
                    } else if (req.params.id === '1') {
                        res.send(orgList);
                        return;
                    } else if (req.params.id === '2') {
                        // For BusinessGroup
                        masterUtil.getBusinessGroups(orgList, function(err, bgList) {
                            if (err) {
                                res.status(500).send('Not able to fetch BG.');
                            }
                            res.send(bgList);
                            return;
                        });
                    } else if (req.params.id === '3') {
                        // For Environment
                        masterUtil.getEnvironments(orgList, function(err, envList) {
                            if (err) {
                                res.status(500).send('Not able to fetch ENV.');
                            }
                            res.send(envList);
                            return;
                        });
                    } else if (req.params.id === '4') {
                        // For Projects
                        masterUtil.getProjects(orgList, function(err, projectList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Project.');
                            }
                            res.send(projectList);
                            return;
                        })
                    } else if (req.params.id === '10') {
                        // For ConfigManagement
                        masterUtil.getCongifMgmts(orgList, function(err, configMgmtList) {
                            if (err) {
                                res.status(500).send('Not able to fetch ConfigManagement.');
                            }
                            res.send(configMgmtList);
                            return;
                        });

                    } else if (req.params.id === '18') {
                        // For Docker
                        logger.debug("Id for docker: ", req.params.id);
                        masterUtil.getDockers(orgList, function(err, dockerList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Dockers.');
                            }
                            res.send(dockerList);
                            return;
                        });

                    } else if (req.params.id === '17') {
                        // For Template
                        logger.debug("Id for template: ", req.params.id);
                        masterUtil.getTemplates(orgList, function(err, templateList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Template.');
                            }
                            res.send(templateList);
                            return;
                        });

                    } else if (req.params.id === '16') {
                        // For Template
                        logger.debug("Id for templateType: ", req.params.id);
                        masterUtil.getTemplateTypes(orgList, function(err, templateList) {
                            if (err) {
                                res.status(500).send('Not able to fetch TemplateType.');
                            }
                            res.send(JSON.stringify(templateList));
                            return;
                        });
                    } else if (req.params.id === '19') {
                        // For ServiceCommand
                        masterUtil.getServiceCommands(orgList, function(err, serviceCommandList) {
                            if (err) {
                                res.status(500).send('Not able to fetch ServiceCommand.');
                            }
                            res.send(serviceCommandList);
                            return;
                        });

                    } else if (req.params.id === '20') {
                        // For Jenkins
                        masterUtil.getJenkins(orgList, function(err, jenkinList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Jenkins.');
                            }
                            res.send(jenkinList);
                            return;
                        });

                    } else if (req.params.id === '27') {
                        // For Jenkins
                        masterUtil.getBitbucket(orgList, function(err, bitbucketList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Bitbucket.');
                            }
                            res.send(bitbucketList);
                            return;
                        });

                    } else if (req.params.id === '28') {
                        // For Octopus
                        masterUtil.getOctopus(orgList, function(err, octopusList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Octopus.');
                            }
                            res.send(octopusList);
                            return;
                        });

                    } 
                    else if (req.params.id === '23') {
                        // For Jira
                        logger.debug("Entering getJira");
                        masterUtil.getJira(orgList, function(err, jiraList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Jira.');
                            }
                            res.send(jiraList);
                            return;
                        });

                    } 
                    else if (req.params.id === '6') {
                        // For User Role
                        masterUtil.getUserRoles(function(err, userRoleList) {
                            if (err) {
                                res.status(500).send('Not able to fetch UserRole.');
                            }
                            res.send(userRoleList);
                            return;
                        });

                    } else if (req.params.id === '7') {
                        // For User
                        masterUtil.getUsersForOrgOrAll(orgList, function(err, userList) {
                            if (err) {
                                res.status(500).send('Not able to fetch User.');
                            }
                            res.send(userList);
                            return;
                        });

                    } else if (req.params.id === '21') {
                        // For Team
                        masterUtil.getTeams(orgList, function(err, teamList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Team.');
                            }
                            res.send(teamList);
                            return;
                        });
                    } else if (req.params.id === '25') {
                        // For Puppet Server
                        masterUtil.getPuppetServers(orgList, function(err, pList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Puppet Server.');
                            }
                            res.send(pList);
                            return;
                        });

                    } else if (req.params.id === '26') {
                        // For Puppet Server
                        masterUtil.getNexusServers(orgList, function(err, pList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Nexus Server.');
                            }
                            res.send(pList);
                            return;
                        });
                    } else {
                        logger.debug('nothin here');
                        res.send([]);
                    }
                });

                // For non-catalystadmin
            } else {
                logger.debug("incomming id: ", req.params.id);
                // For Org
                masterUtil.getOrgs(loggedInUser, function(err, orgList) {
                    logger.debug("got org list: ", JSON.stringify(orgList));
                    if (err) {
                        res.status(500).send('Not able to fetch Orgs.');
                        return;
                    } else if (req.params.id === '1') {
                        res.send(orgList);
                        return;
                    } else if (req.params.id === '2') {
                        // For BusinessGroup
                        masterUtil.getBusinessGroups(orgList, function(err, bgList) {
                            if (err) {
                                res.status(500).send('Not able to fetch BG.');
                            }
                            res.send(bgList);
                            return;
                        });
                    } else if (req.params.id === '3') {
                        // For Environment
                        masterUtil.getEnvironments(orgList, function(err, envList) {
                            if (err) {
                                res.status(500).send('Not able to fetch ENV.');
                            }
                            res.send(envList);
                            return;
                        });
                    } else if (req.params.id === '4') {
                        // For Projects
                        masterUtil.getProjects(orgList, function(err, projectList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Project.');
                            }
                            res.send(projectList);
                            return;
                        })
                    } else if (req.params.id === '10') {
                        // For ConfigManagement
                        masterUtil.getCongifMgmts(orgList, function(err, configMgmtList) {
                            if (err) {
                                res.status(500).send('Not able to fetch ConfigManagement.');
                            }
                            res.send(configMgmtList);
                            return;
                        });

                    } else if (req.params.id === '18') {
                        // For Docker
                        logger.debug("Id for docker: ", req.params.id);
                        masterUtil.getDockers(orgList, function(err, dockerList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Dockers.');
                            }
                            res.send(dockerList);
                            return;
                        });

                    } else if (req.params.id === '17') {
                        // For Template
                        logger.debug("Id for template: ", req.params.id);
                        masterUtil.getTemplates(orgList, function(err, templateList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Template.');
                            }
                            res.send(templateList);
                            return;
                        });

                    } else if (req.params.id === '16') {
                        // For Template
                        logger.debug("Id for templateType: ", req.params.id);
                        masterUtil.getTemplateTypes(orgList, function(err, templateList) {
                            if (err) {
                                res.status(500).send('Not able to fetch TemplateType.');
                            }
                            res.send(JSON.stringify(templateList));
                            return;
                        });

                    } else if (req.params.id === '19') {
                        // For ServiceCommand
                        masterUtil.getServiceCommands(orgList, function(err, serviceCommandList) {
                            if (err) {
                                res.status(500).send('Not able to fetch ServiceCommand.');
                            }
                            res.send(serviceCommandList);
                            return;
                        });

                    } else if (req.params.id === '20') {
                        // For Jenkins
                        masterUtil.getJenkins(orgList, function(err, jenkinList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Jenkins.');
                            }
                            res.send(jenkinList);
                            return;
                        });

                    } else if (req.params.id === '27') {
                        // For Bitbucket
                        masterUtil.getBitbucket(orgList, function(err, bitbucketList) {
                            if (err) {
                                res.status(500).send('Not able to fetch bitbucket.');
                            }
                            res.send(bitbucketList);
                            return;
                        });

                    }else if (req.params.id === '28') {
                        // For Octopus
                        masterUtil.getOctopus(orgList, function(err, octopusList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Octopus.');
                            }
                            res.send(octopusList);
                            return;
                        });

                    }else if (req.params.id === '23') {
                        // For Jira
                        masterUtil.getJira(orgList, function(err, jiraList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Jira.');
                            }
                            res.send(jiraList);
                            return;
                        });

                    }else if (req.params.id === '6') {
                        // For User Role
                        masterUtil.getUserRoles(function(err, userRoleList) {
                            if (err) {
                                res.status(500).send('Not able to fetch UserRole.');
                            }
                            res.send(userRoleList);
                            return;
                        });

                    } else if (req.params.id === '7') {
                        // For User
                        masterUtil.getUsersForOrg(orgList, function(err, userList) {
                            if (err) {
                                res.status(500).send('Not able to fetch User.');
                            }
                            res.send(userList);
                            return;
                        });

                    } else if (req.params.id === '21') {
                        // For Team
                        masterUtil.getTeams(orgList, function(err, teamList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Team.');
                            }
                            res.send(teamList);
                            return;
                        });
                    } else if (req.params.id === '25') {
                        // For Puppet Server
                        masterUtil.getPuppetServers(orgList, function(err, pList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Puppet Server.');
                            }
                            res.send(pList);
                            return;
                        });
                    } else if (req.params.id === '26') {
                        // For Puppet Server
                        masterUtil.getNexusServers(orgList, function(err, pList) {
                            if (err) {
                                res.status(500).send('Not able to fetch Nexus Server.');
                            }
                            res.send(pList);
                            return;
                        });
                    } else {
                        logger.debug('nothin here');
                        res.send([]);
                    }
                });
            }
        });

    });
    app.get('/chefcollector/servers/:serverId/nodes', function(req, res) {
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                logger.debug(err);
                res.status(500).send(errorResponses.db.error);
                return;
            }
            if (!chefDetails) {
                res.send(404, errorResponses.chef.corruptChefData);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.getNodesList(function(err, nodeList) {
                if (err) {
                    res.status(500).send(errorResponses.chef.connectionError);
                    return;
                } else {
                    instancesDao.getInstancesFilterByChefServerIdAndNodeNames(req.params.serverId, nodeList, function(err, instances) {
                        if (err) {
                            res.status(500).send(errorResponses.chef.connectionError);
                            return;
                        }
                        if (instances && instances.length) {
                            for (var i = 0; i < instances.length; i++) {
                                var index = nodeList.indexOf(instances[i].chef.chefNodeName);
                                if (index !== -1) {}
                            }
                            res.send(nodeList);
                        } else {
                            res.send(nodeList);
                        }

                    });
                }
            });

        });
    });


    app.get('/chefcollector/justtesting/:mastername/:fieldname/:comparedfieldname/:comparedfieldvalue', function(req, res) {
        logger.debug('test', req.params.mastername, ' ' + req.params.fieldname, ' ' + req.params.comparedfieldname);
        configmgmtDao.getListFilteredNew(req.params.mastername, req.params.fieldname, req.params.comparedfieldname, req.params.comparedfieldvalue, function(err, outd) {
            if (!err)
                res.send(outd);
            else
                res.send(err);
        });
    });
    app.get('/chefcollector/servers/:serverId/environments', function(req, res) {
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                logger.debug(err);
                res.status(500).send(errorResponses.db.error);
                return;
            }
            if (!chefDetails) {
                res.send(404, errorResponses.chef.corruptChefData);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.getEnvironmentsList(function(err, environmentsList) {
                if (err) {
                    res.status(500).send(errorResponses.chef.connectionError);
                    return;
                } else {
                    res.send(environmentsList);
                }
            });

        });
    });

    app.get('/chefcollector/servers/:serverId/nodes/:nodeName', function(req, res) {
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                logger.debug(err);
                res.send(500);
                return;
            }
            if (!chefDetails) {
                logger.debug("Chef details not found");
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.getNode(req.params.nodeName, function(err, nodeData) {
                if (err) {
                    logger.debug(err)
                    res.send(500);
                    return;
                } else {
                    res.send(nodeData);
                }
            });

        });
    });


    app.post('/chefcollector/servers/:serverId/sync/nodes', function(req, res) {


        var taskStatusObj = null;
        var chef = null;
        var reqBody = req.body;
        var projectId = reqBody.projectId;
        var orgId = reqBody.orgId;
        var bgId = reqBody.bgId;
        var envId = reqBody.envId;
        var count = 0;

        var users = reqBody.users;
        if (!projectId) {
            res.send(400);
            return;
        }
        if (!users || !users.length) {
            res.send(400);
            return;
        }

        var insertNodeInMongo = function(node, callback) {
            var platformId = '';
            if (!node.automatic) {
                node.automatic = {};
            }
            var nodeIp = 'unknown';
            if (node.automatic.ipaddress) {
                nodeIp = node.automatic.ipaddress;
            }

            if (node.automatic.cloud) {
                if (node.automatic.cloud.public_ipv4 && node.automatic.cloud.public_ipv4 !== 'null') {
                    nodeIp = node.automatic.cloud.public_ipv4;
                }
                if (node.automatic.cloud.provider === 'ec2') {
                    if (node.automatic.ec2) {
                        platformId = node.automatic.ec2.instance_id;
                    }
                }
            }

            var hardwareData = {
                platform: 'unknown',
                platformVersion: 'unknown',
                architecture: 'unknown',
                memory: {
                    total: 'unknown',
                    free: 'unknown',
                },
                os: 'linux'
            };
            if (node.automatic.os) {
                hardwareData.os = node.automatic.os;
            }
            if (node.automatic.kernel && node.automatic.kernel.machine) {
                hardwareData.architecture = node.automatic.kernel.machine;
            }
            if (node.automatic.platform) {
                hardwareData.platform = node.automatic.platform;
            }
            if (node.automatic.platform_version) {
                hardwareData.platformVersion = node.automatic.platform_version;
            }
            if (node.automatic.memory) {
                hardwareData.memory.total = node.automatic.memory.total;
                hardwareData.memory.free = node.automatic.memory.free;
            }
            var runlist = node.run_list;
            if (!runlist) {
                runlist = [];
            }

            if (hardwareData.platform === 'windows') {
                hardwareData.os = "windows";
            }

            function getCredentialsFromReq(callback) {
                var credentials = {};

                if (reqBody.credentials && reqBody.credentials.pemFileData) {
                    credentials = reqBody.credentials;
                    credentials.pemFileLocation = appConfig.tempDir + uuid.v4();
                    fileIo.writeFile(credentials.pemFileLocation, reqBody.credentials.pemFileData, null, function(err) {
                        if (err) {
                            logger.debug('unable to create pem file ', err);
                            callback(err, null);
                            return;
                        }
                        callback(null, credentials);
                    });

                } else {

                    if (!reqBody.credentials) {
                        var tempPemFileLocation = appConfig.tempDir + uuid.v4();
                        fileIo.copyFile(appConfig.aws.pemFileLocation + appConfig.aws.pemFile, tempPemFileLocation, function() {
                            if (err) {
                                logger.debug('unable to copy pem file ', err);
                                callback(err, null);
                                return;
                            }
                            credentials = {
                                username: appConfig.aws.instanceUserName,
                                pemFileLocation: tempPemFileLocation
                            }
                            callback(null, credentials);
                        });
                    } else {
                        callback(null, reqBody.credentials);
                    }
                }
            }

            getCredentialsFromReq(function(err, credentials) {
                if (err) {
                    logger.debug("unable to get credetials from request ", err);
                    callback(err, null);
                    return;
                }
                credentialCryptography.encryptCredential(credentials, function(err, encryptedCredentials) {
                    if (err) {
                        logger.debug("unable to encrypt credentials == >", err);
                        callback(err, null);
                        return;
                    }

                    logger.debug('nodeip ==> ', nodeIp);
                    logger.debug('alive ==> ', node.isAlive);
                    var instance = {
                        name: node.name,
                        orgId: orgId,
                        bgId: bgId,
                        projectId: projectId,
                        envId: node.envId,
                        chefNodeName: node.name,
                        runlist: runlist,
                        platformId: platformId,
                        instanceIP: nodeIp,
                        instanceState: 'running',
                        bootStrapStatus: 'success',
                        hardware: hardwareData,
                        credentials: encryptedCredentials,
                        users: users,
                        chef: {
                            serverId: req.params.serverId,
                            chefNodeName: node.name
                        },
                        blueprintData: {
                            blueprintName: node.name,
                            templateId: "chef_import",
                            iconPath: "../private/img/templateicons/chef_import.png"
                        }
                    }

                    instancesDao.createInstance(instance, function(err, data) {
                        if (err) {
                            logger.debug(err, 'occured in inserting node in mongo');
                            callback(err, null);
                            return;
                        }
                        logsDao.insertLog({
                            referenceId: data._id,
                            err: false,
                            log: "Node Imported",
                            timestamp: new Date().getTime()
                        });

                        var _docker = new Docker();
                        _docker.checkDockerStatus(data._id, function(err, retCode) {
                            if (err) {
                                logger.error("Failed _docker.checkDockerStatus", err);
                                return;
                            }
                            logger.debug('Docker Check Returned:' + retCode);
                            if (retCode == '0') {
                                instancesDao.updateInstanceDockerStatus(data._id, "success", '', function(data) {
                                    logger.debug('Instance Docker Status set to Success');
                                });

                            }
                        });



                        callback(null, data);

                    });

                });
            });

        }

        function updateTaskStatusNode(nodeName, msg, err, i) {
            count++;
            var status = {};
            status.nodeName = nodeName;
            status.message = msg;
            status.err = err;

            logger.debug('taskstatus updated');

            if (count == reqBody.selectedNodes.length) {
                logger.debug('setting complete');
                taskstatus.endTaskStatus(true, status);
            } else {
                logger.debug('setting task status');
                taskstatus.updateTaskStatus(status);
            }

        };

        function importNodes(nodeList) {
            taskStatusModule.getTaskStatus(null, function(err, obj) {
                if (err) {
                    res.send(500);
                    return;
                }
                taskstatus = obj;
                for (var i = 0; i < nodeList.length; i++) {

                    (function(nodeName) {
                        chef.getNode(nodeName, function(err, node) {
                            if (err) {
                                logger.debug(err);
                                updateTaskStatusNode(nodeName, "Unable to import node " + nodeName, true, count);
                                return;
                            } else {

                                logger.debug('creating env ==>', node.chef_environment);
                                logger.debug('orgId ==>', orgId);
                                logger.debug('bgid ==>', bgId);
                                // logger.debug('node ===>', node);
                                environmentsDao.createEnv(node.chef_environment, orgId, bgId, projectId, function(err, data) {

                                    if (err) {
                                        logger.debug(err, 'occured in creating environment in mongo');
                                        updateTaskStatusNode(node.name, "Unable to import node : " + node.name, true, count);
                                        return;
                                    }
                                    logger.debug('Env ID Received before instance create:' + data);
                                    node.envId = data;
                                    //fetching the ip of the imported node
                                    var nodeIp = 'unknown';
                                    if (node.automatic.ipaddress) {
                                        nodeIp = node.automatic.ipaddress;
                                    }

                                    if (node.automatic.cloud && node.automatic.cloud.public_ipv4 && node.automatic.cloud.public_ipv4 !== 'null') {
                                        nodeIp = node.automatic.cloud.public_ipv4;
                                    }

                                    instancesDao.getInstanceByOrgAndNodeNameOrIP(orgId, node.name, nodeIp, function(err, instances) {
                                        if (err) {
                                            logger.debug('Unable to fetch instance', err);
                                            updateTaskStatusNode(node.name, "Unable to import node : " + node.name, true, count);
                                            return;
                                        }
                                        if (instances.length) {
                                            configmgmtDao.getOrgBgProjEnvNameFromIds(instances[0].orgId, instances[0].bgId, instances[0].projectId, instances[0].envId, function(err, names) {
                                                if (err) {
                                                    updateTaskStatusNode(node.name, "Unable to import node : " + node.name, true, count);
                                                    return;
                                                }
                                                updateTaskStatusNode(node.name, "Node exist in " + names.orgName + "/" + names.bgName + "/" + names.projName + "/" + names.envName + " : " + node.name, true, count);
                                            });
                                            return;
                                        }

                                        var openport = 22;
                                        if (node.automatic.platform === 'windows') {
                                            openport = 5985;
                                        }
                                        logger.debug('checking port for node with ip : ' + nodeIp);
                                        waitForPort(nodeIp, openport, function(err) {
                                            if (err) {
                                                logger.debug(err);
                                                updateTaskStatusNode(node.name, "Unable to ssh/winrm into node " + node.name + ". Cannot import this node.", true, count);
                                                return;
                                            }
                                            insertNodeInMongo(node, function(err, nodeData) {
                                                if (err) {
                                                    updateTaskStatusNode(nodeName, "Unknown error occured while importing " + node.name + ". Cannot import this node.", true, count);
                                                    return;
                                                }
                                                updateTaskStatusNode(nodeName, "Node Imported : " + nodeName, false, count);
                                            });

                                        });

                                    });
                                });
                            }
                        });

                    })(nodeList[i]);
                }

                res.send(200, {
                    taskId: taskstatus.getTaskId()
                });
            });

        }

        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            if (reqBody.selectedNodes.length) {
                importNodes(reqBody.selectedNodes);
            } else {
                res.send(400);
                return;
            }
        });



    });

    app.post('/chefcollector/environments/create/:serverId', function(req, res) {


        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.createEnvironment(req.body.envName, function(err, envName) {
                if (err) {
                    res.status(500).send("Error to create Env on chef.");
                    return;
                } else if (envName === 409) {
                    logger.debug("Got 409");
                    res.send(409, "Environment Already Exist.");
                    return;
                } else {
                    logger.debug("envName: ", envName);
                    res.send(envName);
                    return;
                }
            });
        });
    });

    app.get('/chefcollector/servers/:serverId/cookbooks', function(req, res) {

        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });

            chef.getCookbooksList(function(err, cookbooks) {
                logger.debug(err);
                if (err) {
                    res.send(500);
                    return;
                } else {
                    res.send(cookbooks);
                    return;
                }
            });


        });

    });

    app.get('/chefcollector/servers/:serverId/cookbooks/:cookbookName', function(req, res) {

        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });

            chef.getCookbook(req.params.cookbookName, function(err, cookbooks) {
                logger.debug(err);
                if (err) {
                    res.send(500);
                    return;
                } else {
                    res.send(cookbooks);
                    return;
                }
            });


        });

    });


    app.get('/chefcollector/servers/:serverId/cookbooks/:cookbookName/download', function(req, res) {

        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });

            chef.downloadCookbook(req.params.cookbookName, function(err, cookbooks) {
                logger.debug(err);
                if (err) {
                    res.send(500);
                    return;
                } else {
                    res.send(cookbooks);
                    return;
                }
            });


        });

    });

    app.post('/chefcollector/servers/:serverId/attributes', function(req, res) {

        if (!((req.body.cookbooks && req.body.cookbooks.length) || (req.body.roles && req.body.roles.length))) {
            res.status(400).send({
                message: "Invalid cookbooks or roles"
            });
            return;
        }

        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            if (req.body.cookbooks && req.body.cookbooks.length) {
                chef.getCookbookAttributes(req.body.cookbooks, function(err, attributesList) {
                    if (err) {
                        res.send(500);
                        return;
                    } else {
                        res.send(attributesList);
                        return;
                    }
                });
            } else {
                // get roles attributes
                res.send([]);
                return;
            }



        });

    });

    app.get('/chefcollector/servers/:serverId/receipeforcookbooks/:cookbookName', function(req, res) {

        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });

            chef.getReceipesForCookbook(req.params.cookbookName, function(err, cookbooks) {
                logger.debug(err);
                if (err) {
                    res.send(500);
                    return;
                } else {
                    res.send(cookbooks);
                    return;
                }
            });


        });

    });


    app.get('/chefcollector/servers/:serverId', function(req, res) {
        logger.debug(req.params.serverId);
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            logger.debug("chefLog -->", chefDetails);
            if (chefDetails) {
                res.send({
                    serverId: chefDetails.rowid,
                    orgname: chefDetails.orgname,
                    orgname_new: chefDetails.orgname_new,
                    orgname_rowid: chefDetails.orgname_rowid
                });
            } else {
                res.send(404);
                return;
            }

        });

    });


    app.post('/chefcollector/servers/:serverId/nodes/:nodename/updateEnv', function(req, res) {
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                logger.debug(err);
                res.status(500).send(errorResponses.chef.corruptChefData);
                return;
            }
            if (!chefDetails) {
                res.status(500).send(errorResponses.chef.corruptChefData);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.updateNodeEnvironment(req.params.nodename, req.body.envName, function(err, success) {
                if (err) {
                    res.send(500);
                    return;
                } else {
                    if (success) {
                        res.send(200);
                        return;
                    } else {
                        res.send(500);
                        return;
                    }
                }
            });
        });
    });

    app.get('/chefcollector/servers/:serverId/cookbooks/:cookbookName/metadata', function(req, res) {

        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.getCookbook(req.params.cookbookName, function(err, cookbooks) {
                logger.debug(err);
                if (err) {
                    res.send(500);
                    return;
                } else {
                    res.send(cookbooks.metadata);
                    return;
                }
            });


        });

    });


    // Create new Data Bag.
    app.post("/chefcollector/servers/:serverId/databag/create", function(req, res) {
        logger.debug("Enter /chefcollector/../databag/create");
        var loggedInUser = req.session.user;
        masterUtil.hasPermission("databag", "create", loggedInUser, function(err, isPermitted) {
            logger.debug("Got permission to create DataBag: ", isPermitted);
            if (isPermitted) {
                configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
                    if (err) {
                        res.send(500);
                        return;
                    }
                    if (!chefDetails) {
                        res.send(404);
                        return;
                    }
                    var chef = new Chef({
                        userChefRepoLocation: chefDetails.chefRepoLocation,
                        chefUserName: chefDetails.loginname,
                        chefUserPemFile: chefDetails.userpemfile,
                        chefValidationPemFile: chefDetails.validatorpemfile,
                        hostedChefUrl: chefDetails.url,
                    });
                    chef.createDataBag(req.body.name, function(err, dataBag) {
                        if (err) {
                            logger.debug("Exit /chefcollector/../databag/create");
                            res.status(500).send("Failed to create Data Bag on Chef.");
                            return;
                        } else if (dataBag === 409) {
                            logger.debug("Exit /chefcollector/../databag/create");
                            res.status(500).send("Data Bag already exist on Chef.");
                            return;
                        } else if (dataBag === 400) {
                            logger.debug("Exit /chefcollector/../databag/create");
                            res.status(400).send("Name can only contain lowercase letters, numbers, hyphens, and underscores.");
                            return;
                        }
                        logger.debug("Exit /chefcollector/../databag/create");
                        res.send(dataBag);
                        return;
                    });
                });
            } else {
                res.send(403, {
                    "message": "You do't have permission to create DataBag."
                });
                return;
            }
        });
    });

    // List all Data Bags.
    app.get("/chefcollector/servers/:serverId/databag/list", function(req, res) {
        logger.debug("Enter /chefcollector/../databag/list");
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.getDataBags(function(err, dataBags) {
                if (err) {
                    logger.debug("Exit /chefcollector/../databag/list");
                    res.status(500).send("Failed to get Data Bag from Chef.");
                    return;
                }
                logger.debug("Exit /chefcollector/../databag/list");
                res.send(dataBags);
                return;
            });
        });
    });

    // Delete a particular Data Bag.
    app.delete("/chefcollector/servers/:serverId/databag/:dataBagName/delete", function(req, res) {
        logger.debug("Enter /chefcollector/../databag/../delete");
        var loggedInUser = req.session.user;
        masterUtil.hasPermission("databag", "delete", loggedInUser, function(err, isPermitted) {
            if (isPermitted) {
                logger.debug("Got permission to remove DataBag: ", isPermitted);
                configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
                    if (err) {
                        res.send(500);
                        return;
                    }
                    if (!chefDetails) {
                        res.send(404);
                        return;
                    }
                    var chef = new Chef({
                        userChefRepoLocation: chefDetails.chefRepoLocation,
                        chefUserName: chefDetails.loginname,
                        chefUserPemFile: chefDetails.userpemfile,
                        chefValidationPemFile: chefDetails.validatorpemfile,
                        hostedChefUrl: chefDetails.url,
                    });
                    chef.deleteDataBag(req.params.dataBagName, function(err, statusCode) {
                        if (err) {
                            logger.debug("Exit /chefcollector/../databag/../delete");
                            res.status(500).send("Failed to delete Data Bag on Chef.");
                            return;
                        } else if (statusCode === 404) {
                            logger.debug("Exit /chefcollector/../databag/../delete");
                            res.status(500).send("No Data Bag found on Chef.");
                            return;
                        }
                        logger.debug("Exit /chefcollector/../databag/../delete");
                        res.send(statusCode);
                        return;
                    });
                });
            } else {
                res.send(403, {
                    "message": "You don't have permission to Delete DataBag."
                });
                return;
            }
        });
    });


    // Create new Data Bag Item.
    app.post("/chefcollector/servers/:serverId/databag/:dataBagName/item/create", function(req, res) {
        logger.debug("Enter /chefcollector/../databag/../item/create");
        var loggedInUser = req.session.user;
        masterUtil.hasPermission("databag", "create", loggedInUser, function(err, isPermitted) {
            if (isPermitted) {
                logger.debug("Got permission to create DataBagItem: ", isPermitted);
                configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
                    if (err) {
                        res.status(500).send("Error to get chef detail.");
                        return;
                    }
                    if (!chefDetails) {
                        res.send(404, "No chef detail found.");
                        return;
                    }
                    var chef = new Chef({
                        userChefRepoLocation: chefDetails.chefRepoLocation,
                        chefUserName: chefDetails.loginname,
                        chefUserPemFile: chefDetails.userpemfile,
                        chefValidationPemFile: chefDetails.validatorpemfile,
                        hostedChefUrl: chefDetails.url,
                    });
                    logger.debug("Id check: ", JSON.stringify(req.body));
                    if (typeof req.body.id === 'undefined' || req.body.id.length === 0) {
                        res.status(400).send("Id can't be empty.");
                        return;
                    }
                    var dataBagItem;
                    if (typeof req.body.dataBagItem === 'undefined') {
                        dataBagItem = {
                            "id": req.body.id
                        };
                    } else {
                        dataBagItem = req.body.dataBagItem;
                        dataBagItem.id = req.body.id;
                    }
                    try {
                        logger.debug("Incoming data bag item: ", JSON.stringify(dataBagItem));
                        dataBagItem = JSON.parse(JSON.stringify(dataBagItem));
                    } catch (e) {
                        logger.debug("error: ", e);
                        res.status(500).send("Invalid Json for Data Bag item.");
                        return;
                    }
                    chef.createDataBagItem(req, dataBagItem, function(err, dataBagItem) {
                        if (err) {
                            logger.debug("Exit /chefcollector/../databag/../item/create");
                            res.status(500).send("Failed to create Data Bag Item on Chef.");
                            return;
                        }
                        if (dataBagItem === 409) {
                            logger.debug("Exit /chefcollector/../databag/../item/create");
                            res.status(500).send("Data Bag Item already exist on Chef.");
                            return;
                        }
                        if (dataBagItem === 403) {
                            logger.debug("Exit /chefcollector/../databag/../item/create");
                            res.send(403, "Encryption Key is not available,Please upload.");
                            return;
                        }
                        logger.debug("Exit /chefcollector/../databag/../item/create");
                        res.send(dataBagItem);
                        return;
                    });
                });
            } else {
                res.send(403, {
                    "message": "You don't have permission to create DataBagItem."
                });
                return;
            }
        });
    });


    // List all Data Bag Items for a Data Bag.
    app.get("/chefcollector/servers/:serverId/databag/:dataBagName/item/list", function(req, res) {
        logger.debug("Enter /chefcollector/../databag/item/list");
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.getDataBagItems(req.params.dataBagName, function(err, dataBagItems) {
                if (err) {
                    logger.debug("Exit /chefcollector/../databag/item/list");
                    res.status(500).send("Failed to get Data Bag from Chef.");
                    return;
                }
                logger.debug("Exit /chefcollector/../databag/item/list");
                logger.debug(JSON.stringify(dataBagItems));
                if (Object.keys(dataBagItems).length > 0) {
                    var responseObj = JSON.stringify(Object.keys(dataBagItems));
                    logger.debug("response " + responseObj);
                    res.send(JSON.parse(responseObj));
                    return;
                } else {
                    res.send(dataBagItems);
                    return;
                }
            });
        });
    });


    // Update a Data Bag Item.
    app.post("/chefcollector/servers/:serverId/databag/:dataBagName/item/:itemId/update", function(req, res) {
        logger.debug("Enter /chefcollector/../databag/../item/update");
        var loggedInUser = req.session.user;
        masterUtil.hasPermission("databag", "modify", loggedInUser, function(err, isPermitted) {
            if (isPermitted) {
                logger.debug("Got permission to update DataBagItem: ", isPermitted);
                configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
                    if (err) {
                        res.send(500);
                        return;
                    }
                    if (!chefDetails) {
                        res.send(404);
                        return;
                    }
                    var chef = new Chef({
                        userChefRepoLocation: chefDetails.chefRepoLocation,
                        chefUserName: chefDetails.loginname,
                        chefUserPemFile: chefDetails.userpemfile,
                        chefValidationPemFile: chefDetails.validatorpemfile,
                        hostedChefUrl: chefDetails.url,
                    });
                    var dataBagItem;
                    if (typeof req.body.dataBagItem === 'undefined') {
                        dataBagItem = {
                            "id": req.params.itemId
                        };
                    } else {
                        dataBagItem = req.body.dataBagItem;
                        dataBagItem.id = req.params.itemId;
                    }
                    try {
                        logger.debug("Incoming data bag item: ", JSON.stringify(dataBagItem));
                        dataBagItem = JSON.parse(JSON.stringify(dataBagItem));
                    } catch (e) {
                        logger.debug("error: ", e);
                        res.status(500).send("Invalid Json for Data Bag item.");
                        return;
                    }
                    chef.updateDataBagItem(req, dataBagItem, function(err, dataBagItem) {
                        if (err) {
                            logger.debug("Exit /chefcollector/../databag/../item/update");
                            res.status(500).send("Failed to update Data Bag Item on Chef.");
                            return;
                        }
                        if (dataBagItem === 403) {
                            logger.debug("Exit /chefcollector/../databag/../item/update");
                            res.send(403, "Encryption Key is not available,Please upload.");
                            return;
                        }
                        logger.debug("Exit /chefcollector/../databag/../item/update");
                        res.send(dataBagItem);
                        return;
                    });
                });
            } else {
                res.send(403, {
                    "message": "You don't have permission to Update DataBagItem."
                });
                return;
            }
        });
    });

    // Delete a Data Bag Item from a Data Bag.
    app.delete("/chefcollector/servers/:serverId/databag/:dataBagName/item/:itemName/delete", function(req, res) {
        logger.debug("Enter /chefcollector/../databag/../item/delete");
        var loggedInUser = req.session.user;
        masterUtil.hasPermission("databag", "delete", loggedInUser, function(err, isPermitted) {
            if (isPermitted) {
                logger.debug("Got permission to remove DataBagItem: ", isPermitted);
                configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
                    if (err) {
                        res.send(500);
                        return;
                    }
                    if (!chefDetails) {
                        res.send(404);
                        return;
                    }
                    var chef = new Chef({
                        userChefRepoLocation: chefDetails.chefRepoLocation,
                        chefUserName: chefDetails.loginname,
                        chefUserPemFile: chefDetails.userpemfile,
                        chefValidationPemFile: chefDetails.validatorpemfile,
                        hostedChefUrl: chefDetails.url,
                    });
                    chef.deleteDataBagItem(req.params.dataBagName, req.params.itemName, function(err, dataBagItem) {
                        if (err) {
                            logger.debug("Exit /chefcollector/../databag/../item/delete");
                            res.status(500).send("Failed to delete Data Bag Item on Chef.");
                            return;
                        }
                        logger.debug("Exit /chefcollector/../databag/../item/delete");
                        res.send(dataBagItem);
                        return;
                    });
                });
            } else {
                res.send(403, {
                    "message": "You don't have permission to delete DataBagItem."
                });
                return;
            }
        });
    });

    // Find a Data Bag Item by Id from a Data Bag.
    app.get("/chefcollector/servers/:serverId/databag/:dataBagName/item/:itemId/find", function(req, res) {
        logger.debug("Enter /chefcollector/../databag/../item/find");
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.getDataBagItemById(req.params.dataBagName, req.params.itemId, function(err, dataBagItem) {
                if (err) {
                    logger.debug("Exit /chefcollector/../databag/../item/find");
                    res.status(500).send("Failed to find Data Bag Item on Chef.");
                    return;
                }
                logger.debug("Exit /chefcollector/../databag/../item/find");
                res.send(dataBagItem);
                return;
            });
        });
    });

    // Delete env from chef.
    app.delete("/chefcollector/servers/:serverId/environments/:envName", function(req, res) {
        logger.debug("Enter /chefcollector/../environments");
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.deleteEnvironment(req.params.envName, function(err, env) {
                if (err) {
                    logger.debug("Exit /chefcollector/../environments ", err);
                    res.status(500).send("Failed to delete environments on Chef.");
                    return;
                }
                logger.debug("Exit /chefcollector/../environments");
                res.send(env);
                return;
            });
        });
    });

    app.delete("/chefcollector/servers/:serverId/environments/:envName", function(req, res) {
        logger.debug("Enter /chefcollector/../environments");
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.deleteEnvironment(req.params.envName, function(err, env) {
                if (err) {
                    logger.debug("Exit /chefcollector/../environments ", err);
                    res.status(500).send("Failed to delete environments on Chef.");
                    return;
                }
                logger.debug("Exit /chefcollector/../environments");
                res.send(env);
                return;
            });
        });
    });

    app.get("/chefcollector/servers/:serverId/search/:index", function(req, res) {
        logger.debug("Enter /chefcollector/../environments");
        configmgmtDao.getChefServerDetails(req.params.serverId, function(err, chefDetails) {
            if (err) {
                res.send(500);
                return;
            }
            if (!chefDetails) {
                res.send(404);
                return;
            }
            var chef = new Chef({
                userChefRepoLocation: chefDetails.chefRepoLocation,
                chefUserName: chefDetails.loginname,
                chefUserPemFile: chefDetails.userpemfile,
                chefValidationPemFile: chefDetails.validatorpemfile,
                hostedChefUrl: chefDetails.url,
            });
            chef.search(req.params.index, req.query.searchQuery, function(err, env) {
                if (err) {
                    res.status(500).send("Failed to to seacrh on chef.");
                    return;
                }
                logger.debug("Exit /chefcollector/../environments");
                res.send(env);
                return;
            });
        });
    });

};
