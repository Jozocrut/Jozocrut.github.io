if('serviceWorker' in navigator){
    console.log('Puedes usar los servidores del navegador');

    navigator.serviceWorker.register('./sw.js')
                                                    .then(res => console.log('serviceworker cargando correctamente', res))
                                                    .catch(err => console.log('serviceworker no se a podido registrar', res))
}else{
        console.log('No Puedes usar los serviceworker del navegador');
}
//scroll suave 
$(document).ready(function(){
    $("#menu a").click(function(e){
        e.preventDefault();
        $("html,body").animate({
            scrollTop: $($(this).attr('href')).offset().top
        });
        return false;
    });
});
