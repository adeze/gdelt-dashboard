if (!d3.hasOwnProperty('charts')) {
    d3.charts = {};
}

d3.charts.sparkline = function () {

    'use strict';

    var margin = {'top': 2, 'right': 2, 'bottom': 2, 'left': 2},
        width = 200,
        height = 20,
        xAccessor = function (d) { return d.x; },
        yAccessor = function (d) { return d.y; },
        xDomain = null,
        yDomain = null,
        interpolate = 'step';

    function sparkline(selection) {

        selection.each(function (data, index) {

            // Scales

            var x = d3.time.scale.utc()
                .domain(xDomain ? xDomain.call(this, data, index) : d3.extent(data, function (d, i) { return xAccessor(d, i); }))
                .range([0, width - margin.left - margin.right]);

            var y = d3.scale.linear()
                .domain(yDomain ? yDomain.call(this, data, index) : d3.extent(data, function (d, i) { return yAccessor(d, i); }))
                .range([height - margin.top - margin.bottom, 0]);

            var line = d3.svg.line()
                .interpolate(interpolate)
                .x(function (d, i) { return x(xAccessor(d, i)); })
                .y(function (d, i) { return y(yAccessor(d, i)); });

            // Initial selection

            var svg = d3.select(this).selectAll('svg').data([data]);

            // Scaffolding

            var g = svg.enter().append('svg')
                    .attr('class', 'sparkline')
                    .attr('width', width)
                    .attr('height', height)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            g.append('g').attr('class', 'chart-area');

            // Chart area

            g = svg.select('g');

            g.select('.chart-area').append('path')
                    .datum(function (d) { return d; })
                    .attr('d', line);

        });
    }

    sparkline.margin = function (d) {
        if (!arguments.length) {
            return margin;
        }
        margin = d;
        return sparkline;
    };

    sparkline.width = function (d) {
        if (!arguments.length) {
            return width;
        }
        width = d;
        return sparkline;
    };

    sparkline.height = function (d) {
        if (!arguments.length) {
            return height;
        }
        height = d;
        return sparkline;
    };

    sparkline.x = function (d) {
        if (!arguments.length) {
            return xAccessor;
        }
        xAccessor = d;
        return sparkline;
    };

    sparkline.y = function (d) {
        if (!arguments.length) {
            return yAccessor;
        }
        yAccessor = d;
        return sparkline;
    };

    sparkline.xDomain = function (d) {
        if (!arguments.length) {
            return xDomain; // TODO: xDomain.call()?
        }
        xDomain = d == null ? d : d3.functor(d);
        return sparkline;
    };

    sparkline.yDomain = function (d) {
        if (!arguments.length) {
            return yDomain; // TODO: yDomain.call()?
        }
        yDomain = d == null ? d : d3.functor(d);
        return sparkline;
    };

    sparkline.interpolate = function (d) {
        if (!arguments.length) {
            return interpolate;
        }
        interpolate = d;
        return sparkline;
    };

    return sparkline;

};
