<script>
import { Bar } from 'vue-chartjs';

function mounted() {
    this.renderChart({ ...this.data, datasets: this.datasets || this.data.datasets }, this.options);
}

export default {
    extends: Bar,
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
