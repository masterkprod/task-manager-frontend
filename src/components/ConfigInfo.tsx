'use client';

import { useEffect, useState } from 'react';
import { getEnvironmentInfo } from '@/lib/config';

/**
 * Componente para mostrar información de configuración
 * Útil para debugging y verificación de configuración
 */
export default function ConfigInfo() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const info = getEnvironmentInfo();
      setEnvInfo(info);
    } catch (error) {
      console.error('Error al obtener información del entorno:', error);
    }
  }, []);

  // Solo mostrar en desarrollo o si hay un parámetro de URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const showConfig = urlParams.get('config') === 'true';
    setIsVisible(process.env.NODE_ENV === 'development' || showConfig);
  }, []);

  if (!isVisible || !envInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-secondary-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-secondary-900">Configuración</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-secondary-400 hover:text-secondary-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-medium text-secondary-700">Entorno:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              envInfo.isDevelopment 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {envInfo.nodeEnv}
            </span>
          </div>
          
          <div>
            <span className="font-medium text-secondary-700">API URL:</span>
            <div className="mt-1 p-2 bg-secondary-50 rounded text-xs font-mono break-all">
              {envInfo.apiUrl}
            </div>
          </div>
          
          <div className="pt-2 border-t border-secondary-200">
            <p className="text-secondary-600">
              💡 Para cambiar la configuración, edita las variables de entorno
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
