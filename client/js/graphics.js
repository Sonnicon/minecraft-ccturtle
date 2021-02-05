const div = document.getElementById("controls")
const width = window.innerWidth, height = window.innerHeight - div.offsetHeight - div.offsetTop * 2 - 1

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(120, width / height, 0.1, 100)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({color: 0xFFFF00})

camera.position.z = 5

function render() {
    requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();

function graphicsAddTurtle(){
    var box = new THREE.Mesh(geometry, material)
    scene.add(box)
    return(box)
}