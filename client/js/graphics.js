const div = document.getElementById("controls")
var scene, camera, renderer
var loaded = false
const geometry = new THREE.BoxGeometry(), material = new THREE.MeshBasicMaterial({color: 0xFFFF00})

function init(){
    if(loaded){
        renderer.dispose()
        scene.dispose()
    }
    this.loaded = true
    
    const width = window.innerWidth, height = window.innerHeight - div.offsetHeight - div.offsetTop * 2 - 1
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(120, width / height, 0.1, 100)
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)
    document.body.appendChild(renderer.domElement)

    camera.position.z = 5
    render();
}

function render() {
    requestAnimationFrame(render);
	renderer.render(scene, camera);
}

init()


function graphicsAddTurtle(){
    var box = new THREE.Mesh(geometry, material)
    scene.add(box)
    return(box)
}