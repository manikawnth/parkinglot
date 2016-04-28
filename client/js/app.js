/**
 *  Module
 *
 * Description
 */
(function() {
    var app = angular.module('ParkingApp', ['ngMaterial','smart-table']);
    
    //Any configuration
    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('light-blue')
            .warnPalette('light-blue');
    });

    //Parking lot values
    app.value('lots',{
        'D1':'A11',
        'D2':'A22',
        'D3':'B12'
    })

    //Parking lot factory
    app.factory('parkingLot',['lots',function(lots){
        console.log("Entered Parking lot factory");
        console.log(lots);
        var parkinglot = {
            lots :lots,
            getLot : function(devid){
                if(devid){
                    return lots[devid];    
                }                
            },
            saveLot : function(devid,lotid){
                var existing_dev = this.getDev(lotid);
                if(existing_dev){
                   lots[existing_dev] = ''; 
                }
                lots[devid] = lotid;
            },
            getDev : function(lotid){
                if(lotid){
                    return _.invert(lots)[lotid];    
                }                
            }
        }
        return parkinglot;
    }])

    //Controller
    app.controller('ParkingCtrl', ['$scope','parkingLot', function($scope,parkingLot) {
        var pc = this;
        pc.lots = parkingLot.lots;
        pc.errorMsg = '';

        //pc.selected_device is the device id number
        //pc.input_lot is the input lot number
        
        pc.assign_lot = function(){
            pc.errorMsg = '';
            var devid = parkingLot.getDev(pc.input_lot);
            if (devid){
                pc.errorMsg = "Parking Lot already assigned to device:" + devid;
            }
            else{
                parkingLot.saveLot(pc.selected_device,pc.input_lot);
            }
            pc.selected_device = undefined;   
            pc.input_lot = undefined;
        }
    }]);

})()
