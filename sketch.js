//Estados do jogo
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

//Trex e Solo
var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

//Nuvem e obstáculos
var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

//Mensagem Game-Over
var gameover;

//Pontuação
var pontuacao;

function preload(){
  var teste;

  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  textofim = loadImage("gameover.png")
  
}

function setup() {
  createCanvas(600, 200);

  //T-rex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  
  //Solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  solo.velocityX = -6;

  //Parar em baixo
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  //Texto game-over
  gameover = createSprite(300,100);
  gameover.addImage("mensagemfinal", textofim)
  gameover.scale = 0.2;
  gameover.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
   
  //Raio de Colisão
  trex.setCollider("circle",0,0,40);
  trex.debug = false
  
  //Pontuação
  pontuacao = 0;
}

function draw() {
  background(180);
  
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,50);
  
  if(estadoJogo === JOGAR){
    //Mover o solo
    solo.velocityX = -4;
   
    //Marcar pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //Saltar quando a tecla de espaço é pressionada
    if(keyDown("space")&& trex.y >= 160) {
       trex.velocityY = -13;
  }
  
    //Gravidade(voltar ao solo)
    trex.velocityY = trex.velocityY + 0.8
   
    //Declarar Funções
    gerarNuvens();
    gerarObstaculos();
    
    //Mudar de estado do jogo quando perder
    if(grupodeobstaculos.isTouching(trex)){
        estadoJogo = ENCERRAR;
    }
  }
  //Parar tudo no final
  else if (estadoJogo === ENCERRAR) {
   solo.velocityX = 0;
   grupodeobstaculos.setVelocityXEach(0);
   grupodeobstaculos.destroyEach(); 
   grupodenuvens.destroyEach();
   gameover.visible = true;
   pontuacao.visible = false;
    
   if (mousePressedOver(gameover)) {
    estadoJogo = JOGAR;
     pontuacao = 0;
     gameover.visible = false;
   }
   }
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);
  
  drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,165,10,40);
  obstaculo.velocityX = -4;
      
    //Gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //Atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //Adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //Gerar Nuvens
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //Atribuir tempo de duração à variável
    nuvem.lifetime = 300;
    
    //Ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //Adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}