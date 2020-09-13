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
                        <span class="value temp">{{ data.current.insideHumidity.toFixed(1) }}</span>
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
                        <span class="value temp">{{ data.current.humidity.toFixed(1) }}</span>
                        <span class="unit">%</span>
                    </span>
                </span>
            </div>
        </div>

        <!--
        <Plotly
            :data="wind"
            :layout="layout"
            :scroll-zoom="false"
            :display-mode-bar="false"
            :mode-bar-buttons-to-remove="['select2d', 'zoom2d']"
            :responsive="true"
            class="graph"
        />

        <Plotly
            :data="insideTemp"
            :layout="layout"
            :scroll-zoom="false"
            :display-mode-bar="false"
            :mode-bar-buttons-to-remove="['select2d', 'zoom2d']"
            :responsive="true"
            class="graph"
        />

        <Plotly
            :data="temp"
            :layout="layout"
            :scroll-zoom="false"
            :display-mode-bar="false"
            :mode-bar-buttons-to-remove="['select2d', 'zoom2d']"
            :responsive="true"
            class="graph"
        />
        -->
    </div>
</template>

<script>
// import { Plotly } from 'vue-plotly';

async function mounted() {
    const res = await fetch('./daily.json');

    if (!res.ok) {
        return;
    }

    const data = await res.json();
    this.data = data;

    this.wind = [{
        r: data.day.map((day) => day.windSpeed),
        theta: data.day.map((day) => day.windDir),
        text: data.day.map((day) => day.time),
        mode: 'markers',
        marker: {
            color: data.day.map((day) => day.windSpeed),
            colorscale: 'Portland',
            size: 10,
        },
        type: 'scatterpolar',
    }];

    this.temp = [{
        x: data.day.map((day) => day.time),
        y: data.day.map((day) => day.temp),
        name: 'Temperature',
    }, {
        x: data.day.map((day) => day.time),
        y: data.day.map((day) => day.dewpoint),
        name: 'Dew point',
    }];

    this.insideTemp = [{
        x: data.day.map((day) => day.time),
        y: data.day.map((day) => day.insideTemp),
    }];

    console.log(data.day);
}

export default {
    components: {
        // Plotly,
    },
    data() {
        return {
            data: null,
            wind: null,
            insideTemp: null,
            temp: null,
            layout: {
                xaxis: {
                    fixedrange: true,
                },
                yaxis: {
                    fixedrange: true,
                    ticksuffix: '°C',
                },
                polar: {
                    // barmode: 'overlay',
                    radialaxis: {
                        dtick: 1,
                        ticksuffix: 'km/h',
                    },
                    angularaxis: {
                        // categoryarray: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
                        tickvals: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5],
                        ticktext: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
                        rotation: 90,
                        direction: 'clockwise',
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
        margin: 0 0 .5rem 0;
        color: var(--shadow);
        font-size: .9rem;
        font-weight: bold;
    }

    .icon {
        fill: var(--shadow);
        margin: 0 .5rem 0 0;
    }
}

.tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    grid-gap: 1rem;
    padding: 1rem;
}

.tile {
    background: var(--primary);
    display: inline-flex;
    flex-direction: column;
    padding: 0 0 .5rem 0;
    align-items: center;
    justify-content: center;
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
    color: var(--highlight-strong);
    font-size: 1rem;
    font-weight: bold;

    .icon {
        width: 1rem;
        height: 1rem;
        fill: var(--highlight-strong);
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
        font-size: 2.5rem;
    }

    .unit {
        margin: .25rem 0 0 .25rem;
        color: var(--highlight);
        font-weight: bold;
    }

    .icon {
        width: 1.25rem;
        height: 1.25rem;
        margin: 0 1.5rem 0 0;
        fill: var(--highlight-strong);
    }
}
</style>
