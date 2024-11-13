import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useWebSocket } from '../services/WebSocketContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const Plot: React.FC = () => {
    const data = useWebSocket();
    const [labels, setLabels] = useState<string[]>([]);
    const [prices, setPrices] = useState<number[]>([]);
    const [options, setOptions] = useState({});

    useEffect(() => {
        if (data) {
            setLabels((prev) => {
                const updatedLabels = [...prev, data.Timestamp];
                return updatedLabels.length > 100 ? updatedLabels.slice(-100) : updatedLabels;
            });

            setPrices((prev) => {
                const updatedPrices = [...prev, data.Last];
                return updatedPrices.length > 100 ? updatedPrices.slice(-100) : updatedPrices;
            });
        }
    }, [data]);

    const updateLastPointAnnotation = () => {
        if (labels.length > 0 && prices.length > 0) {
            setOptions({
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            display: false,
                        },
                    },
                    y: {
                        grid: {
                            display: true, 
                        },
                        ticks: {
                            callback: function (value: any) {
                                return currencyFormatter.format(value); 
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    annotation: {
                        annotations: {
                            lastPoint: {
                                type: 'label',
                                xValue: labels[labels.length - 1],
                                yValue: prices[prices.length - 1],
                                backgroundColor: 'rgba(8, 92, 252, 0.7)',
                                content: `Last: ${currencyFormatter.format(prices[prices.length - 1])}`,
                                font: {
                                    size: 12,
                                },
                                position: 'end',
                                xAdjust: 0,
                                yAdjust: 0
                            },
                        },
                    }
                }
            });
        }
    };

    useEffect(() => {
        updateLastPointAnnotation();
    }, [labels, prices]);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Last Price',
                data: prices,
                borderColor: '#085CFC',
                tension: 0.6,
                pointRadius: 0,
            }
        ]
    };

    return <Line data={chartData} options={options} />;
};

export default Plot;