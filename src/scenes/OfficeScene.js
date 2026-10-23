import Phaser from 'phaser';
import Door from '../game/Door.js';
import Light from '../game/Light.js';
import Battery from '../game/Battery.js';
import NightManager from '../game/NightManager.js';
import CameraSystem, { CAMERAS } from '../systems/CameraSystem.js';
import EnemyManager from '../enemies/EnemyManager.js';
import EnemyFactory from '../enemies/EnemyFactory.js';
import EnemyView from '../systems/EnemyView.js';
import ScreenPanner from '../game/ScreenPanner.js';
import UiButton from '../ui/UiButton.js';
import WallButton from '../ui/WallButton.js';

// Dimensiones del fondo de la sala (verificado: 1536 x 688) y de la pantalla (960 x 600).
const ROOM = { width: 1536, height: 688 };
const SCREEN = { width: 960, height: 600 };
// Superposiciones alineadas a los bordes (cambio acordado con el usuario):
// ventana y su luz a la izquierda (520 px), puerta y su luz a la derecha (411 px).
const DOOR_W = 411;
const WINDOW_W = 520;
const DOOR_X = ROOM.width - DOOR_W; // 1125
const WINDOW_X = 0;
const ASSETS = 'assets/sala de seguridad/';

// Escena principal: cabina con imagen de sala, paneo por mouse, puerta/ventana/luces,
// cámaras, batería y reloj. Controles solo PC (mouse + teclado).
export default class OfficeScene extends Phaser.Scene {
  // Las subclases (niveles) reutilizan toda la escena cambiando solo la clave.
  constructor(key = 'CabinaJuego') {
    super(key);
  }

  // Topes del número propio por robot (null = todos usan el tope general 1..20).
  // Los niveles lo sobrescriben para limitar los números de sus enemigos.
  getEnemyMaxRolls() {
    return null;
  }

  // Etiqueta del nivel mostrada en la esquina superior derecha (null = sin etiqueta).
  getLevelLabel() {
    return null;
  }

  // Escena a la que se pasa después de la pantalla de victoria (null = menú).
  // Los niveles intermedios la sobrescriben para encadenar el siguiente nivel.
  getNextAfterVictoryScene() {
    return null;
  }

  preload() {
    this.load.image('salaFondo', ASSETS + 'sala de seguridad.jpg');
    this.load.image('puertaAbierta', ASSETS + 'puerta abierta.png');
    this.load.image('puertaCerrada', ASSETS + 'puerta cerrada.png');
    this.load.image('ventanaAbierta', ASSETS + 'ventana abierta.png');
    this.load.image('ventanaCerrada', ASSETS + 'ventana cerrada.png');
    this.load.image('luzPPrendida', ASSETS + 'luzP Prendida.png');
    this.load.image('luzPApagada', ASSETS + 'luzP apagada.png');
    this.load.image('luzVPrendida', ASSETS + 'luzV Prendida.png');
    this.load.image('luzVApagada', ASSETS + 'luzV apagada.png');

    // Imágenes de cámaras
    this.load.image('camCabinaIzq', 'assets/camaras/cabina izquierda (camara 1).jpg');
    this.load.image('camCabinaDer', 'assets/camaras/Cabina derecha (camara 2).jpg');
    this.load.image('camCamino', 'assets/camaras/camino (camara 3).jpg');
    this.load.image('camAula1', 'assets/camaras/Aula 1 (camara 4).jpg');
    this.load.image('camAula2', 'assets/camaras/Aula 2 (camara 5).jpg');
    this.load.image('camEdificio3', 'assets/camaras/Edificio 3 (camara 6).jpg');
    this.load.image('camProfesoresE4', 'assets/camaras/profesores E4 (camara 7).jpg');
    this.load.image('camSalonE4', 'assets/camaras/salon E4 (camara 8).jpg');
    this.load.image('camBiblioteca', 'assets/camaras/salon E4 (camara 8).jpg'); // Fallback si no hay imagen específica
    this.load.image('camPuertaE4', 'assets/camaras/puerta E4 (camara 10).jpg');

    // Mini mapa
    this.load.image('miniMapa', 'assets/camaras/camaras_mini_mapa.png');

    // Robots
    this.load.image('robot1', 'assets/robots/robot 1.png');
    this.load.image('robot2', 'assets/robots/robot 2.png');
    this.load.image('robot3', 'assets/robots/robot 3.png');
    this.load.image('robot4', 'assets/robots/robot 4.png');
    this.load.image('robot5', 'assets/robots/robot 5.png');
  }

  create() {
    // Lógica de negocio (reutilizada de iteraciones anteriores).
    this.door = new Door('puerta');
    this.window = new Door('ventana');
    this.luzP = new Light('luz puerta');
    this.luzV = new Light('luz ventana');
    this.battery = new Battery();
    this.clock = new NightManager({ hourMs: 60000 });
    this.cams = new CameraSystem();

    // Paneo: la imagen se escala al alto de pantalla y sobresale por los costados.
    this.roomScale = SCREEN.height / ROOM.height;
    this.maxPan = ROOM.width * this.roomScale - SCREEN.width;
    this.panner = new ScreenPanner({ speed: 520, zoneRatio: 0.12 });
    this.pan = 0;

    this.buildRoom();
    this.buildUi();
    this.bindKeys();

    // Enemigos: lógica pura (EnemyManager) + render (EnemyView).
    // El nivel puede limitar los números propios de algunos robots.
    this.enemies = new EnemyManager(EnemyFactory.createAll({
      maxRolls: this.getEnemyMaxRolls() ?? {}
    }));
    this.enemyView = new EnemyView(this, {
      enemyLayer: this.enemyLayer,
      camImageContainer: this.camImageContainer,
      camImage: this.camImage
    });
    this.enemyView.init(this.enemies);
    this._defeated = false;
    this.enemies.events.on('defeat', ({ enemy }) => this.loseTo(enemy));
  }

  // Derrota: jumpscare (escena Perder) informando qué robot atrapó al jugador.
  loseTo(enemy) {
    if (this._defeated) return;
    this._defeated = true;
    // `retryScene` permite que el reintento vuelva al nivel que se estaba jugando.
    this.scene.start('Perder', { robot: enemy.name, retryScene: this.scene.key });
  }

  // Capa con el fondo y las superposiciones: es lo único que se desplaza con el mouse.
  // Orden de dibujo (de atrás hacia adelante), sin contar el fondo:
  //   1) robots (enemyLayer)
  //   2) luces (lightLayer)
  //   3) puerta/ventana (doorLayer)
  // Las luces tapan a los robots y la puerta/ventana tapa a ambos.
  buildRoom() {
    this.room = this.add.container(0, 0).setDepth(0);

    this.fondo = this.add.image(0, 0, 'salaFondo').setOrigin(0);

    // Capa 1: robots de la oficina (la rellena EnemyView).
    this.enemyLayer = this.add.container(0, 0);

    // Capa 2: luces, por delante de los robots.
    this.luzPImg = this.add.image(DOOR_X, 0, 'luzPApagada').setOrigin(0);
    this.luzVImg = this.add.image(WINDOW_X, 0, 'luzVApagada').setOrigin(0);
    this.lightLayer = this.add.container(0, 0);
    this.lightLayer.add([this.luzPImg, this.luzVImg]);

    // Capa 3: puerta y ventana, por delante de robots y luces.
    this.puertaImg = this.add.image(DOOR_X, 0, 'puertaAbierta').setOrigin(0);
    this.ventanaImg = this.add.image(WINDOW_X, 0, 'ventanaAbierta').setOrigin(0);
    this.doorLayer = this.add.container(0, 0);
    this.doorLayer.add([this.puertaImg, this.ventanaImg]);

    this.room.add([this.fondo, this.enemyLayer, this.lightLayer, this.doorLayer]);
    this.room.setScale(this.roomScale).setX(0);
  }

  // UI fija en coordenadas de pantalla: no se mueve con el paneo.
  buildUi() {
    this.add.rectangle(SCREEN.width / 2, 0, SCREEN.width, 56, 0x000000, 0.45)
      .setOrigin(0.5, 0)
      .setDepth(10);
    this.add.rectangle(SCREEN.width / 2, SCREEN.height, SCREEN.width, 54, 0x000000, 0.55)
      .setOrigin(0.5, 1)
      .setDepth(10);

    // HUD de la sala: solo hora y batería.
    this.hud = this.add
      .text(16, 10, '', { fontSize: '17px', color: '#0f0' })
      .setDepth(20);

    // Nivel actual en la esquina superior derecha (solo en escenas de nivel).
    this.levelLabel = this.getLevelLabel();
    if (this.levelLabel) {
      this.add
        .text(SCREEN.width - 16, 10, this.levelLabel, { fontSize: '17px', color: '#ff0' })
        .setOrigin(1, 0)
        .setDepth(20);
    }

    // Botones de la pared: rectángulos de clic en posiciones fijas sobre cada
    // imagen (coords. locales a la imagen + offset lateral de la imagen en la sala).
    // Barrera ventana 156,327 → 199,403 · Luz ventana 156,418 → 199,479
    // Barrera puerta  201,280 → 244,360 · Luz puerta  201,375 → 244,446
    this.panel = {
      barreraV: new WallButton(this, {
        x: WINDOW_X + 156, y: 327, width: 43, height: 76,
        label: 'Barrera ventana (V)', onDown: () => this.window.toggle()
      }),
      luzV: new WallButton(this, {
        x: WINDOW_X + 156, y: 418, width: 43, height: 61,
        label: 'Luz ventana (O)', onDown: () => this.luzV.toggle()
      }),
      barreraP: new WallButton(this, {
        x: DOOR_X + 201, y: 280, width: 43, height: 80,
        label: 'Barrera puerta (P)', labelSide: 'left', onDown: () => this.door.toggle()
      }),
      luzP: new WallButton(this, {
        x: DOOR_X + 201, y: 375, width: 43, height: 71,
        label: 'Luz puerta (L)', labelSide: 'left', onDown: () => this.luzP.toggle()
      })
    };

    // Barra inferior: solo queda el acceso a las cámaras.
    this.buttons = {
      cams: new UiButton(this, {
        x: 480, y: 574, label: 'Cámaras', shortcut: 'C',
        onDown: () => this.cams.toggle()
      })
    };

    // Vista de cámaras: capa de pantalla completa, también fija.
    this.camUI = this.add.container(0, 0).setDepth(30).setVisible(false);
    this.camUI.add(
      this.add.rectangle(SCREEN.width / 2, SCREEN.height / 2, SCREEN.width, SCREEN.height, 0x000000, 0.88)
    );

    // Contenedor para la imagen de la cámara con paneo automático
    this.camImageContainer = this.add.container(SCREEN.width / 2, SCREEN.height / 2);
    this.camImage = this.add.image(0, 0, 'camCabinaIzq').setOrigin(0.5);
    this.camImageContainer.add(this.camImage);
    this.camUI.add(this.camImageContainer);

    // Texto de cámara en la parte superior derecha
    this.camText = this.add
      .text(SCREEN.width - 16, 16, '', { fontSize: '18px', color: '#0ff', align: 'right' })
      .setOrigin(1, 0);
    this.camHint = this.add
      .text(SCREEN.width / 2, SCREEN.height - 80, 'Flechas Izq/Der para cambiar cámara · Clic o C para volver a la sala', {
        fontSize: '14px',
        color: '#aaa'
      })
      .setOrigin(0.5);
    this.camUI.add([this.camText, this.camHint]);

    // Botones para cambiar de cámara, justo debajo del texto indicativo.
    const stopAndRun = (action) => (pointer, localX, localY, event) => {
      // Evita que el clic se propague al contenedor de cámaras (que vuelve a la sala).
      event?.stopPropagation?.();
      action();
    };
    this.camButtons = {
      prev: new UiButton(this, {
        x: SCREEN.width - 220, y: 54, label: '◀ Anterior', depth: 31,
        onDown: stopAndRun(() => { this.cams.prev(); this.onCameraChanged(); })
      }),
      next: new UiButton(this, {
        x: SCREEN.width - 78, y: 54, label: 'Siguiente ▶', depth: 31,
        onDown: stopAndRun(() => { this.cams.next(); this.onCameraChanged(); })
      })
    };
    this.camButtons.prev.setVisible(false);
    this.camButtons.next.setVisible(false);

    // Mini mapa en la parte inferior derecha con transparencia
    this.miniMap = this.add.image(SCREEN.width - 8, SCREEN.height - 8, 'miniMapa')
      .setOrigin(1, 1)
      .setAlpha(0.6)
      .setScale(0.8);
    this.camUI.add(this.miniMap);

    this.camUI.setInteractive(new Phaser.Geom.Rectangle(0, 0, SCREEN.width, SCREEN.height), Phaser.Geom.Rectangle.Contains);
    this.camUI.on('pointerdown', () => this.cams.toggle());

    // Paneo automático para las cámaras
    this.camPanTween = null;
    this.camPanDirection = 1;
  }

  bindKeys() {
    const kb = this.input.keyboard;
    kb.on('keydown-L', () => this.luzP.toggle());
    kb.on('keydown-P', () => this.door.toggle());
    kb.on('keydown-C', () => this.cams.toggle());
    kb.on('keydown-O', () => this.luzV.toggle());
    kb.on('keydown-V', () => this.window.toggle());
    kb.on('keydown-LEFT', () => { if (this.cams.visible) { this.cams.prev(); this.onCameraChanged(); } });
    kb.on('keydown-RIGHT', () => { if (this.cams.visible) { this.cams.next(); this.onCameraChanged(); } });
  }

  onCameraChanged() {
    // Cambiar imagen de cámara
    const key = this.cams.getActiveKey();
    if (this.textures.exists(key)) {
      this.camImage.setTexture(key);
    } else {
      this.camImage.setTexture('camCabinaIzq');
    }
    // Reiniciar paneo automático
    this.startCameraPan();
  }

  startCameraPan() {
    if (this.camPanTween) {
      this.camPanTween.stop();
    }
    // Resetear posición
    this.camImageContainer.setPosition(SCREEN.width / 2, SCREEN.height / 2);
    this.camImage.setScale(1);
    
    // Calcular escalado para cubrir la pantalla
    const camWidth = this.camImage.width;
    const camHeight = this.camImage.height;
    const scaleX = SCREEN.width / camWidth;
    const scaleY = SCREEN.height / camHeight;
    const scale = Math.max(scaleX, scaleY) * 1.1; // Un poco más grande para poder panear
    this.camImage.setScale(scale);
    
    // Paneo lento y automático (más pequeño que el de sala de seguridad)
    const maxPanX = (this.camImage.displayWidth - SCREEN.width) / 2;
    const maxPanY = (this.camImage.displayHeight - SCREEN.height) / 2;
    
    if (maxPanX > 5 || maxPanY > 5) {
      this.camPanTween = this.tweens.add({
        targets: this.camImageContainer,
        x: { from: SCREEN.width / 2 - maxPanX * 0.3, to: SCREEN.width / 2 + maxPanX * 0.3 },
        y: { from: SCREEN.height / 2 - maxPanY * 0.2, to: SCREEN.height / 2 + maxPanY * 0.2 },
        duration: 8000, // Más lento
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  // Muestra u oculta los botones de la pared (se ocultan en la vista de cámaras).
  setVisiblePanel(visible) {
    Object.values(this.panel).forEach((b) => b.setVisible(visible));
  }

  update(_time, delta) {
    const dt = delta / 1000;
    this.clock.update(delta);
    this.battery.drain(dt, {
      door: this.door.isClosed(),
      window: this.window.isClosed(),
      cameras: this.cams.visible,
      lights: (this.luzP.isOn() ? 1 : 0) + (this.luzV.isOn() ? 1 : 0),
      // Robot 1: su número propio escala el consumo de batería (GDD).
      multiplier: this.enemies.batteryMultiplier(this.clock.getCurrentHour())
    });

    // IA de enemigos: recibe el estado de puerta/ventana/batería y avisa derrotas.
    this.enemies.update(dt, {
      hour: this.clock.getCurrentHour(),
      doorClosed: this.door.isClosed(),
      windowClosed: this.window.isClosed(),
      batteryEmpty: this.battery.isEmpty(),
      camsVisible: this.cams.visible
    });
    if (this._defeated) return;

    this.camUI.setVisible(this.cams.visible);
    this.camButtons.prev.setVisible(this.cams.visible);
    this.camButtons.next.setVisible(this.cams.visible);

    // Los botones de la pared siguen el paneo y se ocultan con la vista de cámaras.
    Object.values(this.panel).forEach((b) => b.update(this.pan, this.roomScale));
    this.setVisiblePanel(!this.cams.visible);

    if (this.cams.visible) {
      let label = `CÁMARA ${this.cams.activeIndex + 1}/10: ${this.cams.getActiveName()}`;
      if (this.cams.activeIndex === CAMERAS.EDIFICIO3) {
        const robot5 = this.enemies.getById(5);
        label += ` · ROBOT 5: ${robot5.phase < 4 ? `FASE ${robot5.phase}` : 'FUERA DE CÁMARA'}`;
      }
      this.camText.setText(label);
      // Iniciar paneo si acaba de entrar a cámaras
      if (!this._camPanned) {
        this.onCameraChanged();
        this._camPanned = true;
      }
    } else {
      this._camPanned = false;
      if (this.camPanTween) {
        this.camPanTween.stop();
        this.camPanTween = null;
      }
      // Paneo por mouse solo cuando se mira la sala.
      this.pan = this.panner.update({
        pointerX: this.input.activePointer.x,
        viewWidth: SCREEN.width,
        dt,
        current: this.pan,
        maxPan: this.maxPan
      });
      this.room.setX(-this.pan);

      this.puertaImg.setTexture(this.door.isClosed() ? 'puertaCerrada' : 'puertaAbierta');
      this.ventanaImg.setTexture(this.window.isClosed() ? 'ventanaCerrada' : 'ventanaAbierta');
      this.luzPImg.setTexture(this.luzP.isOn() ? 'luzPPrendida' : 'luzPApagada');
      this.luzVImg.setTexture(this.luzV.isOn() ? 'luzVPrendida' : 'luzVApagada');
    }

    // HUD de la sala: únicamente hora y batería.
    const text =
      `Hora: ${this.clock.getLabel()}   Batería: ${Math.ceil(this.battery.level)}%`;
    this.hud.setText(text);

    // Dibujo de los robots según su estado (oficina / cámara activa).
    this.enemyView.update(this.enemies, {
      cams: this.cams,
      doorOpen: !this.door.isClosed(),
      windowOpen: !this.window.isClosed()
    });

    this.buttons.cams.setActive(this.cams.visible);
    this.panel.barreraP.setActive(this.door.isClosed());
    this.panel.luzP.setActive(this.luzP.isOn());
    this.panel.barreraV.setActive(this.window.isClosed());
    this.panel.luzV.setActive(this.luzV.isOn());

    if (this.clock.isFinished() && !this._nightComplete) {
      this._nightComplete = true;
      // Siempre pasa por la pantalla de victoria; ella decide a dónde seguir.
      this.scene.start('Ganar', {
        nextScene: this.getNextAfterVictoryScene(),
        levelLabel: this.getLevelLabel()
      });
    }
  }
}
