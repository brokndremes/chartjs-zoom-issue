import logo from './logo.svg';
import './App.css';
import React, {useState} from "react";
import Chart from "chart.js/auto";
import {CategoryScale} from "chart.js";
import {Scatter, Bar} from "react-chartjs-2";
import Ht from "chartjs-plugin-dragdata"
import {DemoData} from './DemoPlotData';
import Zoom from "chartjs-plugin-zoom"


Chart.register(CategoryScale);
Chart.register(Ht)
Chart.register(Zoom)

const MultiArrayData = {
    subarrays: [
        {
            arrayId: 0,
            arrayName: "One",
            imagePath: "example_points.png",
            showPicks: true,
            y: [
                29.663, 28.839, 28.289, 27.465, 26.641, 25.817, 24.719, 23.895,
                23.345, 22.521, 21.148, 18.127, 20.324, 15.655, 15.106, 14.282,
                13.458, 12.634, 11.535, 10.986, 10.162, 9.613, 9.0637, 8.5144,
                8.2397, 7.6904, 7.1411, 6.5917, 6.0424, 5.4931, 5.2185, 4.9438,
                4.6691, 12.084, 14.831, 14.007, 21.697
            ],
            x: [
                0.00787, 0.00787, 0.00787, 0.00761, 0.00761, 0.00761, 0.00734, 0.00734,
                0.00734, 0.00734, 0.00682, 0.00656, 0.00656, 0.00629, 0.00629, 0.00629,
                0.00629, 0.00603, 0.00603, 0.00603, 0.00577, 0.00577, 0.00551, 0.00551,
                0.00551, 0.00524, 0.00498, 0.00472, 0.00446, 0.00419, 0.00393, 0.00367,
                0.00341, 0.00603, 0.00629, 0.00629, 0.00708
            ],
        },
    ],
    activeArray: 0,
    maxFrequency: 30,
    maxSlowness: 0.0125,
    pickPointRadius: 5,
    mirrorX: true,
    mirrorY: false,
    swapAxes: false,
}
const image = new Image();
image.src = 'example_points.png';


function OneDPlot() {
    const [datasets, setDatasets] = useState(MultiArrayData.subarrays.map(function (subarray, arrayIndex) {
        return subarray.x.map(function (e, i) {
            if (MultiArrayData.swapAxes) {
                return {
                    x: MultiArrayData.subarrays[arrayIndex].y[i],
                    y: e,
                }
            } else {
                return {
                    x: e,
                    y: MultiArrayData.subarrays[arrayIndex].y[i],
                }
            }
        })
    }))
    const data2 = {
        datasets: datasets.map(function (dataset, datasetIndex) {
            return {
                data: dataset,
                borderColor: '9B9B9B',
                borderWidth: 1,
                pointRadius: 5,
                pointBackgroundColor: '#cc0000',
                pointBorderWidth: 0,
                spanGaps: false,
                hidden: !MultiArrayData.subarrays[datasetIndex].showPicks
            }
        })
    }
    const activeArrayId = MultiArrayData.activeArray;
    const backgroundImagePlugin = {
        id: 'customCanvasBackgroundImage',
        beforeDraw: (chart, args, pluginOptions) => {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea
            if (image.complete) {
                ctx.save()
                // Flip X Axis:
                // ctx.translate(chart.width + chartArea.left/3, 0);
                // ctx.scale(-1, 1)
                // End Flip X Axis
                // Flip Y Axis:
                // ctx.translate(0, chartArea.height + chartArea.top*2);
                // ctx.scale(1, -1)
                // End Flip Y Axis
                const horizontalFlip = false
                const verticalFlip = false
                const xPos = chartArea.left
                const yPos = chartArea.top
                ctx.drawImage(image, chartArea.left, chartArea.top, chartArea.width, chartArea.height);
                ctx.restore();
            } else {
                image.onload = () => chart.draw();
            }
        }
    };
    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                max: MultiArrayData.swapAxes ? MultiArrayData.maxSlowness : MultiArrayData.maxFrequency,
                min: 0,
                reverse: MultiArrayData.mirrorY,
            },
            x: {
                max: MultiArrayData.swapAxes ? MultiArrayData.maxFrequency : MultiArrayData.maxSlowness,
                min: 0.00,
                reverse: MultiArrayData.mirrorX,
            }
        },
        plugins: {
            zoom: {
                limits: {
                    x: {
                        min: 0,
                        max: 0.0125,
                    },
                    y: {
                        min: 0,
                        max: 30,
                    }
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                    modifierKey: 'shift',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                        modifierKey: 'shift',
                    },
                }
            },
            dragData: {
                dragX: true,
                dragY: true,
                onDragStart: function (e) {
                    // If a modifier key is being pressed, don't drag
                    if (e.shiftKey || e.ctrlKey || e.altKey) {
                        return false
                    }
                },
            },
            title: {
                display: true,
                text: "Custom Chart Title",
            },
            legend: {
                display: false,
            },
        },
        onClick: (e) => {
            const altKey = e.native.altKey;
            const ctrlKey = e.native.ctrlKey;
            const shiftKey = e.native.shiftKey;
            const dataX = e.chart.scales.x.getValueForPixel(e.x);
            const dataY = e.chart.scales.y.getValueForPixel(e.y);
            if (!ctrlKey && !altKey && shiftKey) {
                datasets[MultiArrayData.activeArray].push({
                    x: dataX,
                    y: dataY,
                })
                e.chart.update()
            }
            if (altKey && !ctrlKey && !shiftKey) {
                const elements = e.chart.getElementsAtEventForMode(e, 'nearest', {
                    intersect: true,
                    includeInvisible: false
                }, true).filter(function (e) {
                    return e.datasetIndex === MultiArrayData.activeArray;
                })
                if (elements.length <= 0) {
                    return false
                } else {
                    const element = elements[0];
                    datasets[MultiArrayData.activeArray].splice(element.index, 1)
                    e.chart.update()
                }
            }
        }
    };

    return (
        <>
            <Scatter
                data={data2}
                options={options}
                plugins={[backgroundImagePlugin]}
            />
        </>
    );
}


function App() {
    return (
        <div className="App">
            <OneDPlot/>
        </div>
    );
}

export default App;
