import Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import Exporting from 'highcharts/modules/exporting';

if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
    Drilldown(Highcharts);
}

if (!Highcharts.Chart.prototype.exportChart) {
    Exporting(Highcharts);
}

export default Highcharts;
