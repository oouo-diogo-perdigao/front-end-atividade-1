
//Utilizando uma API de Geolocalização para pegar a cidade e se estiver no celular pegar o bairro
if("geolocation" in navigator){
	console.log("geolocation Esta disponivel");
	navigator.geolocation.getCurrentPosition(function(p){
		var url = 'https://nominatim.openstreetmap.org/reverse?lat='+p.coords.latitude+'&lon='+p.coords.longitude+"&format=jsonv2";
		var request = new XMLHttpRequest();
		request.onload = function(e){
			var add = request.response["address"]["city"];
			//console.warn(p.coords.accuracy);
			if (p.coords.accuracy <= 500) {
				add += " - " + request.response["address"]["suburb"];
			}
			$("#servidor").html(add);
		};
		request.addEventListener("error", function(e) { console.log(e); });
		request.responseType = 'json';
		request.open('GET', url);
		request.send();
	});
}

//Utilizando uma API de canvas para se criar um jogo da velha, com uma IA inclusa para nao se jogar sozinho
var classTable;
$(document).ready(function() {
	classTable = new ClassTable("myCanvas", 400, 400);
	$("#IA").click(function(){
		classTable.togleIA($(this).is(":checked"));
	});
	$("#IA").trigger("click");
});