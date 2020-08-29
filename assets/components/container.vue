<template>
    <div v-if="data">
        <h1>Weather</h1>

        <dl>
            <dt>Time</dt><dd>{{ data.time }}</dd>
            <dt>Indoor temperature</dt><dd>{{ data.current.insideTemp.toFixed(1) }}°C</dd>
            <dt>Indoor humidity</dt><dd>{{ data.current.insideHumidity }}%</dd>
            <dt>Outdoor temperature</dt><dd>{{ data.current.temp.toFixed(1) }}°C</dd>
            <dt>Outdoor humidity</dt><dd>{{ data.current.humidity }}%</dd>
        </dl>

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
    </div>
</template>

<script>
import { Plotly } from 'vue-plotly';

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
        Plotly,
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
</style>
