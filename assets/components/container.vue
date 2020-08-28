<template>
    <div v-if="data">
        <h1>Weather</h1>

        <dl>
            <dt>Indoor temperature</dt><dd>{{ data.current.insideTemp.toFixed(1) }}°C</dd>
            <dt>Indoor humidity</dt><dd>{{ data.current.insideHumidity }}%</dd>
            <dt>Outdoor temperature</dt><dd>{{ data.current.temp.toFixed(1) }}°C</dd>
            <dt>Outdoor humidity</dt><dd>{{ data.current.humidity }}%</dd>
        </dl>
    </div>
</template>

<script>
async function mounted() {
    const res = await fetch('./data.json');

    if (res.ok) {
        this.data = await res.json();
        console.log(this.data);
    }
}

export default {
    data() {
        return {
            data: null,
        };
    },
    mounted,
};
</script>
