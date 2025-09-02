<script>
import { Bar } from 'vue-chartjs';

export default {
  name: 'SleepChart',
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartData: {
      handler() {
        if (this.$data._chart) {
          this.$data._chart.destroy();
        }
        this.renderChart(this.chartData, this.options);
      },
      deep: true
    }
  }
};
</script>