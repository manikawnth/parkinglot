/**
 *  Module
 *
 * Description
 */
(function() {
    var app = angular.module('ParkingApp', ['ngMaterial', 'ngSanitize','smart-table']);

    //Any configuration
    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('light-blue')
            .warnPalette('light-blue');
    });

    /*    //Parking lot values
        app.value('lots',{
            'D1':'A11',
            'D2':'A22',
            'D3':'B12'
        })*/

    //Parking lot factory
    app.factory('parkingLot', ['$http', function($http) {
        var parkinglot = {
            lots: {},
            devices: {},
            getLots: function(id) {
                return $http.get('/lot?id=' + id);
            },
            getDevices: function(dev) {
                return $http.get('/dev?id=' + dev);
            },
            getLot: function(devid) {
                if (devid) {
                    return this.lots[devid];
                }
            },
            saveLot: function(devid, lotid) {
                return $http.post('/lot?lotid=' + lotid + '&' + 'devid=' + devid);
            },
            getDev: function(lotid) {
                if (lotid) {
                    return _.invert(this.lots)[lotid];
                }
            },
            pollDevice: function(lotid,version){
                return $http.get('/checkin?lotid=' + lotid + '&version=' + version );
            }
        }
        return parkinglot;
    }])

    //Controller
    app.controller('ParkingCtrl', ['$scope', '$http','$interval','$mdDialog', 'parkingLot', function($scope, $http,$interval,$mdDialog, parkingLot) {
        var pc = this;
        pc.errorMsg = '';

        parkingLot.getDevices('all')
            .then(function(resp) {
                parkingLot.devices = resp.data;
                pc.lot_devices = resp.data;
            });

        parkingLot.getLots('all')
            .then(function(resp) {
                parkingLot.lots = resp.data;
                pc.lots = parkingLot.lots;
            });
        //pc.selected_device is the device id number
        //pc.input_lot is the input lot number
        pc.version = 0;
        pc.assign_lot = function() {
            pc.errorMsg = '';
            var devid = parkingLot.getDev(pc.input_lot);
            if (devid) {
                pc.errorMsg = "Parking Lot already assigned to device:" + devid;
            } else {
                parkingLot.saveLot(pc.selected_device, pc.input_lot)
                    .then(function(resp) {
                        parkingLot.lots = resp.data;
                        pc.lots = parkingLot.lots;
                    })
            }
            
            pc.selected_device = undefined;
            pc.input_lot = undefined;
        }
        parkingLot.lastCheckin = {mva:' ',miles:' ',gas:' '}
        $interval(function(){
            pc.version += 1;
            parkingLot.pollDevice('00:1A:7D:DA:71:14',pc.version)
            .then(function(resp){
                if (resp.data.mva != ' ' && parkingLot.lastCheckin.mva != resp.data.mva){
                    parkingLot.lastCheckin = resp.data;
                    pc.modal_html = '<div><pre>MVA   - ' + parkingLot.lastCheckin.mva + '\nMILES - ' + parkingLot.lastCheckin.miles + '\nGAS   - ' + parkingLot.lastCheckin.gas + '</pre></div>' 
                    pc.showSimpleToast(parkingLot.lastCheckin);    
                }
            })
        },5000)

        
            //Open a toast when there is a response
        pc.showSimpleToast = function() {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title('Vehicle Checked out of Lot A12')
                .htmlContent(pc.modal_html)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
            );
        };
    }]);

})()
