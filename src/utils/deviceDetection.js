// Détection et optimisation par appareil

/**
 * Détecte le type d'appareil
 */
export function getDeviceType() {
  const ua = navigator.userAgent;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Détecte si c'est un iPhone
 */
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Détecte si c'est Android
 */
export function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

/**
 * Détecte si c'est Safari
 */
export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
 * Détecte la taille de l'écran
 */
export function getScreenSize() {
  const width = window.innerWidth;

  if (width < 375) return 'xs'; // Petits téléphones (iPhone SE)
  if (width < 428) return 'sm'; // Téléphones standards
  if (width < 768) return 'md'; // Grands téléphones
  if (width < 1024) return 'lg'; // Tablettes
  return 'xl'; // Desktop
}

/**
 * Détecte si l'appareil a un notch/encoche (iPhone X+)
 */
export function hasNotch() {
  if (!isIOS()) return false;

  // iPhone X et plus ont un ratio d'aspect spécifique
  const ratio = window.screen.width / window.screen.height;
  return ratio > 0.4 && ratio < 0.5;
}

/**
 * Détecte si l'app est installée (mode standalone)
 */
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * Détecte l'orientation
 */
export function getOrientation() {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * Obtient les safe areas (pour iPhone X+)
 */
export function getSafeAreas() {
  if (!CSS.supports('padding: env(safe-area-inset-top)')) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
  };
}

/**
 * Optimise les performances selon l'appareil
 */
export function getPerformanceSettings() {
  const deviceType = getDeviceType();
  const screenSize = getScreenSize();

  // Paramètres bas de gamme pour petits appareils
  if (deviceType === 'mobile' && screenSize === 'xs') {
    return {
      enableAnimations: false,
      enableShadows: false,
      enableGradients: false,
      quality: 'low'
    };
  }

  // Paramètres moyens pour téléphones standards
  if (deviceType === 'mobile') {
    return {
      enableAnimations: true,
      enableShadows: true,
      enableGradients: true,
      quality: 'medium'
    };
  }

  // Paramètres haute qualité pour tablettes/desktop
  return {
    enableAnimations: true,
    enableShadows: true,
    enableGradients: true,
    quality: 'high'
  };
}

/**
 * Configure les meta tags dynamiquement selon l'appareil
 */
export function setupDeviceOptimizations() {
  const device = getDeviceType();
  const ios = isIOS();
  const android = isAndroid();

  // Ajouter classe CSS au body
  document.body.classList.add(`device-${device}`);
  if (ios) document.body.classList.add('device-ios');
  if (android) document.body.classList.add('device-android');
  if (hasNotch()) document.body.classList.add('device-notch');
  if (isStandalone()) document.body.classList.add('app-standalone');

  // Désactiver le bounce scroll sur iOS
  if (ios) {
    document.body.style.overscrollBehavior = 'none';
  }

  // Gérer les changements d'orientation
  window.addEventListener('orientationchange', () => {
    const orientation = getOrientation();
    document.body.classList.remove('orientation-portrait', 'orientation-landscape');
    document.body.classList.add(`orientation-${orientation}`);
  });

  console.log('📱 Appareil détecté:', {
    type: device,
    os: ios ? 'iOS' : android ? 'Android' : 'Other',
    screenSize: getScreenSize(),
    hasNotch: hasNotch(),
    standalone: isStandalone(),
    orientation: getOrientation()
  });
}

/**
 * Optimise le viewport pour l'appareil
 */
export function setupViewport() {
  let viewport = document.querySelector('meta[name="viewport"]');

  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }

  const ios = isIOS();
  const android = isAndroid();

  // Viewport optimisé pour iOS
  if (ios) {
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
  }
  // Viewport optimisé pour Android
  else if (android) {
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
  }
  // Viewport par défaut
  else {
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
  }
}

/**
 * Hook pour écouter les changements de taille d'écran
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState(getScreenSize());

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

/**
 * Retourne les dimensions optimales pour les images selon l'appareil
 */
export function getOptimalImageSize() {
  const screenSize = getScreenSize();
  const devicePixelRatio = window.devicePixelRatio || 1;

  const sizes = {
    xs: { avatar: 120, card: 300, full: 600 },
    sm: { avatar: 150, card: 375, full: 750 },
    md: { avatar: 200, card: 400, full: 800 },
    lg: { avatar: 250, card: 500, full: 1000 },
    xl: { avatar: 300, card: 600, full: 1200 }
  };

  const base = sizes[screenSize] || sizes.sm;

  // Multiplier par devicePixelRatio pour les écrans retina
  return {
    avatar: Math.round(base.avatar * Math.min(devicePixelRatio, 2)),
    card: Math.round(base.card * Math.min(devicePixelRatio, 2)),
    full: Math.round(base.full * Math.min(devicePixelRatio, 2))
  };
}

/**
 * Détecte les capacités de l'appareil
 */
export function getDeviceCapabilities() {
  return {
    touchScreen: 'ontouchstart' in window,
    vibration: 'vibrate' in navigator,
    geolocation: 'geolocation' in navigator,
    notifications: 'Notification' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })(),
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })()
  };
}

// Initialiser automatiquement au chargement
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupDeviceOptimizations();
      setupViewport();
    });
  } else {
    setupDeviceOptimizations();
    setupViewport();
  }
}
