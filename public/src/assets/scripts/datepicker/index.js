import * as $ from 'jquery';
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';

export default (function () {
  $('.start-date').datepicker({
    format: 'yyyy-mm-dd'
  });
  $('.end-date').datepicker();
  $('.time-date').mdtimepicker({
    timeFormat: 'hh:mm:ss',
    format: 'hh:mm:ss',
  });
}())
