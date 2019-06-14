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
            success: function(){
              window.location.replace('/home')
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
                              
      
}())
