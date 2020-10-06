<template>
    <div v-if="data">
        <header class="header">
            <span class="detail updated"><Icon icon="clock2" />{{ data.time }}</span>
            <span class="detail uptime"><Icon icon="stopwatch" />{{ data.serverUptime }}</span>
        </header>

        <div class="tiles">
            <div class="tile temp-indoor">
                <h3 class="tile-label">Indoor<Icon icon="home6" /></h3>

                <span class="tile-info">
                    <Icon icon="temperature" />

                    <span class="section">
                        <span class="value temp">{{ data.current.insideTemp.toFixed(1) }}</span>
                        <span class="unit">°C</span>
                    </span>
                </span>

                <span class="tile-info">
                    <Icon icon="droplet" />

                    <span class="section">
                        <span class="value temp">{{ Math.round(data.current.insideHumidity) }}</span>
                        <span class="unit">%</span>
                    </span>
                </span>
            </div>

            <div class="tile temp-outdoor">
                <h3 class="tile-label">Outdoor<Icon icon="tree" /></h3>

                <span class="tile-info">
                    <Icon icon="temperature" />

                    <span class="section">
                        <span class="value temp">{{ data.current.temp.toFixed(1) }}</span>
                        <span class="unit">°C</span>
                    </span>
                </span>

                <span class="tile-info">
                    <Icon icon="droplet" />

                    <span class="section">
                        <span class="value temp">{{ Math.round(data.current.humidity) }}</span>
                        <span class="unit">%</span>
                    </span>
                </span>
            </div>

            <div class="tile wind">
                <h3 class="tile-label">Wind<Icon icon="weather-windy" /></h3>

                <span class="tile-info">
                    <Icon icon="fan" />

                    <span class="section">
                        <span class="value temp">{{ data.current.windSpeed.toFixed(1) }}</span>
                        <span class="unit">km/h</span>
                    </span>
                </span>

                <span class="tile-info">
                    <Icon
                        icon="compass3"
                        :style="{
                            transform: `rotate(${data.current.windDir - 45}deg)`,
                            disabled: data.current.windSpeed === 0
                        }"
                    />

                    <span class="section">
                        <span class="value temp">{{ data.current.windDirText || 'N/A' }}</span>
                        <span class="unit">{{ data.current.windDir === null ? 'N/A' : Math.round(data.current.windDir) }}°</span>
                    </span>
                </span>
            </div>

            <div class="tile rain">
                <h3 class="tile-label">Rain<Icon icon="weather-rain" /></h3>

                <span class="tile-info">
                    <Icon icon="umbrella" />

                    <span class="section">
                        <span class="value temp">{{ data.current.rainRate.toFixed(2) }}</span>
                        <span class="unit">cm/h</span>
                    </span>
                </span>

                <span class="tile-info">
                    <Icon icon="bucket2" />

                    <span class="section">
                        <span class="value temp">{{ data.current.rainToday.toFixed(2) }}</span>
                        <span class="unit">cm</span>
                    </span>
                </span>
            </div>

            <div class="tile sun">
                <h3 class="tile-label">Sun<Icon icon="sun" /></h3>

                <span class="tile-info">
                    <Icon icon="weather-cloud-sun" />

                    <span class="section">
                        <span class="value temp">{{ data.current.solarRadiation.toFixed(1) }}</span>
                        <span class="unit">W/m²</span>
                    </span>
                </span>

                <span class="tile-info">
                    <Icon icon="sun3" />

                    <span class="section">
                        <span class="value temp">{{ data.current.UV.toFixed(1) }}</span>
                        <span class="unit">idx</span>
                    </span>
                </span>
            </div>
        </div>

        <div class="charts">
            <div class="chart">
                <LineChart
                    :datasets="temp.datasets"
                    :options="temp.options"
                />
            </div>

            <div class="chart">
                <BarChart
                    :datasets="rain.datasets"
                    :options="rain.options"
                />
            </div>

            <div class="chart">
                <LineChart
                    :datasets="wind.datasets"
                    :options="wind.options"
                />
            </div>
        </div>
    </div>
</template>

<script>
// import dayjs from 'dayjs';

import BarChart from './bar-chart.vue';
import LineChart from './line-chart.vue';

const timeAxis = {
    type: 'time',
    format: 'HH:mm',
    time: {
        unit: 'hour',
        displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
        },
    },
};

async function mounted() {
    const res = await fetch('./daily.json');

    if (!res.ok) {
        return;
    }

    const data = await res.json();
    this.data = data;

    this.temp = {
        options: {
            ...this.chartOptions,
            tooltips: {
                callbacks: {
                    label: (item) => `${item.yLabel.toFixed(2)} °C`,
                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: (value) => `${value} °C`,
                    },
                }],
                xAxes: [timeAxis],
            },
        },
        datasets: [
            {
                label: 'Outdoor Temperature',
                borderColor: '#8ba',
                backgroundColor: '#8ba',
                data: this.data.day.map((day) => ({
                    x: day.time,
                    y: day.temp,
                })),
            },
            {
                label: 'Dew Point',
                borderColor: '#a8b',
                backgroundColor: '#a8b',
                data: this.data.day.map((day) => ({
                    x: day.time,
                    y: day.dewpoint,
                })),
            },
        ],
    };

    this.rain = {
        options: {
            ...this.chartOptions,
            tooltips: {
                callbacks: {
                    label: (item) => `${item.yLabel.toFixed(2)} cm`,
                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: (value) => `${value.toFixed(2)} cm`,
                    },
                }],
                xAxes: [timeAxis],
            },
        },
        datasets: [
            {
                label: 'Rain',
                backgroundColor: '#8ab',
                data: this.data.day.map((day) => ({
                    x: day.time,
                    y: day.rain,
                })),
            },
        ],
    };

    this.wind = {
        options: {
            ...this.chartOptions,
            tooltips: {
                callbacks: {
                    label: (item) => `${item.yLabel.toFixed(2)} km/h`,
                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: (value) => `${value.toFixed(2)} km/h`,
                    },
                }],
                xAxes: [timeAxis],
            },
        },
        datasets: [
            {
                label: 'Wind Speed',
                borderColor: '#8ba',
                backgroundColor: '#8ba',
                lineTension: 0.2,
                data: this.data.day.map((day) => ({
                    x: day.time,
                    y: day.windSpeed,
                })),
            },
            {
                label: 'Gust Speed',
                backgroundColor: 'rgba(255, 150, 220, 0.1)',
                pointBackgroundColor: '#b8a',
                borderColor: 'rgba(187, 136, 170, 0.5)',
                lineTension: 0.2,
                fill: true,
                data: this.data.day.map((day) => ({
                    x: day.time,
                    y: day.windGust,
                })),
            },
        ],
    };
}

export default {
    components: {
        BarChart,
        LineChart,
    },
    data() {
        return {
            data: null,
            temp: null,
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0,
                },
                elements: {
                    point: {
                        radius: 3,
                        hoverRadius: 5,
                    },
                    line: {
                        fill: false,
                    },
                },
            },
        };
    },
    mounted,
};
</script>

<style lang="scss" scoped>
.graph {
    width: 100%;
    max-width: 50rem;
    height: 30rem;
}

.header {
    padding: 1rem;

    .detail {
        display: flex;
        align-items: center;
        margin: 0 0 1rem 0;
        color: var(--shadow);
        font-size: .9rem;
        font-weight: bold;
    }

    .icon {
        fill: var(--shadow);
        margin: -.2rem 1rem 0 0;
    }
}

.tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    grid-gap: 1rem;
    padding: 1rem;
    margin: 0 0 1rem 0;
}

.tile {
    background: var(--primary);
    display: inline-flex;
    flex-direction: column;
    padding: 0 0 .5rem 0;
    align-items: center;
    box-shadow: 0 0 3px var(--shadow-weak);
}

.tile-label {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: .75rem 1rem;
    margin: 0 0 .5rem 0;
    background: var(--shadow-hint);
    color: var(--highlight-extreme);
    font-size: 1rem;
    font-weight: bold;

    .icon {
        width: 1rem;
        height: 1rem;
        fill: var(--highlight-extreme);
    }
}

.tile-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: .5rem 1rem;

    .section {
        display: flex;
        align-items: flex-start;
    }

    .value {
        color: var(--text-light);
        font-size: 2rem;
    }

    .unit {
        width: 2.5rem;
        margin: .3rem 0 0 .5rem;
        color: var(--highlight);
        font-weight: bold;
        text-align: right;
    }

    .icon {
        width: 1.25rem;
        height: 1.25rem;
        margin: 0 1rem 0 0;
        fill: var(--highlight-strong);

        &.disabled {
            fill: var(--highlight-weak);
        }
    }
}

.charts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40rem, 1fr));
    grid-gap: 2rem 4rem;
    padding: 1rem;
}

.chart {
    width: 100%;
    height: 25rem;
}

@media(max-width: 700px) {
    .charts {
        grid-template-columns: minmax(10rem, 1fr);
    }
}
</style>
