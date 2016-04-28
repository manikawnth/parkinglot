/**
 *  Module
 *
 * Description
 */
(function() {
    var app = angular.module('ParkingApp', ['ngMaterial', 'smart-table']);

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
            }
        }
        return parkinglot;
    }])

    //Controller
    app.controller('ParkingCtrl', ['$scope', 'parkingLot', function($scope, parkingLot) {
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

        pc.assign_lot = function() {
            pc.errorMsg = '';
            var devid = parkingLot.getDev(pc.input_lot);
            if (devid) {
                pc.errorMsg = "Parking Lot already assigned to device:" + devid;
            } 
            else {
                parkingLot.saveLot(pc.selected_device, pc.input_lot)
                    .then(function(resp) {
                        parkingLot.lots = resp.data;
                        pc.lots = parkingLot.lots;
                    })
            }
            pc.selected_device = undefined;
            pc.input_lot = undefined;
        }
    }]);

})()
