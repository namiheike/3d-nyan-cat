
//index.js
function $$(x){return document.getElementById(x);}

var PI2=Math.PI*2;
var PI=Math.PI;
//var stats;
var container=$$("div3dContainer");
var camera, scene, projector, renderer;
//var ambientLight,light;
var cloudImg=new Image();
var cloudTexture;
var clouds=new Array();
var cloudMaterials=new Array();
var cloudAnimDelta=new Array();
var nyanCat;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouse = { x: 0, y: 0 }
var guestbkShowed=false;

//load Img
cloudImg.src="img/cloud-256.png";
cloudTexture = new THREE.Texture( cloudImg, THREE.UVMapping );
cloudImg.onload = function () {
	cloudTexture.needsUpdate = true;
	init();
	init3d();
	loadNayn();
	animate();
};

function init(){
	$('#divGuestbk').slideUp();
	$('#divFooter').css('opacity',.7);
	$('#pFooter').css('opacity',1);
	$$('ifrmGuestbk').src="guestbook.html";
	$$('btnGuestbkSbmt').disabled=false;
	$$('txtGuestbk').value="别忘了留名- -";
}

function loadNayn(){
	var loader = new THREE.JSONLoader( true );
	loader.load( "js/nyancat.js", function( geometry ) {
		nyanCat = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial({opacity:0.9,transparent: true, overdraw:true}) );										 
		nyanCat.scale.set(0.1,0.1,0.1);
		nyanCat.rotation.y=PI;
		randNyanCat();
		scene.add( nyanCat );
	} );
}

function randNyanCat(){
	nyanCat.position.x=((Math.random()*15)+7)*(Math.round(Math.random())*2-1);
	nyanCat.position.y=camera.position.y-5+(Math.random()*10);
	nyanCat.position.z=-55;
}

function randCloud(i){
		clouds[i].position.x=Math.random()*100-50;
//		clouds[i].position.y=Math.random()*10-5;
		clouds[i].position.y=Math.random()*5-15;
		var tmp=Math.random()*0.6+0.7;
		clouds[i].scale.set(tmp,tmp,1)
		clouds[i].rotation.z=Math.random()*PI2;
}

function init3d(){
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, .1, 10000 );
	camera.position.set( 0, 0, 0 );
	camera.lookAt(new THREE.Vector3(0,0,-1));
	scene = new THREE.Scene();
	scene.add( camera );
	//scene.fog = new THREE.FogExp2( 0xf5fa70, 0.2 );
	
//	var materialClass = WebGLSupported ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;
	var materialClass = THREE.MeshLambertMaterial;
	var i;
	for (i=1;i<=200;i++){
		cloudMaterials[i]=new materialClass( { map: cloudTexture,opacity:0.9,transparent: true, overdraw:true } );
//		cloudMaterials[i].ambient.setHex(0xFFFFFF)
		clouds[i]=new THREE.Mesh(new THREE.PlaneGeometry(22,22,1,1), cloudMaterials[i]);
		cloudAnimDelta[i]=0;
		randCloud(i);
		scene.add(clouds[i]);
	}
	for (i=1;i<=50;i++){clouds[i].position.z=Math.random()*20-20;}
	for (i=51;i<=100;i++){clouds[i].position.z=Math.random()*20-40;}
	for (i=100;i<=150;i++){clouds[i].position.z=Math.random()*20-60;}
	for (i=151;i<=200;i++){clouds[i].position.z=Math.random()*20-80;}
	
//light
	var light = new THREE.PointLight( 0xdddddd, .45 );
	light.position.set( -15, 2, 1 );
	scene.add( light );
	var light = new THREE.PointLight( 0xdddddd, .45 );
	light.position.set( 15, 0, 1 );
	scene.add( light );
	var light = new THREE.PointLight( 0xdddddd, .45 );
	light.position.set( -30, 2, 1 );
	scene.add( light );
	var light = new THREE.PointLight( 0xdddddd, .45 );
	light.position.set( 30, 0, 1 );
	scene.add( light );
//	var ambientLight = new THREE.AmbientLight( 0xffffff );
//	scene.add( ambientLight );
//	debug, grid
	//grid();	
// 	renderer = WebGLSupported ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
	renderer=new THREE.WebGLRenderer( { clearAlpha: 1, antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.background='transparent';
	renderer.setClearColorHex ( 0x000000, 0 );
	container.appendChild( renderer.domElement );
//	stats = new Stats();
//	stats.domElement.style.position = 'absolute';
//	stats.domElement.style.top = '0px';
//	container.appendChild( stats.domElement );
	renderer.domElement.addEventListener( 'mousemove', onRendererMouseMove, false );
	window.addEventListener('resize',onWindowResize,false);
	$("#divLoading").fadeOut(2000);
	var tmpTimeout=setTimeout("$('#btnBlog').fadeIn(2000,addEventBtnBlog)",3500);
	var tmpTimeout1=setTimeout("$('#btnGuestbk').fadeIn(2000,addEventBtnGuestbk)",3000);
}
function addEventBtnBlog(){
	$$('btnBlog').addEventListener( 'mouseover', function(){$('#btnBlog').css('border-color','white')}, false );
	$$('btnBlog').addEventListener( 'mouseout', function(){$('#btnBlog').css('border-color','transparent')}, false );
	$$('btnBlog').addEventListener( 'click', function(){window.location.href="blog"}, false );
}

//Guestbk
function addEventBtnGuestbk(){
	$$('btnGuestbk').addEventListener( 'mouseover', function(){$('#btnGuestbk').css('border-color','silver').css('background-color','#f9f9f9')}, false );
	$$('btnGuestbk').addEventListener( 'mouseout', btnGuestbkMouseout, false );
	$$('btnGuestbk').addEventListener( 'click', btnGuestbkClick, false );
}
function btnGuestbkMouseout(){
	$('#btnGuestbk').css('border-color','transparent').css('background-color','transparent');
}
function btnGuestbkClick(){
	if (guestbkShowed){
		$$('btnGuestbk').addEventListener( 'mouseout', btnGuestbkMouseout, false );
		$('#divGuestbk').slideUp('slow');
		guestbkShowed=false;
	}else{
		$$('btnGuestbk').removeEventListener( 'mouseout', btnGuestbkMouseout, false );
		$('#divGuestbk').slideDown('slow');
		guestbkShowed=true;
	}
}
function btnGuestbkSbmtClick(){
	var txt=$.trim($$("txtGuestbk").value);
	txt=txt.replace(/[\r\n]/g, ' ');
	var maxLimit=100;
	if (txt!=""){
		if(txt.length>maxLimit){
			alert("TOO LONG, "+txt.length+"/"+maxLimit);
		}else{
			var d=new Date();
			$.post("guestbooksubmit.php?rand="+Math.random(),{
				       "txt":txt
					   },
				   function(result){
					   $$("ifrmGuestbk").src="guestbook.html?rand="+Math.random();
					   $("#btnGuestbkSbmt").text('THANKS');
					   $$("btnGuestbkSbmt").disabled=true;
					});
		}
	}
}




function onRendererMouseMove(event){
	mouse.x = ( event.clientX - windowHalfX )/windowHalfX;
	mouse.y = ( event.clientY - windowHalfY )/windowHalfY;
	//$('#divDebug').text(mouse.x+","+mouse.y);
}
function onWindowResize(event){
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	render();
//	stats.update();
}

function render(){
	var i;
	//move clouds
	for(i=1;i<=200;i++){
		clouds[i].position.z+=0.05;
		if (clouds[i].position.z<-60){
			cloudMaterials[i].opacity+=cloudAnimDelta[i];
		}else if (clouds[i].position.z>-20){
			cloudMaterials[i].opacity=cloudMaterials[i].opacity*(0-clouds[i].position.z)/20;
			//cloudMaterials[i].opacity=0;
			if (clouds[i].position.z>=0){
				randCloud(i);
				clouds[i].position.z=Math.random()*20-80;
				cloudMaterials[i].opacity=0;
				var aim=0.3+Math.random()*0.5;
				cloudAnimDelta[i]=aim/(-60-clouds[i].position.z)*0.05;
			}
		}
	}
	//move camera
	var vX,vY;
//	vX=Math.abs(mouse.x)<0.9?Math.sin(mouse.x*PI)/50:0.003;
	camera.position.x+=Math.sin(mouse.x*PI)/10;
	camera.position.y-=Math.sin(mouse.y*PI)/10;
	if (camera.position.x<-10){camera.position.x=-10;}else if(camera.position.x>10){camera.position.x=10;}
	if (camera.position.y<-7){camera.position.y=-7;}else if(camera.position.y>4){camera.position.y=4;}
	//move nyanCat
	if(nyanCat){
		nyanCat.position.z+=0.3;
		if (nyanCat.position.z>=14){
			randNyanCat();
		}
	}
	
	renderer.render( scene, camera );	
}


function grid(){
				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( -100, 0, 0 ) ) );
				geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 100, 0, 0 ) ) );

				var material = new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1 } );

				for ( var i = 0; i <= 10; i ++ ) {
					var line = new THREE.Line( geometry, material );
					line.position.y = -10;
					line.position.z = i*(-10);
					scene.add( line );

					var line = new THREE.Line( geometry, material );
					line.position.x = ( i * 10 ) - 50;
					line.position.y = -10;
					line.rotation.y = 90 * Math.PI / 180;
					scene.add( line );
				}
}
