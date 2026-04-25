// component/3d/scene.jsx
'use client';

import { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';

// Lazy loading du Canvas pour réduire le bundle initial
const Scene3D = dynamic(
  () => import('./Scene3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement de la scène 3D...</div>
      </div>
    )
  }
);

export default function Lazy3DPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Initialisation...</div>
      </div>
    }>
      <Scene3D />
    </Suspense>
  );
}