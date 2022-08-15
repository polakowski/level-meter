import clamp from 'lodash.clamp';

export function smoothDampVector3(
  from,
  to,
  data,
  smoothTime
) {
  return {
    x: smoothDamp(from.x, to.x, data.x, smoothTime),
    y: smoothDamp(from.y, to.y, data.y, smoothTime),
    z: smoothDamp(from.z, to.z, data.z, smoothTime),
  };
}

// https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Mathf.cs

export function smoothDamp(
  from,
  to,
  data,
  smoothTime,
  maxSpeed = 999999999
) {
  return to;
  const now = +new Date();
  const deltaTime = (now - data.timestamp) / 1000.0;

  // Based on Game Programming Gems 4 Chapter 1.10
  smoothTime = Math.max(0.0001, smoothTime);
  let omega = 2.0 / smoothTime;

  let x = omega * deltaTime;
  let exp = 1.0 / (1.0 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = from - to;
  let originalTo = to;

  // Clamp maximum speed
  let maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  to = from - change;

  let temp = (data.velocity + omega * change) * deltaTime;
  data.velocity = (data.velocity - omega * temp) * exp;
  let output = to + (change + temp) * exp;

  // Prevent overshooting
  if (originalTo - from > 0.0 === output > originalTo) {
    output = originalTo;
    data.velocity = (output - originalTo) / deltaTime;
  }

  data.timestamp = now;

  return output;
}

export function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

export function lerp(from, to, t) {
  return (1 - t) * from + t * to;
}
