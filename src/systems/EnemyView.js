import { CAMERAS } from './CameraSystem.js';

// Presentación de los enemigos (no contiene reglas de IA).
// Los robots de la oficina viven en `enemyLayer`, la capa más baja dentro de `room`
// por encima del fondo (siguen paneo y escala, pero quedan debajo de las luces y de
// la puerta/ventana) y los de las cámaras dentro de `camImageContainer` (siguen el
// paneo de la cámara).

const ROOM_IMAGE = { width: 1536, height: 688 };
// Altura de los robots respecto de la imagen que los contiene (acordado: 65%).
const BASE_HEIGHT_RATIO = 0.65;
// En la ventana se muestra solo la mitad superior: las piernas no deben tapar el marco.
const WINDOW_VISIBLE_RATIO = 0.5;

// Posiciones en coordenadas de la imagen de sala (1536x688), acordadas con el usuario.
// Los robots frente a las cámaras 1/2 (cabina izq./der.) se dibujan como si se
// asomaran por la ventana o la puerta; el robot 4 (alucinación) aparece al centro.
const OFFICE = {
  ventana: { x: 367, y: 313 },
  puerta: { x: 1227, y: 411 },
  puertaRapida: { x: 1317, y: 411 },
  oficina: { x: 768, y: 344 }
};

// Cámara 7 (Profesores E4): robot 1 al centro, robot 2 a la derecha (+25% del ancho)
// y robot 3 a la izquierda (-25%). En el resto de las cámaras van al centro.
const CAM7_X = { 1: 0.5, 2: 0.75, 3: 0.25 };

export default class EnemyView {
  constructor(scene, { enemyLayer, camImageContainer, camImage }) {
    this.scene = scene;
    this.enemyLayer = enemyLayer;
    this.camImageContainer = camImageContainer;
    this.camImage = camImage;
    this.officeSprites = new Map();
    this.camSprites = new Map();
  }

  init(manager) {
    const source = this.scene.textures.get('robot1').getSourceImage();
    this.textureSize = { width: source.width, height: source.height };
    this.officeScale = (BASE_HEIGHT_RATIO * ROOM_IMAGE.height) / this.textureSize.height;

    // Orden de dibujo en la sala: robot 1 detrás, luego robot 3, robot 2 y robot 4.
    [1, 3, 2, 4].forEach((id) => {
      const enemy = manager.getById(id);
      if (!enemy) return;
      const sprite = this.scene.add
        .image(0, 0, enemy.spriteKey)
        .setOrigin(0.5)
        .setScale(this.officeScale)
        .setVisible(false);
      this.enemyLayer.add(sprite);
      this.officeSprites.set(id, sprite);
    });

    // Capa de robots de cámara: hermana de la imagen y dibujada encima de ella.
    this.camEnemies = this.scene.add.container(0, 0);
    this.camImageContainer.add(this.camEnemies);
    manager.getAll().forEach((enemy) => {
      const sprite = this.scene.add.image(0, 0, enemy.spriteKey).setOrigin(0.5).setVisible(false);
      this.camEnemies.add(sprite);
      this.camSprites.set(enemy.id, sprite);
    });
  }

  update(manager, { cams, doorOpen, windowOpen }) {
    this.updateOffice(manager, { doorOpen, windowOpen });
    this.updateCameras(manager, cams);
  }

  updateOffice(manager, { doorOpen, windowOpen }) {
    this.officeSprites.forEach((sprite, id) => {
      const enemy = manager.getById(id);
      if (!enemy || !enemy.enabled) {
        sprite.setVisible(false);
        return;
      }

      let position = null;
      if (id === 2 && enemy.location === 'ventana' && windowOpen) position = OFFICE.ventana;
      else if (id === 3 && enemy.location === 'puerta' && doorOpen) position = OFFICE.puerta;
      else if (id === 1 && enemy.location === 'puerta' && doorOpen) position = OFFICE.puertaRapida;
      else if (id === 4 && enemy.location === 'oficina') position = OFFICE.oficina;

      sprite.setVisible(Boolean(position));
      if (!position) return;

      sprite.setPosition(position.x, position.y);
      if (id === 2) {
        // Recorte: mitad superior visible, centrada en el punto acordado de la ventana.
        const visibleHeight = this.textureSize.height * WINDOW_VISIBLE_RATIO;
        sprite.setCrop(0, 0, this.textureSize.width, visibleHeight);
        // Desplaza el sprite para que la mitad visible quede centrada en el punto acordado.
        sprite.setY(position.y + (visibleHeight * this.officeScale) / 2);
      } else {
        sprite.setCrop();
      }
    });
  }

  updateCameras(manager, cams) {
    // La capa hereda la escala de la imagen de cámara para compartir su encuadre.
    this.camEnemies.setScale(this.camImage.scale);

    const active = cams.visible ? cams.activeIndex : -1;
    const imageWidth = this.camImage.width;
    const imageHeight = this.camImage.height;

    manager.getAll().forEach((enemy) => {
      const sprite = this.camSprites.get(enemy.id);
      if (!sprite) return;

      if (!enemy.enabled || !enemy.isInCamera(active)) {
        sprite.setVisible(false);
        return;
      }

      const u = active === CAMERAS.PROFESORES_E4 ? CAM7_X[enemy.id] ?? 0.5 : 0.5;
      let scale = (BASE_HEIGHT_RATIO * imageHeight) / this.textureSize.height;
      if (typeof enemy.phaseScale === 'number') scale *= enemy.phaseScale;

      sprite.setPosition((u - 0.5) * imageWidth, 0);
      sprite.setScale(scale);
      sprite.setVisible(scale > 0);
    });
  }
}
