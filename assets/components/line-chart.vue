<script>
import { Line } from 'vue-chartjs';

function mounted() {
    this.renderChart({ ...this.data, datasets: this.datasets || this.data.datasets }, this.options);
}

export default {
    extends: Line,
    props: {
        data: {
            type: Object,
            default: null,
        },
        datasets: {
            type: Array,
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
