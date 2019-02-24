import { Component, OnInit } from '@angular/core';
import { BlockService } from '../block.service';
import * as d3 from 'd3';
import { balancePreviousStylesIntoKeyframes } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-transactionGraph',
  templateUrl: './transactionGraph.component.html',
  styleUrls: ['./transactionGraph.component.css']
})
export class TransactionGraphComponent implements OnInit {
  now = new Date();
  transactions = [];

  constructor(private blockService: BlockService) {
  }

  ngOnInit() {
    var blockService = this.blockService;

    var limit = 90,
      duration = 750

    var width = 450,
      height = 150,
      counter = 18,
      max = 10;


    var groups = {
      current: {
        value: 0,
        color: 'orange',
        data: d3.range(limit).map(function () {
          return 0
        })
      }
    }

    var x = d3.scaleTime()
      .domain([Date.now() - (limit - 2), Date.now() - duration])
      .range([0, width])

    var y = d3.scaleLinear()
      .domain([0, max])
      .range([height, 0])

    var line = d3.line()
      .curve(d3.curveBasis)
      .x(function (d, i) {
        return x(Date.now() - (limit - 1 - i) * duration)
      })
      .y(function (d) {
        return y(d)
      })

    var svg = d3.select('.graph')
      .classed("svg-container", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr('class', 'chart')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + (height + 30) + "")
      //class to make it responsive
      .classed("svg-content-responsive", true);

      svg
      .style('font-size', '10px')
      .style('font-family', "'Lato', 'Helvetica', 'Arial', 'sans-serif'")
      .style('font-weight', '0')
      .style('letter-spacing', '1.5px')

      svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ 8 +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .text("Transactions in 15s");

    // Add the X Axis
    x.axis = d3.axisBottom(x)
    var xaxis = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(35,' + height + ')')
      .call(x.axis)

    // Add the Y Axis
    y.axis = d3.axisLeft(y)
    .ticks(5)
    .tickSizeOuter(0)
    .tickFormat(d3.format("d"))

    var yaxis = svg.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate(" + 35 + ",0)")
      .call(y.axis) // Create an axis component with d3.axisLeft

    var paths = svg.append('g')

    for (var name in groups) {
      var group = groups[name]
      group.path = paths.append('path')
        .data([group.data])
        .attr('class', name + ' group')
        .style('stroke', group.color)
        .style("fill", "none")
    }

    function getValues() {
      blockService.getBlockCount(15, true).subscribe(data => {
        groups['current'].value = data['_size'];
        if (data['_size'] >= max) {
          max = data['_size'];

          y.domain([0, max * 1.2])

          // y-axis
          yaxis.transition()
          .attr("transform", "translate(" + 35 + ",0)")
          .duration(1500)
          .ease(d3.easeLinear)
          .call(y.axis)
        }
      });
      blockService.getBlockCountDetails(15, true).subscribe(data => {
      });
    }

    function tick() {
      counter++;
      //every 15 (20*5) seconds get some data
      if (counter == 19) {
        counter = 0;

        getValues();
        // Add new values
      }

      for (var name in groups) {
        var group = groups[name]
        groups['current'].data.push(group.value) // Real values arrive at irregular intervals
        group.path.attr('d', line)
      }

      // Shift domain
      x.domain([Date.now() - (limit - 2) * duration, Date.now() - duration])

      // Slide x-axis left
      xaxis.transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .call(x.axis)

      // Slide paths left
      paths.attr('transform', null)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr('transform', 'translate(' + x(Date.now() - (limit - 1) * duration) + ')')
        .on('end', tick)

      //Remove oldest data point from each group
      for (var name in groups) {
        var group = groups[name]
        group.data.shift()
      }
    }

    tick()
  }
}

