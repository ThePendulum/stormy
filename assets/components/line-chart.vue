<script>
import { Line } from 'vue-chartjs';

function mounted() {
    this.renderChart(this.data, {
        ...this.options,
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
            xAxes: [{
                type: 'time',
                format: 'HH:mm',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        minute: 'HH:mm',
                        hour: 'HH:mm',
                    },
                },
            }],
        },
    });
}

export default {
    extends: Line,
    props: {
        data: {
            type: Object,
            default: null,
        },
        options: {
            type: Object,
            default: null,
        },
    },
    mounted,
};
</script>
