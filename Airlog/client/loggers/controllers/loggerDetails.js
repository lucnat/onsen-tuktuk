var activatedSensors = [];

angular.module('airlog').controller('LoggerDetailsController', function($scope, $stateParams, $meteor){
  $scope.logger = $meteor.object(Loggers, $stateParams.loggerId);
  $scope.back = function(){
  	activatedSensors = [];
  	$scope.activatedSensors = [];
  }
  $scope.plotSingle = function(index){
    var A = $scope.logger.data.transpose(); 
    plotSingle(A,$scope.logger.header,index);
  };
  $scope.plotMultiple = function(indices){
    var A = $scope.logger.data.transpose(); 
    plotMultiple(A,$scope.logger.header,indices);
  };
  $scope.alert = function(){
  	alert('yo watuuup');
  };
  $scope.toggleSensor = function(index){
  	toggleArrayItem(activatedSensors,index);
    var A = $scope.logger.data.transpose(); 
  	plotMultiple(A,$scope.logger.header,activatedSensors);
  };
  $scope.activatedSensors = activatedSensors;
  $scope.getBackgroundColor = function(index){
  	if (activatedSensors.indexOf(index) === -1) return '#fff'
  	else return '#ccc';
  };
});

function plotSingle(A,header,index){
	var label = header[index];
	var data = [];
	for(i=0; i<A[0].length; i++){
		data[i] = [A[0][i].getTime(), Number(A[index][i]) ];
	}
	console.log(data);
	$('#chartContainer').highcharts({
		chart: {
			type: 'line'
		},
        title: {
            text: label,
            x: -20 //center
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: label
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: header[index],
            data: data,
        }]
	});
}

function plotMultiple(A,header,indices){
	var labels = [];
	for(var i=0; i<indices.length; i++){
		labels[i] = header[indices[i]];
	}
	console.log(labels);

	var data = [];
	for(var i=0; i < indices.length; i++){
		var thisSensor = []
		for(var j=0; j<A[0].length; j++){
			thisSensor[j] = [A[0][j].getTime(), Number(A[indices[i]][j])];
		}
		data[i] = thisSensor;
	}

	console.log(data);
	var series = [];
	for(var i=0; i<indices.length; i++){
		series.push({
			name: labels[i],
			data: data[i]
		});
	}

	$('#chartContainer').highcharts({
		chart: {
			type: 'line',
			zoomType: 'x'
		},
        title: {
            text: ' . ',
            x: -20 //center
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: '.'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series
	});
}

Array.prototype.transpose || (Array.prototype.transpose = function() {
    if (!this.length) {
        return [];
    }

    if (this[0] instanceof Array) {
        var tlen = this.length,
            dlen = this[0].length,
            newA = new Array(dlen);
    } else {
        throw new Error("二次元配列をクレ！（・∀・）");
    }

    for (var i = tlen; i--;) {
        if (this[i].length !== dlen) throw new Error("Index Error! 不揃いな林檎たち（・∀・）");
    }

    for (var i = 0; i < dlen; ++i) {
        newA[i] = [];
        for (var j = 0, l = tlen; j < l; j++) {
            newA[i][j] = this[j][i];
        }
    }
    return newA;
});

function toggleArrayItem(a, v) {
    var i = a.indexOf(v);
    if (i === -1)
        a.push(v);
    else
        a.splice(i,1);
}
