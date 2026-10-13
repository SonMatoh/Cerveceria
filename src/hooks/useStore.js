// ============================================================================
// Hook genérico para conectarse a los "stores" de persistencia.
// Usa useSyncExternalStore para que los componentes React se actualicen
// en tiempo real cada vez que cambia el archivo de persistencia.
// ============================================================================

import { useSyncExternalStore } from 'react';

export function useStore(suscribir, obtener) {
  return useSyncExternalStore(suscribir, obtener);
}
