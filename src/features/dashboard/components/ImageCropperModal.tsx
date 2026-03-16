
import React from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';

interface ImageCropperModalProps {
    image: string;
    crop: { x: number; y: number };
    zoom: number;
    onCropChange: (crop: { x: number; y: number }) => void;
    onZoomChange: (zoom: number) => void;
    onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
    onClose: () => void;
    onApply: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
    image,
    crop,
    zoom,
    onCropChange,
    onZoomChange,
    onCropComplete,
    onClose,
    onApply
}) => {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[85vh] animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recortar Foto</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Enquadramento perfeito para o seu perfil</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white rounded-2xl transition shadow-sm"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="flex-grow relative bg-gray-900">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropComplete}
                        onZoomChange={onZoomChange}
                        cropShape="round"
                        showGrid={false}
                    />
                </div>

                <div className="p-10 bg-white space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Zoom Aplicado</span>
                            <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{(zoom * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => onZoomChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-5 rounded-[2rem] font-black text-gray-500 hover:bg-gray-50 transition border-2 border-transparent"
                        >
                            Descartar
                        </button>
                        <button
                            onClick={onApply}
                            className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-3"
                        >
                            <Check className="w-6 h-6" /> Aplicar Recorte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
