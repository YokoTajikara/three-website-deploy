import "./style.css"
import * as THREE from 'three';

//canvas
const canvas = document.querySelector('#webgl');

//シーン
const scene = new THREE.Scene();

//背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("bg/bg.jpg");
scene.background = bgTexture;

//サイズ
const sizes = {
	width: innerWidth,
	height: innerHeight
};

//カメラ
const camera = new THREE.PerspectiveCamera(
	75, //fov　視野角
	sizes.width / sizes.height, //aspect
	0.1, //near
	1000 //far
);

//レンダラー
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//オブジェクトを作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0)

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const tourus = new THREE.Mesh(torusGeometry, torusMaterial);
tourus.position.set(0, 0.5, 10);

scene.add(box, tourus);

//線形補間で滑らかに移動
function larp(x, y, a) {
	return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
	return (scrollParcent - start) / (end - start);
}

//スクロールアニメーション
const animationScript = [];

animationScript.push({
	start: 0,
	end: 40,
	function() {
		camera.lookAt(box.position);
		camera.position.set(0, 1, 10);
		box.position.z = larp(-15, 2, scalePercent(0, 40));
		tourus.position.z = larp(10, -20, scalePercent(0, 40));

	}
});
animationScript.push({
	start: 40,
	end: 60,
	function() {
		camera.lookAt(box.position);
		camera.position.set(0, 1, 10);
		box.rotation.z = larp(1, Math.PI, scalePercent(40, 60));

	}
});
animationScript.push({
	start: 60,
	end: 80,
	function() {
		camera.lookAt(box.position);
		camera.position.x = larp(0, -15, scalePercent(60, 80));
		camera.position.y = larp(1, 15, scalePercent(60, 80));
		camera.position.Z = larp(10, 25, scalePercent(60, 80));
	}
});
animationScript.push({
	start: 80,
	end: 100,
	function() {
		camera.lookAt(box.position);
		box.rotation.x += 0.02;
		box.rotation.y += 0.02;
	}
});

function playScrollAnimation() {
	animationScript.forEach((animation) => {
		if (scrollParcent >= animation.start && scrollParcent <= animation.end) {
			animation.function();
		}
	});
}

let scrollParcent = 0;

//ブラウザのスクロール率を取得
document.body.onscroll = () => {
	//スクロール量　100 x X/(L - Y)
	scrollParcent =
		(document.documentElement.scrollTop /
			(document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
	console.log(scrollParcent)
}

//アニメーション
const tick = () => {
	window.requestAnimationFrame(tick);
	playScrollAnimation();
	renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ
window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(window.devicePixelRatio);
})