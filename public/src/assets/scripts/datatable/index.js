import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';
import 'datatables.net-responsive-bs4';
export default (function () {
  /*$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var filtros = []
        $('.tabla-filtro').each(function(){
          filtros.push($(this).val())
        });
        function isInArray(value, array) {
          return array.indexOf(value) > -1;
        }
        console.log(data)
        console.log(filtros)
        if ( isInArray(data, filtros) )
        {
            return true;
        }
        return false;
    }
  );*/
  var table = $('#dataTable').DataTable({
    language: {
      "sProcessing":     "Procesando...",
      "sLengthMenu":     "Mostrar _MENU_ registros",
      "sZeroRecords":    "No se encontraron resultados",
      "sEmptyTable":     "Ningún dato disponible en esta tabla",
      "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
      "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
      "sInfoPostFix":    "",
      "sSearch":         "Buscar:",
      "sUrl":            "",
      "sInfoThousands":  ",",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
          "sFirst":    "Primero",
          "sLast":     "Último",
          "sNext":     "Siguiente",
          "sPrevious": "Anterior"
      },
      "oAria": {
          "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
          "sSortDescending": ": Activar para ordenar la columna de manera descendente"
      }
    },
    ordering: true,
    responsive: true
  });
  $( '.tabla-filtro' ).on( 'change', function () {
    table
        .column( $(this).data('index') )
        .search( this.value )
        .draw();
  });

  $('#dataTable .editar').click(function(){
    var elId = $(this).attr('data-id');
    var nombre = $(this).attr('data-nombre');
    var codigo = $(this).attr('data-codigo');
    $('#editarModal #elId').val(elId);
    $('#editarModal input[name="nombre"]').val(nombre);
    $('#editarModal input[name="codigo"]').val(codigo);
  });
  $('#dataTable .borrar').click(function(){
    return confirm("¿Estas seguro que desea eliminarlo?");
  });
}());
