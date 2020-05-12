function extend(ChildClass, ParentClass) {
  var parent = new ParentClass();
  ChildClass.prototype = parent;
  ChildClass.prototype.super = parent.constructor;
  ChildClass.prototype.constructor = ChildClass;
}

//####################*********The new mass constructor!!!***************###############################
function Mass(x, y, mass, radius, angle, x_speed, y_speed, rotation_speed) {
  this.x = x;
  this.y = y;
  this.mass = mass || 1;
  this.radius = radius || 50;
  this.angle = angle || 0;
  this.x_speed = x_speed || 0;
  this.y_speed = y_speed || 0;
  this.rotation_speed = rotation_speed || 0;
}

//first law
Mass.prototype.update = function (elapsed, ctx) {
  this.x += this.x_speed * elapsed;
  this.y += this.y_speed * elapsed;
  this.angle += this.rotation_speed * elapsed;
  this.angle %= 2 * Math.PI;
  if (this.x - this.radius > ctx.canvas.width) {
    this.x = -this.radius;
  }
  if (this.x + this.radius < 0) {
    this.x = ctx.canvas.width + this.radius;
  }
  if (this.y - this.radius > ctx.canvas.height) {
    this.y = -this.radius;
  }
  if (this.y + this.radius < 0) {
    this.y = ctx.canvas.height + this.radius;
  }
};

//second law
Mass.prototype.push = function (angle, force, elapsed) {
  this.x_speed += (elapsed * (Math.cos(angle) * force)) / this.mass;
  this.y_speed += (elapsed * (Math.sin(angle) * force)) / this.mass;
};

Mass.prototype.twist = function (force, elapsed) {
  this.rotation_speed += (elapsed * force) / this.mass;
};

//calc speed and angle
Mass.prototype.speed = function () {
  return Math.sqrt(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2));
};

Mass.prototype.movement_angle = function () {
  return Math.atan2(this.y_speed, this.x_speed);
};

//A Placeholder Mass.prototype.draw Method (overridden in any child classes)
Asteroid.prototype.draw = function (c) {
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  c.beginPath();
  c.arc(0, 0, this.radius, 0, 2 * Math.PI);
  c.lineTo(0, 0);
  c.strokeStyle = "#FFFFFF";
  c.stroke();
  c.restore();
};

//Draw asteroids function###########################################################################################################
//drawAsteroid(ctx, this.radius, this.shape, { guide: guide, noise: this.noise, c: this.color });
function drawAsteroid(ctx, radius, shape, options) {
  options = options || {};
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = "orange"; //1111111111111111111111111111111111111111111111111111111111111
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < shape.length; i++) {
    ctx.rotate((2 * Math.PI) / shape.length);
    ctx.lineTo(radius + radius * options.noise * shape[i], 0);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

//////
function Asteroid(x, y, mass, x_speed, y_speed, rotation_speed) {
  //////////////troubleshoot where called
  var density = 1; // kg per square pixel
  var radius = Math.sqrt(mass / density / Math.PI);
  this.super(x, y, mass, radius, 0, x_speed, y_speed, rotation_speed);
  this.circumference = 2 * Math.PI * this.radius;
  this.segments = Math.ceil(this.circumference / 15);
  this.segments = Math.min(25, Math.max(5, this.segments));
  this.noise = 0.2;
  this.shape = [];
  for (var i = 0; i < this.segments; i++) {
    this.shape.push(2 * (Math.random() - 0.5));
  }
}

extend(Asteroid, Mass);
Asteroid.prototype.draw = function (ctx, guide) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  drawAsteroid(ctx, this.radius, this.shape, {
    noise: this.noise,
    guide: guide
  });
  ctx.restore();
};

//draw##############################################################################
function draw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  drawGrid(context);
  asteroid.draw(context);
}

//update#########################################################################
function update(elapsed) {
  asteroid.update(elapsed, context);
}

//frame##########################################################################
function frame(timestamp) {
  if (!previous) previous = timestamp;
  var elapsed = timestamp - previous;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  update(elapsed / 1000);
  draw(context);

  previous = timestamp;
  window.requestAnimationFrame(frame);
}

//draw grid function##################################################################################################################
function drawGrid(ctx, minor, major, stroke, fill) {
  minor = minor || 10;
  major = major || minor * 5;
  stroke = stroke || "#00FF00";
  fill = fill || "#009900";
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  let width = ctx.canvas.width,
    height = ctx.canvas.height;
  for (var x = 0; x < width; x += minor) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.lineWidth = x % major == 0 ? 0.5 : 0.25;
    ctx.stroke();
    if (x % major == 0) {
      ctx.fillText(x, x, 10);
    }
  }
  for (var y = 0; y < height; y += minor) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.lineWidth = y % major == 0 ? 0.5 : 0.25;
    ctx.stroke();
    if (y % major == 0) {
      ctx.fillText(y, 0, y + 10);
    }
  }
  ctx.restore();
}
