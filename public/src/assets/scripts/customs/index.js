import * as $ from 'jquery';

export default (function () {
        

        //Nueva Reserva
        $('#tipo_reserva').change(function(){
            if($(this).val() == 'nuevo'){
                $('#nuevo_reserva').removeClass('d-none');
                $('#cliente_reserva').addClass('d-none');
            }else if($(this).val() == 'cliente'){
                $('#cliente_reserva').removeClass('d-none');
                $('#nuevo_reserva').addClass('d-none');
            }
        })

        //Select2
        $('.select2').select2();
}())
