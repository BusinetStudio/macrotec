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
        $('.select2').select2({
          templateResult: function (data, container) {
            if (data.element) {
              $(container).addClass($(data.element).attr("class"));
            }
            return data.text;
          }
        });
        $('.select2multiple').select2({
          tags: true,
          tokenSeparators: [',', '♪']
        })
        function ubigeoAsign(){
          $('#provincias option').each(function() {
            if($(this).attr('data-padre') == $('#departamentos').val()){
              $(this).removeClass('d-none');
            }else{
              if(!$(this).hasClass('d-none')){
                $(this).addClass('d-none');
              }
            }
          })
          $('#distritos option').each(function() {
           
            if($(this).attr('data-padre') == $('#provincias').val()){
              $(this).removeClass('d-none');
              $(this).addClass('d-block');
            }else{
              if(!$(this).hasClass('d-none')){
                $(this).addClass('d-none');
                $(this).removeClass('d-block');
              }
            }
          })
        }
        if($('form.ubiGeoForm')){
          ubigeoAsign();
        }
        $('form.ubiGeoForm').on("change", function(){
          ubigeoAsign();
        }); 


        //Login
        $( "#loginForm" ).submit(function( event ) {
          var form = $(this);
          var url = form.attr('action');
          event.preventDefault();
          $.ajax({
            method: "POST",
            url: url,
            data: form.serialize(),
            error: function(data){
              var response = JSON.parse(data.responseText)
              form.find('#errorResponse').text(response.error)
              
            },
            success: function(data){
              window.location.replace(data.redirect)
            }
          })
        });

        $( "form.validate" ).submit(function( event ) {
          var form = $(this);
          var url = form.attr('action');
          event.preventDefault();
          $.ajax({
            method: "POST",
            url: url,
            data: form.serialize(),
            error: function(data){
              var response = JSON.parse(data.responseText)
              form.find('#errorResponse').text(response.error)
              
            },
            success: function(data){
              window.location.replace(data.redirect)
              
            }
          })
        });


        $('#dniAutocomplete input[name="dni"]').on('change', function(){
          $.ajax({
            method: "POST",
            url: '/ventas/clientes-potenciales/getByDni',
            data: {dni: $(this).val()},
            error: function(data){
              console.log(data)
            },
            success: function(data){
              if(data.length > 0){
                $.each(data[0], function(i, e){
                  $('input[name="'+i+'"]').val(e);
                })
              }
              
            }
          })
        })


        //tareas
        function tareas(){ 
          $('#tareasWrap .checkbox input.peer').click(function(){
            if($(this).is(':checked')){
              $.ajax({
                type: "POST",
                url: '/ventas/tareas/estado',
                data: {
                  id: $(this).attr('id'),
                  estado: 'Completado'
                },
                dataType: 'json'
              });
              $(this).closest('.list-group-item').find('label.peers span.peer-greed').wrapInner('<del></del>');
              $('#tareasCompletadas').prepend($(this).closest('.list-group-item'));
            }else{
              $('#tareas').prepend($(this).closest('.list-group-item'));
              $(this).closest('.list-group-item').find('del').contents().unwrap();
              $.ajax({
                type: "POST",
                url: '/ventas/tareas/estado',
                data: {
                  id: $(this).attr('id'),
                  estado: 'Pendiente'
                },
                dataType: 'json'
              });
              
            }
          })
        }
        tareas();
        $('#tareasWrap').on('change', function(){
          tareas();
        })
        
        $('#mostrarTareas').click(function(){
          $(this).addClass('d-none');$('#ocultarTareas').removeClass('d-none');
          $('#tareasCompletadas').toggleClass('d-none')
          tareas();
        })
        $('#ocultarTareas').click(function(){
          $(this).addClass('d-none');$('#mostrarTareas').removeClass('d-none');
          $('#tareasCompletadas').toggleClass('d-none')
          tareas();
        })
                              
      
}())
