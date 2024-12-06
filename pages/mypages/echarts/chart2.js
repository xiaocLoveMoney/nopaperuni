export var get_chart2_options = function (res) {
    var option = {
        legend: {},
        toolbox: {
            // feature: {
            //     dataZoom: {
            //         yAxisIndex: false
            //     },
            //     saveAsImage: {
            //         pixelRatio: 2
            //     }
            // }
        },
        tooltip: {
        },
        grid: {
            bottom: 90
        },
        dataZoom: [{
            type: 'inside'
        },
            {
                type: 'slider'
            }
        ],
        xAxis: {
            data: Array.from(new Set(res.data.map(item => item.date))),
            silent: false,
            splitLine: {
                show: false
            },
            splitArea: {
                show: false
            }
        },
        yAxis: {
            splitArea: {
                show: false
            }
        },
        // legend: {
        //     data: ['在校人数', '请假人数']
        // },
        series: [{
            name: '正常到校',
            type: 'bar',
            data: res.data.filter(item => item.status == '正常到校').map(item => item.sum),
            stack: 'stack1',
            large: true,
        }, {
            name: '病假',
            type: 'bar',
            data: res.data.filter(item => item.status == "病假").map(item => item.sum),
            stack: 'stack1',
            large: true,
        }, {
            name: '事假',
            type: 'bar',
            data: res.data.filter(item => item.status == "事假").map(item => item.sum),
            stack: 'stack1',
            large: true,
        }, {
            name: '迟到',
            type: 'bar',
            data: res.data.filter(item => item.status == "迟到").map(item => item.sum),
            stack: 'stack1',
            large: true,
        }, {
            name: '早退',
            type: 'bar',
            data: res.data.filter(item => item.status == "早退").map(item => item.sum),
            stack: 'stack1',
            large: true,
        }]
    }

    return option
}