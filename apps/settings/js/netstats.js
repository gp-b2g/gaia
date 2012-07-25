/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

window.addEventListener('localized', function scanWifiNetworks(evt) {
  // for testing, get data for last 30 min instead of last month
  var precision = 1000 * 60;
  //var precision = 1000 * 60 * 60 * 24;

  var end = new Date(Math.floor(new Date().getTime() / precision) * precision);
  var start = new Date(Math.floor(new Date().getTime() / precision) * precision);
  //start.setMonth(start.getMonth() - 1);
  //var days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  start.setMinutes(start.getMinutes() - 30);
  var days = Math.floor((end - start) / precision);

  //var networkTypes = navigator.mozNetworkStats.types;
  var networkTypes = ['wifi','mobile'];
  for(var type in networkTypes){
    var req = navigator.mozNetworkStats.getNetworkStats({startDate: start, endDate: end, connectionType: networkTypes[type]});
    req.onsuccess = function (event) {
      var canvas = document.getElementById(event.target.result.connectionType + 'GraphCanvas');
      paint(canvas, event.target.result);
    };
    req.onerror = function () {
      console.log('Error requesting network stats: ' + this.error.name);
    };
  }

  function paint(canvas, networkStats){
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    var x_space = width / days;

    var ctx = canvas.getContext("2d");
    var rx = networkStats.rxBytes;
    var tx = networkStats.txBytes;

    console.log("ConnectionType: " + networkStats.connectionType);
    console.log("StartDate: " + networkStats.startDate);
    console.log("EndDate: " + networkStats.endDate);

    if(rx && tx){
      console.log("Data rx: " + networkStats.rx);
      console.log("Data tx: " + networkStats.tx);

      // Check if data is available from start/end date, else insert '0'
      if(networkStats.startDate > start){
        var offset = Math.floor((networkStats.startDate - start) / precision) - 1;
        console.log("add " + offset);
        for(var i = 0; i < offset; i++){
          rx.unshift(0);
          tx.unshift(0);
        }
      }

      if(networkStats.endDate < end){
        var offset = Math.floor((end - networkStats.startDate) / precision) - 1;
        console.log("add " + offset);
        for(var i = 0; i < offset; i++){
          rx.push(0);
          tx.push(0);
        }
      }

      // Normalize data
      var sum = 0;
      for(var i in rx)
        sum += rx[i] + tx[i];

      var scale_factor = height / sum;
      
      // Draw rx data
      var x = 1;
      var y = height - ((rx[0] + tx[0]) * scale_factor);
  
      ctx.strokeStyle = '#3300AA';
      ctx.fillStyle = '#00AAFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for(var i = 1; i < days - 1; i++){
        x += x_space;
        y -= (rx[i] + tx[i]) * scale_factor;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.lineTo(x, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Draw tx data
      var x = 1;
      var y = height - (tx[0] * scale_factor);

      ctx.strokeStyle = "#33BB00";
      ctx.fillStyle = "#33FF55";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for(var i = 1; i < days - 1; i++){
        x += x_space;
        y -= tx[i] * scale_factor;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.lineTo(x, height);
      ctx.lineTo(0, height);
      ctx.fill();
    }

    // Draw axis
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(1,1);
    ctx.lineTo(1, height);
    ctx.lineTo(width, height);
    ctx.stroke();

    // Draw subX
    var x = 1;

    ctx.strokeStyle = "#DDDDDD";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(var i = 1; i < days - 1; i++){
      x += x_space;
      ctx.moveTo(x, height - 1);
      ctx.lineTo(x, 0);
    }
    ctx.stroke();
  }

});

