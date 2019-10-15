var ClassTable = function(canvasId, width, height){
	var self = this;
	/**
	 * Canvas
	 */
	var canvas;
	/**
	 * Areá de desenho
	 */
	var ctx;
	var cWidth;
	var cHeight;
	/**
	 * Matriz com os status das peças
	 */
	var table;
	/**
	 * Jogadas Restantes
	 */
	var movies;
	/**
	 * Jogador atual 1 = xis -1 = bol
	 */
	var jogador;
	var IA = false;
	self.togleIA = function(enable){
		IA = enable;
	}
	/**
	 * zera o tabuleiro
	 */
	self.reset = function () {
		table = new Array(
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		);
		
		movies = 9;
		jogador = 1; //xis
		movies = 9;
		showTable();
	}
	var printMatriz = function(matriz) {
		for (var i = 0; i < 3; i++) {
			console.log(matriz[i][0]+" "+matriz[i][1]+" "+matriz[i][2]+"       "+i);
		}
	};
	/**
	 * Função principal de jogada
	 * @param {boolean} x linha 
	 * @param {boolean} y coluna
	 */
	var play = function(x, y) {
		if (movies) {
			//Movimento valido
			if (table[x][y] == 0) {
				if (jogador == 1) { drawXis(x, y); table[x][y] = 1; }
				else{				drawBol(x, y); table[x][y] = -1; }
			}
			else{
				return;
			}
			movies--;
			
			//Verificação de vitoria
			if (movies <= 4 ) {
				var victory = wins();
				if (victory.winner) {
					console.warn("Vitoria de "+ victory.winner);
					movies = 0;
					drawLine(victory.ini, victory.end);
					drawVictory(victory.winner);
					return;
				}
			}
			jogador = -jogador;
			//Jogadas do jogador completas
			
			
			//Jogadas da Ia, se habilitada, só joga com bola
			if (IA) {
				var play = IAMiniMaxPoda(false);
				movies--;
				if (table[play[0]][play[1]] == 0) {
					if (jogador == 1) { drawXis(play[0], play[1]); table[play[0]][play[1]] = 1; }
					else{				drawBol(play[0], play[1]); table[play[0]][play[1]] = -1; }
				}
				//Verificação de vitoria
				if (movies <= 4 ) {
					var victory = wins();
					if (victory.winner) {
						console.warn("Vitoria de "+ victory.winner);
						movies = 0;
						drawLine(victory.ini, victory.end);
						drawVictory(victory.winner);
					}
				}
				jogador = -jogador;
			}
		}
	};
	
	//Funções de IA e calculo
	/**
	 * Uma IA de calculo de dados
	 * @param {boolean} turnXis 
	 */
	var IAMiniMaxPoda = function( turnXis ){
		// Matriz de Entrada que -1 bolinha, 0 vasio, 1 xis
		var jogadas = new Array(
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		);
		var calculo = new Array(
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		);
		
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				jogadas [i][j] = table[i][j];
			}
		}
		
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (jogadas[i][j] == 0) {
					jogadas[i][j] = turnXis?1:-1;
					//printMatriz(jogadas);
					calculo[i][j] = -fitness(jogadas);
					//console.warn(calculo[i][j]);
					jogadas[i][j] = 0;
				}
				else{
					calculo[i][j] = turnXis?-99999:99999;
				}
			}
		}
		printMatriz(calculo);
		var retorno = new Array(0,0);
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (turnXis) {
					if ( calculo[i][j] == calculo[retorno[0]][retorno[1]] ) {
						if (Math.random() > 0.3) {
							retorno[0] = i;
							retorno[1] = j;
						}
					}
					else if ( calculo[i][j] > calculo[retorno[0]][retorno[1]] ) {
						retorno[0] = i;
						retorno[1] = j;
					}
				}
				else{
					if ( calculo[i][j] == calculo[retorno[0]][retorno[1]] ) {
						if (Math.random() > 0.3) {
							retorno[0] = i;
							retorno[1] = j;
						}
					}
					else if ( calculo[i][j] < calculo[retorno[0]][retorno[1]] ) {
						retorno[0] = i;
						retorno[1] = j;
					}
				}
			}
		}
		return retorno;
	};
	/**
	 * Funçao que gera o fitiness de um estado do jogo da velha
	 * @param {*} matriz + para xis e - para bol
	 */
	var fitness = function(matriz){
		var fit = 0;
		var dois_x = 0;
		var um_x = 0;
		var duas_o = 0;
		var uma_o = 0;
		var qx, qo;//Quantidade de x, quantidade de bolinha
		
		//Calculo vertical
		for (var i = 0; i < 3; i++) {
			qx = 0;
			qo = 0;
			for (var j = 0; j < 3; j++) {
				if 		(matriz[i][j] == -1) 	{qx++;}
				else if (matriz[i][j] == 1) 	{qo++;}
			}
			if 		(qx == 2)	{ dois_x++; }
			else if (qx == 1) 	{ um_x++; }
			else if (qx == 3) 	{ return 99999; }
			if 		(qo == 2)	{ duas_o++; }
			else if (qo == 1) 	{ uma_o++; }
			else if (qo == 3) 	{ return -99999; }
		}
		
		//Calculo horizontal
		for (var i = 0; i < 3; i++) {
			qx = 0;
			qo = 0;
			for (var j = 0; j < 3; j++) {
				if 		(matriz[j][i] == -1) 	{qx++;}
				else if (matriz[j][i] == 1) 	{qo++;}
			}
			if 		(qx == 2)	{ dois_x++;}
			else if (qx == 1) 	{ um_x++;}
			else if (qx == 3) 	{ return 99999; }
			if 		(qo == 2)	{ duas_o++;}
			else if (qo == 1) 	{ uma_o++;}
			else if (qo == 3) 	{ return -99999; }
		}

		//Calculo diagonal 1
		qx = 0;
		qo = 0;
		for (var i = 0; i < 3; i++) {
			if 		(matriz[i][i] == -1) 		{qx++;}
			else if (matriz[i][i] == 1) 		{qo++;}
		}
		if 		(qx == 2)	{ dois_x++; }
		else if (qx == 1) 	{ um_x++; }
		else if (qx == 3) 	{ return 99999; }
		if 		(qo == 2) 	{ duas_o++; }
		else if (qo == 1) 	{ uma_o++; }
		else if (qo == 3) 	{ return -99999; }

		//Calculo diagonal 2
		qx = 0;
		qo = 0;
		for (var i = 0; i < 3; i++) {
			if (matriz [i][2-i] == -1) 	{qx++;}
			else if (matriz [i][2-i] == 1) {qo++;}
		}
		if 		(qx == 2)	{ dois_x++; }
		else if (qx == 1) 	{ um_x++; }
		else if (qx == 3) 	{ return 99999; }
		if 		(qo == 2) 	{ duas_o++; }
		else if (qo == 1) 	{ uma_o++; }
		else if (qo == 3) 	{ return -99999; }
		fit = (3*dois_x) + um_x -((3*duas_o) + uma_o);
		//console.log( dois_x, um_x, duas_o, uma_o, fit);
		
		return fit;
	};
	/**
	 * verificar quem vence
	 * @returns false to continue, "loose" to finish, "bol", "xis"
	 */
	var wins = function(){
		var ret = {};
		ret.winner = false;
		ret.ini = new Array(-1,-1);
		ret.end = new Array(-1,-1);
		
		if (movies == 0){ ret.winner = "loose"; } // Vitoria da velha

		for (var play = 1; play >= -1; play-=2) {
				 if (table[0][0]==play && table[0][1]==play && table[0][2]==play){ ret.winner = play; ret.ini[0]=0;ret.ini[1]=0;ret.end[0]=0;ret.end[1]=2; console.log(1); }	//vitoria bolinha
			else if (table[1][0]==play && table[1][1]==play && table[1][2]==play){ ret.winner = play; ret.ini[0]=1;ret.ini[1]=0;ret.end[0]=1;ret.end[1]=2; console.log(2); }
			else if (table[2][0]==play && table[2][1]==play && table[2][2]==play){ ret.winner = play; ret.ini[0]=2;ret.ini[1]=0;ret.end[0]=2;ret.end[1]=2; console.log(3); }
			else if (table[0][0]==play && table[1][0]==play && table[2][0]==play){ ret.winner = play; ret.ini[0]=0;ret.ini[1]=0;ret.end[0]=2;ret.end[1]=0; console.log(4); }
			else if (table[0][1]==play && table[1][1]==play && table[2][1]==play){ ret.winner = play; ret.ini[0]=0;ret.ini[1]=1;ret.end[0]=2;ret.end[1]=1; console.log(5); }
			else if (table[0][2]==play && table[1][2]==play && table[2][2]==play){ ret.winner = play; ret.ini[0]=0;ret.ini[1]=2;ret.end[0]=2;ret.end[1]=2; console.log(6); }
			else if (table[0][0]==play && table[1][1]==play && table[2][2]==play){ ret.winner = play; ret.ini[0]=0;ret.ini[1]=0;ret.end[0]=2;ret.end[1]=2; console.log(7); }
			else if (table[0][2]==play && table[1][1]==play && table[2][0]==play){ ret.winner = play; ret.ini[0]=0;ret.ini[1]=2;ret.end[0]=2;ret.end[1]=0; console.log(8); }
		}
		if (ret.winner) {
			if ('vibrate' in navigator) {
				// shake it up, baby
				navigator.vibrate([200, 250, 300]);
			}
		}
		return ret;
	};


	//Funções de desenho
	/**
	 * Desenha bol nas coordenadas estabelecidas
	 * @param {int} x Coordenada da matriz x
	 * @param {int} y Coordenada da matriz y
	 */
	var drawBol = function(x, y){
		var partW = cWidth/3;
		var partH = cHeight/3;
		var minPart = partW<partH?partW:partH;
		var diameter = 0.8;
		
		//Desenha O
		ctx.beginPath();
		ctx.strokeStyle = "#0000ff";
		ctx.arc(
			partW*(y+0) + (partW)*0.5, // center x
			(partH)*(x+0) + (partH)*0.5, // center y
			minPart * diameter/2,  // raio
			0, // start angle
			2 * Math.PI // end angle
		);
		ctx.stroke();
	};
	/**
	 * Desenha xis nas coordenadas estabelecidas
	 * @param {int} x Coordenada da matriz x
	 * @param {int} y Coordenada da matriz y
	 */
	var drawXis = function(x, y){
		var partW = cWidth/3;
		var partH = cHeight/3;
		var ar = 0.2;

		// desenha \
		ctx.beginPath();
		ctx.strokeStyle = "#00FF00";
		ctx.moveTo( partW*(y+0) + (partW)*ar	, (partH)*(x+0) + (partH)*ar );
		ctx.lineTo( partW*(y+1) - (partW)*ar	, (partH)*(x+1) - (partH)*ar );
		ctx.stroke();
		// desenha /
		ctx.moveTo( partW*(y+1) - (partW)*ar	, (partH)*(x+0) + (partH)*ar );
		ctx.lineTo( partW*(y+0) + (partW)*ar	, (partH)*(x+1) - (partH)*ar );
		ctx.stroke();
	};
	/**
	 * Desenha linha de vitoria
	 * @param {array bidimencional} point1 
	 * @param {array bidimencional} point2 
	 */
	var drawLine = function(point1, point2){
		
		var partW = cWidth/3;
		var partH = cHeight/3;
		var ar = 0.5;
		// desenha linha
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#FF0000";
		
		console.warn(point1);
		ctx.moveTo(  partW*point1[1] + (partW)*ar,	partH*point1[0] + (partH)*ar );
		ctx.lineTo(  partW*point2[1] + (partW)*ar,	partH*point2[0] + (partH)*ar );
		ctx.stroke();
	};
	/**
	 * Desenha tabuleiro
	 */
	var showTable = function(){
		//Limpa canvas
		ctx.clearRect(0, 0, cWidth, cHeight);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#000000";

		//horizontal
		ctx.beginPath();
		ctx.moveTo(0, cHeight/3);
		ctx.lineTo(cWidth, cHeight/3);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(0, cHeight*2/3);
		ctx.lineTo(cWidth, cHeight*2/3);
		ctx.stroke();

		//vertical
		ctx.beginPath();
		ctx.moveTo(cWidth/3, 0);
		ctx.lineTo(cWidth/3, cHeight);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(cWidth*2/3, 0);
		ctx.lineTo(cWidth*2/3, cHeight);
		ctx.stroke();

	};

	var drawVictory = function(winner){
		ctx.globalAlpha = 0.7;
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,cWidth,cHeight);
		ctx.globalAlpha = 1.0;

		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		
		ctx.font = cWidth/7+"px Arial";
		if (winner == 1) {
			ctx.fillText("Xis Winner", canvas.width/2, canvas.height/2);
		}
		else if(winner == -1) {
			ctx.fillText("Bol Winner", canvas.width/2, canvas.height/2);
		}
		else{
			ctx.fillText("All Lose", canvas.width/2, canvas.height/2);
		}
	}
	
	/**
	 * Função construtora do jogo
	 * @param {string} canvasId Id do canvas alvo sem o marcador #
	 * @param {int} width Largura do canvas
	 * @param {int} height Altura do canvas
	 */
	var construct = function(canvasId, width, height){
		$("#"+canvasId).attr("width", width);
		$("#"+canvasId).attr("height", height);
		cWidth = width;
		cHeight = height;
		
		canvas = document.getElementById(canvasId);
		ctx = canvas.getContext("2d");
		self.reset();

		/**
		 * Quando clicar chama play
		 */
		canvas.onmousedown = function(e) {
			if (movies>0) {
				play( parseInt(e.layerY*3/cHeight), parseInt(e.layerX*3/cWidth) );
			} else {
				self.reset();
			}
		};
	};
	construct(canvasId, width, height);
};