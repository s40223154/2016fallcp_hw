// m = new THREE.MeshBasicMaterial({color: 0x606060, wireframe:true});
// m = new THREE.MeshLambertMaterial( { color: 0x111111 } );
// m = new THREE.MeshNormalMaterial();

$(function(){

// Extend String
String.prototype.lpad = function(len, chr) {
  // console.log(n, len, chr);
  if (chr === undefined) chr = '&nbsp;';
  var s = this+'', need = len - s.length;
  if (need > 0) s = new Array(need+1).join(chr) + s;
  return s;
};

String.prototype.zeroPad = function(n, len) {
  return s.lpad(len, '0');
};

// Extend Object3D, then we can do anything
var p = THREE.Object3D.prototype;
p.rx = p.ry = p.rz = 0;
p.vx = p.vy = p.vz = 0;

// Find out how to 'subclass' in JS. Just copy the prototype?
p.rotate = function(xr,yr,zr) {
  this.rotation.x += xr;
  this.rotation.y += yr;
  this.rotation.z += zr;
};

p.move = function(xd,yd,zd) {
  this.position.x += xd;
  this.position.y += yd;
  this.position.z += zd;
};

p.stop = function() {
  this.rx = this.ry = this.rz = 0;
  this.vx = this.vy = this.vz = 0;
};

// Add an onAnimate handler to all mesh objects
// so we can use map()
p.onAnimate = function() {
  this.rotate(this.rx, this.ry, this.rz);
  this.move(this.vx, this.vy, this.vz);
};

// The app is a singleton
var deltabotApp = (function(){

  // private variables and functions go here
  var self,
      renderer, camera, scene, keyboard, cube,
      divSize = {w:640,h:480},
      divAspect = 4/3,
      keyboardOn = true,
      pi2 = Math.PI * 2;

  // Return this anonymous object as deltabotApp
  return {
    rod_radius: 4,
    bot_radius: 155,
    bot_height: 520,
    rod_spacing: 30,
    eff_spacing: 30,
    arm_length: 240,
    arm_radius: 5/2,
    effector_radius: 40,
    carriage_inset: 25,
    carriage_height: 30,

    effector_hash: 0,
    effector_height: 10,
    effector_endstop_z: 0,
    effector_zero_z: 0,
    effector_nub: [],
    effector_nub_ctr: [],

    platform_height: 10,

    arm_height_at_0_0: 0,
    arm_pos: [ [[0,0],[0,0]], [[0,0],[0,0]], [[0,0],[0,0]], [[0,0],[0,0]], [[0,0],[0,0]], [[0,0],[0,0]] ],

    arm: [], // 6 of these, arm_pos will probably end up as a property
    vrod: [], // 6 of these
    towerpos: [], // tower position is exactly between the rods
    rodpos: [], // just x-y needed
    platform: [], // up to 4 platforms
    carriage: [], // three carriages, which could be grouped meshes
    carriageY: [0,0,0],
    effector: null, // the single effector
    pressed: {w:false,a:false,s:false,d:false},
    homeState: 0,

    // Center-to-center distance of the holes in the diagonal push rods.
    DELTA_DIAGONAL_ROD: 240, // mm

    // Horizontal offset from middle of printer to smooth rod center.
    DELTA_SMOOTH_ROD_OFFSET: 195, // mm

    // Horizontal offset of the universal joints on the end effector.
    // (This could be considered the outer radius of the effector.)
    DELTA_EFFECTOR_OFFSET: 40, // mm

    // Horizontal offset of the universal joints on the carriages.
    // That is, how far towards the center 
    DELTA_CARRIAGE_OFFSET: 25, // mm

    init: function() {
      self = this; // a 'this' for use when 'this' is something else
      keyboard = new THREEx.KeyboardState();
      renderer = this.initRenderer();
      scene = this.initScene();
      camera = this.initCamera(scene);
      // cube = this.addCubeToScene(scene);
      this.initBotGeometry();
      this.initDeltabot();
      window.addEventListener('resize', this.handleResize, false);
      this.renderLoop();
    },

    // Create a Three.js WebGL Renderer
    initRenderer: function() {
      var r = new THREE.WebGLRenderer();
      self.reinitRendererSize(r);
      document.body.appendChild(r.domElement);
      return r;
    },

    // Create a Perspective camera, outside of the scene
    initCamera: function() {
      // Make a camera in front of the center point
      var c = new THREE.PerspectiveCamera(35, divSize.w/divSize.h, 0.1, 5000);
      c.position.z = self.bot_radius + 550;
      return c;
    },

    reinitRendererSize: function(r) {
      var w = window.innerWidth, h = window.innerHeight;
      divSize = {w:w,h:h};
      divAspect = w/h;
      r.setSize(w, h);
    },

    handleResize: function() {
      self.reinitRendererSize(renderer);
      camera.aspect = divAspect;
      camera.updateProjectionMatrix();
    },

    sceneDidLoad: function(s) { },
    loadScene: function(sceneURL) { },

    initScene: function() {
      var s = new THREE.Scene();

      // some ambient lighting
      s.add(THREE.AmbientLight(0x303030));

      // a point light in the middle
      var light = new THREE.PointLight(0x888888);
      light.position.set( 0, 0, 0 );
      s.add(light);

      return s;
    },

    disposeScene: function() {
      var f = function(o) { scene.remove(o); };
      // vertical rods
      self.vrod.map(f)
      self.vrod = [];
      // platforms
      self.platform.map(f)
      self.platform = [];
      // effector
      if (self.effector != null) {
        scene.remove(self.effector);
        self.effector = null;
      }
      // arms
      self.arm.map(f);
      self.arm = [];
    },

    rebuildScene: function() {
      // self.disposeScene();
      self.initBotGeometry();
      self.initDeltabot();
    },

    towerPosition: function(n,r,ctr,sp) {
      var c = Math.floor(n/2) * (pi2/3) + (pi2/6), // angle to the tower
          p = new THREE.Vector3(Math.sin(c)*r, 0, Math.cos(c)*r); // the point on the perimeter
      if (ctr === undefined || !ctr) {
        if (sp === undefined) sp = self.rod_spacing;
        var sign = n % 2 ? -1 : 1,
            perp = c + pi2/4, // the perpendicular direction
            as = sign * sp/2; // half space between arms
        p.add(new THREE.Vector3(Math.sin(perp) * as, 0, Math.cos(perp) * as));
      }
      return p;
    },

    rodPosition: function(n,ctr) {
      return self.towerPosition(n,self.bot_radius,ctr);
    },

    updateCarriagesFromEffector: function() {
      var p = self.effector.position, al2 = self.arm_length_sq;

      for (var i=0; i<3; i++) {
        var t = self.towerpos[i], pc = p.clone().add(self.effector_nub_ctr[i]),
            y = Math.sqrt(al2 - Math.pow(t.x-pc.x, 2) - Math.pow(t.z-pc.z, 2)) + pc.y;
        // console.log(pc.y);
        self.carriage[i].position.y = y;
        self.carriageY[i] = y;
      }

      self.updateArmPositions();
    },

    initArms: function() {
      var g = new THREE.CylinderGeometry(self.arm_radius, self.arm_radius, self.arm_length, 12, 12, false),
          m = new THREE.MeshLambertMaterial( { color: 0x111111 } );
      // Create 6 delta arms
      // These could be locked to either end, or both maybe
      for (var n=0; n<6; n++) {
        if (self.arm[n] !== undefined) scene.remove(self.arm[n]);
        var c = self.arm[n] = new THREE.Mesh(g,m);
        c.matrixAutoUpdate = false;
        scene.add(c);
      }
      self.updateArmPositions();
    },

    updateArmPositions: function() {
      var e = self.effector, br = self.bot_radius;
      if (e) {
        var ep = e.position;
        for (var n=0; n<6; n++) {
          // get the ends of the arms
          // get the point halfway between the two
          // position the rod at that point
          // rotate the rod by the appropriate amounts
          var a = self.arm[n],
              cy = self.carriage[Math.floor(n/2+0.1)].position.y,
              end_t = self.towerPosition(n, br),
              end_e = self.effector_nub[n];
          
          a.position.set((end_t.x+end_e.x+ep.x)/2, (cy+ep.y)/2, (end_t.z+end_e.z+ep.z)/2);
          a.lookAt(new THREE.Vector3(end_t.x, cy, end_t.z));
          a.updateMatrix(); // apply lookAt to the matrix
          a.matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI/2));
        }
      }
    },

    initBotGeometry: function() {
      var br = self.bot_radius, bh = self.bot_height, ch = self.carriage_height,
          // al = Math.floor((br - self.carriage_inset) * 1.414);  // maybe?
          al = (br*2 - self.effector_radius*2 - self.carriage_inset) + ch;  // maybe?
          if (al > bh - ch/2) al = bh - ch/2;

      // precalculate some things
      self.arm_length = al;
      self.arm_length_sq = al * al;
      self.bh2 = bh/2;

      self.effector_endstop_z = self.bh2 - self.arm_length - self.carriage_height/2;
      self.effector_zero_z = -self.bh2 + self.effector_height/2;

      var er = self.effector_radius, sp = self.eff_spacing;
      for (var n=0; n<6; n++) {
        if (n%2==0) {
          self.towerpos[n/2] = self.rodPosition(n, true);
          self.effector_nub_ctr[n/2] = self.towerPosition(n, er, true);
        }
        self.rodpos[n] = self.rodPosition(n);
        self.effector_nub[n] = self.towerPosition(n, er, false, sp);
      }


      // Recalculate the length of the arms
      // for all the new dimensions
      self.DELTA_RADIUS = (self.DELTA_SMOOTH_ROD_OFFSET-self.DELTA_EFFECTOR_OFFSET-self.DELTA_CARRIAGE_OFFSET);

      // rod_space = total_radius - effector_radius - carriage_inset
      // 
      // Kossel Frame Calculator:
      //
      // Input   a = length of beam for a triangle
      //         b = vertical length
      // Output
      // a+60           : total width (including printed plastic corners)
      // a*0.72         : diameter of printable circle (if the print surface does not extend outside triangle)
      // a*0.72/sqrt(2) : width of printable square (inside printable circle)
      // a*0.8          : recommended length for diagonal arms (center to center distance of ball joints)
      // b-170-a*0.8    : estimated print height

      // TODO: First get and derive a, b from the inputs
      // 

      // Horizontal offset of the universal joints on the end effector.
      // (This could be considered the outer radius of the effector.)
      self.DELTA_EFFECTOR_OFFSET = self.effector_radius; // mm...

      // Horizontal offset of the universal joints on the carriages.
      // That is, how far towards the center. Just assume 25mm for now.
      self.DELTA_CARRIAGE_OFFSET = 25.0;

      // Center-to-center distance of the holes in the diagonal push rods.
      self.DELTA_DIAGONAL_ROD = 240.0;

      // Horizontal offset from middle of printer to smooth rod center.
      // This implies the middle point of the open area between joints. Is it?
      // (X - 15) / 2 = 195
      // X = 405
      self.DELTA_SMOOTH_ROD_OFFSET = 195.0;
      self.DELTA_SMOOTH_ROD_OFFSET = self.DELTA_CARRIAGE_OFFSET + (br - self.DELTA_CARRIAGE_OFFSET - self.DELTA_EFFECTOR_OFFSET)/2;
    },

    initDeltabot: function() {

      var br = self.bot_radius, rr = self.rod_radius;

      // Add deltabot elements to the scene
      // 2 rods per corner of the triangle

      var bot_diam = pi2 * br, // diameter
          rod_space = pi2 * self.rod_spacing/bot_diam, // space in degrees
          g = new THREE.CylinderGeometry(rr, rr, self.bot_height, 20, 20, false),
          m = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );

      for (var n=0; n<6; n++) {
        if (self.vrod[n] !== undefined) scene.remove(self.vrod[n]);
        var c = self.vrod[n] = new THREE.Mesh(g,m), p = self.rodpos[n];
        c.position = p;
        scene.add(c);
      }

      // Add the top and bottom platforms
      g = new THREE.CylinderGeometry(br + 10, br + 10, self.platform_height, 30, 30, false);
      m = new THREE.MeshLambertMaterial( { color: 0xFF8844 } );
      // Top and bottom platforms
      for (var n=0; n<2; n++) {
        if (self.platform[n] !== undefined) scene.remove(self.platform[n]);
        var c = self.platform[n] = new THREE.Mesh(g,m), plat_sign = n % 2 ? 1 : -1;
        c.position.set(0, (plat_sign*(self.bh2+self.platform_height/2)), 0);
        scene.add(c);
      }
      self.initCarriages();
      self.initEffector();
      self.initArms();
      self.reorientCamera();
      self.updateStats();
    },

    initCarriages: function() {
      var rr = self.rod_radius,
          g = new THREE.CylinderGeometry(rr + 2, rr + 2, self.carriage_height, 30, 30, false),
          q = new THREE.CubeGeometry(self.rod_spacing, self.carriage_height - 6, rr),
          m = new THREE.MeshLambertMaterial( { color: 0x66FF66 } );

      // Three pillars, each with a carriage
      for (var i=0; i<3; i++) {
        if (self.carriage[i] !== undefined) scene.remove(self.carriage[i]);
        var carriage_group = self.carriage[i] = new THREE.Object3D();

        // Add two cylinders
        for (var n=0; n<2; n++) {
          var p = self.rodpos[i * 2 + n],
              c = new THREE.Mesh(g,m);
          c.position = p;
          carriage_group.add(c);
        }

        // And one plate between the cylinders
        var c = new THREE.Mesh(q,m), cp = self.rodPosition(i * 2, true);
        c.position = cp;
        c.rotation.set(0, i*(pi2/3)+(pi2/6), 0);
        carriage_group.add(c);

        // Add the Z carriage to the scene
        scene.add(carriage_group);

        // self.bounceThing(carriage_group);
      }
    },

    initEffector: function() {
      self.effector_height = 10;
      // Try loading the STL first
      if (true) {
        var loader = new THREE.STLLoader();
        loader.load('./stl/effector.stl', function(g){ self.effectorLoaded(g, true); });
      }
      else {
        var r = self.effector_radius, g = new THREE.CylinderGeometry(r, r, 10, 36, 36, false);
        self.effectorLoaded(g, false);
      }
    },

    effectorLoaded: function(g,doRotate) {
      // Clear the stats timer for the effector
      if (self.statsTimer !== undefined) window.clearInterval(self.statsTimer);
      if (self.effector !== undefined) scene.remove(self.effector);
      var grp = self.effector = new THREE.Object3D(),
          m = new THREE.MeshLambertMaterial( { color: 0xFF4488 } ),
          c = new THREE.Mesh(g,m);
      if (doRotate !== undefined && doRotate) c.rotation.set(Math.PI/2,0,0);

      grp.add(c);

      grp.add(new THREE.Mesh(new THREE.CubeGeometry(10,10,10), m));

      grp.position.set(0, -self.bot_height/4, 0);
      scene.add(grp);
      grp.onAnimate = self.effectorAnimate;

      // Show stats for the effector on a timer
      self.statsTimer = window.setInterval(self.updateEffectorStats, 100);
    },

    effectorAnimate: function() {
      THREE.Object3D.prototype.onAnimate.call(this);
      var p = this.position, x = p.x, z = p.z,
          r2 = x*x+z*z, br = self.bot_radius - self.effector_radius, br2 = br*br;
          // self.logOnce(p.x + "," + z + " | " + x + "," + z);
          // console.log(x + " " + y + " " + r2);
      if (r2 > br2) {
        a = Math.atan2(x,z);
        p.x = Math.sin(a) * br;
        p.z = Math.cos(a) * br;
      }
      var maxy = self.effector_endstop_z, miny = -self.bh2 + self.effector_height/2;
      if (p.y > maxy) { p.y = maxy; this.vy = 0; }
      if (p.y < miny) { p.y = miny; this.vy = 0; }

      self.updateCarriagesFromEffector();
    },

    homeEffector: function() {
      self.homeState = 1;
      self.effector.stop();
      self.homeTimer = window.setInterval(self.updateHoming, 1000/60);
    },

    updateHoming: function() {
      var m = 0.5,
          p = self.effector.position,
          hs = self.homeState,
          zeroxy = hs > 1,
          dx = zeroxy ? 0 : p.x,
          dy = zeroxy ? 0 : p.z,
          dz = hs == 3 ? self.effector_zero_z : self.effector_endstop_z,
          dest = new THREE.Vector3(dx, dz, dy),
          pc = p.clone().sub(dest).multiplyScalar(-1/10);
          // console.log(pc.x);

          if ((hs == 1 && pc.y > -m && pc.y < m)
              || (hs == 2 && pc.x > -m && pc.x < m && pc.z > -m && pc.z < m)
              || (hs == 3 && Math.floor(p.y) == self.effector_zero_z)
             ) {
            if (++hs > 3) {
              hs = 0;
              window.clearInterval(self.homeTimer);
            }
            self.homeState = hs;
          }
      p.add(pc);
    },

    setBotHeight: function(len) {
      self.bot_height = len;
      self.rebuildScene();
    },

    setBotRadius: function(r) {
      self.bot_radius = r;
      self.rebuildScene();
    },

    setArmSpacing: function(s) {
      if (s < 1) s = 1;
      if (s > self.bot_radius) s = self.bot_radius;
      self.rod_spacing = s;
      self.rebuildScene();
    },

    reorientCamera: function() {
      var d1 = self.bot_radius * 2 + 200,
          d2 = self.bot_height * 2 + 50;
      camera.position.z = (d1 > d2) ? d1 : d2;
      camera.position.x = -80;

      if (cube !== undefined && cube != null) cube.position.set(0, -self.bh2 + 60, 0);
    },

    updateStats: function() {
      $('#bot-radius').html((self.bot_radius + 'mm').lpad(6));
      $('#bot-height').html((self.bot_height + 'mm').lpad(6));
      $('#arm-space').html((self.rod_spacing + 'mm').lpad(6));
      $('#arm-length').html((self.arm_length + 'mm').lpad(6));
    },

    updateEffectorStats: function() {
      var e = self.effector;
      if (e) {
        var p = e.position, hash = p.x +'|'+ p.y +'|'+ p.z;
        if (hash != self.effector_hash) {
          var b = self.bh2;
          self.effector_hash = hash;
          $('#effector-pos').html(
            '<span>X</span> ' + (''+Math.floor(p.x)).lpad(4) + 'mm &nbsp;' +
            '<span>Y</span> ' + (''+Math.floor(p.z)).lpad(4) + 'mm &nbsp;' +
            '<span>Z</span> ' + (''+Math.floor(p.y + b - self.effector_height/2)).lpad(4) + 'mm');

          $('#deltas').html(
            '<span>A</span> ' + (''+Math.floor(self.carriageY[1] + b)).lpad(4) + 'mm &nbsp;' +
            '<span>B</span> ' + (''+Math.floor(self.carriageY[0] + b)).lpad(4) + 'mm &nbsp;' +
            '<span>C</span> ' + (''+Math.floor(self.carriageY[2] + b)).lpad(4) + 'mm');
        }
      }
    },

    addCubeToScene: function(s) {
      var g = new THREE.CubeGeometry(50,100,50),
      // var g = new THREE.CylinderGeometry(25, 50, 100, 10, 10, false),
          m = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, wireframe:true } ),
          c = new THREE.Mesh(g, m);
      c.opacity = 0.5;
      s.add(c);
      return c;
    },

    renderLoop: function () {
      // request that this be called again
      requestAnimationFrame(self.renderLoop);

      // Call onAnimate for everything in the scene
      scene.children.map(function(o){ o.onAnimate(); });

      // Each renderer has a browser canvas, so only one renderer per canvas
      self.render();
      self.update();
    },

    singlePress: function(k) {
      if (keyboard.pressed(k)) {
        if (!self.pressed[k]) {
          self.pressed[k] = true;
          return true;
        }
      } else if (self.pressed[k]) {
        self.pressed[k] = false;
      }
      return false;
    },

    update: function() {

      if (!keyboardOn || self.homeState) return;

      // Polling is going to be slower than a keyboard event handler
      // This is pretty cool stuff, though
      var t = keyboard.pressed("shift+up"), b = keyboard.pressed("shift+down"),
          u = !t && keyboard.pressed("up"), d = !b && keyboard.pressed("down"),
          l = keyboard.pressed("left"), r = keyboard.pressed("right");

      var e = self.effector, speed = 0.2, damp = 0.1;
      if (e) {
        if (u || d) {
          if (u) e.vz -= speed;
          if (d) e.vz += speed;
        }
        else
          e.vz *= damp;

        if (l || r) {
          if (l) e.vx -= speed;
          if (r) e.vx += speed;
        }
        else
          e.vx *= damp;

        if (t || b) {
          if (t) e.vy += speed;
          if (b) e.vy -= speed;
        }
        else
          e.vy *= damp;
      }

      if (self.singlePress("w")) { cube.rx -= 0.01; }
      if (self.singlePress("s")) { cube.rx += 0.01; }
      if (self.singlePress("a")) { cube.ry -= 0.01; }
      if (self.singlePress("d")) { cube.ry += 0.01; }
      if (self.singlePress("q")) { cube.rz += 0.01; }
      if (self.singlePress("e")) { cube.rz -= 0.01; }
      // if (self.singlePress(" ")) { cube.rx = cube.ry = cube.rz = 0; cube.rotation.set(0,0,0); }
      if (self.singlePress(" ")) { self.homeEffector(); }

      // Randomize the deltabot
      if (self.singlePress("z")) {
        self.bot_height = Math.floor(Math.random() * 350 + 200);
        self.bot_radius = Math.floor(Math.random() * 200 + 50);
        self.rod_spacing = Math.floor(self.bot_radius/6 + Math.random()*self.bot_radius/3);
        if (self.rod_spacing < 20) self.rod_spacing = 20;
        self.initBotGeometry();
        self.initDeltabot();
      }

      if (self.singlePress("g")) { self.setArmSpacing(self.rod_spacing - 2); }
      if (self.singlePress("h")) { self.setArmSpacing(self.rod_spacing + 2); }

      if (self.singlePress("k")) { self.setBotHeight(self.bot_height - 5); }
      if (self.singlePress("i")) { self.setBotHeight(self.bot_height + 5); }
      if (self.singlePress("j")) { self.setBotRadius(self.bot_radius - 5); }
      if (self.singlePress("l")) { self.setBotRadius(self.bot_radius + 5); }

      // controls.update();
      // stats.update();
    },

    // Tell the GL Renderer to show the scene for the given camera
    render: function() { renderer.render(scene, camera); },

    bounceThing: function(obj) {
      // Set each carriage object to animate with a callback
      // Just moving up and down at random for now
      obj.moveDir = -2;
      obj.wait = 60;
      obj.turn = 15;
      obj.onAnimate = function() {
        THREE.Object3D.prototype.onAnimate.call(this);
        if (this.wait > 0) {
          this.wait--; return;
        }
        if (this.turn > 0) this.turn--;
        this.position.y += this.moveDir;
        if (this.position.y < -self.bot_height/5 || this.position.y > self.bh2 - 23 || (this.turn <= 0 && Math.random() < 0.005)) {
          this.moveDir *= -1;
          this.turn = 10;
        }
      }
    },

    logOnce: function(o) {
      if (typeof o.didLogThisObject === 'undefined') {
        console.log(o);
        o.didLogThisObject = true;
      }
    },

    EOF: null
  };

})();

// Typically the app would be in its own file, but this would be here
deltabotApp.init();

});

// When loading a scene...

// var loader = new THREE.SceneLoader();

// loader.addGeometryHandler( "binary", THREE.BinaryLoader );
// loader.addGeometryHandler( "ctm", THREE.CTMLoader );
// loader.addGeometryHandler( "vtk", THREE.VTKLoader );
// loader.addGeometryHandler( "stl", THREE.STLLoader );

// loader.addHierarchyHandler( "obj", THREE.OBJLoader );
// loader.addHierarchyHandler( "dae", THREE.ColladaLoader );
// loader.addHierarchyHandler( "utf8", THREE.UTF8Loader );

// loader.callbackSync = callbackSync;
// loader.callbackProgress = callbackProgress;
// loader.load( "./test.scene.js", sceneDidLoad );

// console.log(loader);

// loader.load("./Deltabot.three.js", sceneDidLoad);

// var loader = new THREE.ObjectLoader(),
//     pard = JSON.parse( deltabotSceneJSON ),
//     scene = loader.parse( pard );
