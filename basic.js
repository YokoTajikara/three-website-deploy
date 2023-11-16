import "./style.css"
import * as THREE from 'three';

//canvas
const canvas = document.querySelector('#webgl');

//シーン
const scene = new THREE.Scene();

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