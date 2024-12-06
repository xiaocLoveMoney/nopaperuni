export var get_chart1_options = function (res) {
    var option = {
        series: [{
            type: 'gauge',
            anchor: {
                show: true,
                showAbove: true,
                size: 18,
                itemStyle: {
                    color: '#FAC858'
                }
            },
            pointer: {
                icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                width: 8,
                length: '80%',
                offsetCenter: [0, '8%']
            },
            progress: {
                show: true,
                overlap: true,
                roundCap: true
            },
            axisLine: {
                roundCap: true
            },
            data: [{
                value: res.data[0].sum || 0,
                name: res.data[0].status || '事假未批准',
                title: {
                    offsetCenter: ['0%', '80%']
                },
                detail: {
                    offsetCenter: ['0%', '100%']
                }
            }, {
                value: res.data[1].sum || 0,
                name: res.data[1].status || '病假未批准',
                title: {
                    offsetCenter: ['80%', '80%']
                },
                detail: {
                    offsetCenter: ['80%', '100%']
                }
            }, {
                value: res.data[2].sum || 0,
                name: res.data[2].status || '事假已批准',
                title: {
                    offsetCenter: ['-80%', '80%']
                },
                detail: {
                    offsetCenter: ['-80%', '100%']
                }
            }, {
                value: res.data[3].sum || 0,
                name: res.data[3].status || '病假已批准',
                title: {
                    offsetCenter: ['80%', '-100%']
                },
                detail: {
                    offsetCenter: ['80%', '-120%']
                }
            }, {
                value: res.data[4].sum || 0,
                name: res.data[4].status || '正常到校',
                title: {
                    offsetCenter: ['-80%', '-100%']
                },
                detail: {
                    offsetCenter: ['-80%', '-120%']
                }
            }],
            detail: {
                width: 40,
                height: 14,
                fontSize: 14,
                color: '#fff',
                backgroundColor: 'inherit',
                borderRadius: 3,
                formatter: '{value}人'
            }
        }]
    }
    return option
}