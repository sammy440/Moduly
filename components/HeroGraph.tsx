"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';

export function HeroGraph() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={20} />

                <Suspense fallback={null}>
                    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                        <Sphere args={[1, 100, 200]} scale={1.8}>
                            <MeshDistortMaterial
                                color="#5B9CFF"
                                speed={3}
                                distort={0.4}
                                radius={1}
                            />
                        </Sphere>
                    </Float>

                    <Float speed={2} rotationIntensity={2} floatIntensity={1}>
                        <mesh position={[2, 1, -2]}>
                            <octahedronGeometry args={[0.5, 0]} />
                            <meshStandardMaterial color="#CCFF00" wireframe />
                        </mesh>
                    </Float>

                    <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
                        <mesh position={[-3, -1, -3]}>
                            <torusGeometry args={[0.8, 0.2, 16, 100]} />
                            <meshStandardMaterial color="#9F7AEA" />
                        </mesh>
                    </Float>
                </Suspense>

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
