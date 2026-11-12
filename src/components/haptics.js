// Light haptic "tick" for touch interactions, where the device allows it.
//
// - Android browsers support the Vibration API: a short 8 ms pulse feels like a tick.
// - iOS Safari has no vibration API, but since iOS 18 toggling an iOS-style switch
//   (<input type="checkbox" switch>) plays the system selection haptic. A hidden switch
//   is clicked to borrow that tick. This is unofficial and may stop working in a future
//   iOS; where it does nothing, nothing breaks.
//   From iOS 26.5 Safari only plays it when a real finger tap toggles the switch, not a
//   click from code. So glass bars on iPhone/iPad cover themselves with an invisible
//   switch label (see needsTapLayer and useGlassLens): taps tick, but nothing can tick
//   during a drag, because a drag is not a tap.
// - Laptops and desktops have no web-accessible haptics, so this is a no-op there.

let iosSwitch = null;

function getIosSwitch() {
  if (iosSwitch && iosSwitch.isConnected) return iosSwitch;
  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  input.tabIndex = -1;
  label.appendChild(input);
  document.body.appendChild(label);
  iosSwitch = label;
  return label;
}

export default function haptic() {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(8);
      return;
    }
    getIosSwitch().click();
  } catch {
    /* haptics are a nicety; never let them throw */
  }
}

// Touch-first device without the Vibration API: iPhone or iPad Safari (any iOS browser)
export function needsTapLayer() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (typeof navigator.vibrate === 'function') return false;
  return !!window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;
}
