
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface QRDesignSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

const QRDesignSelector: React.FC<QRDesignSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  const designs = [
    {
      id: 'classic',
      name: 'Classic',
      preview: (
        <div className="w-16 h-16 border-2 border-gray-300 bg-white p-1">
          <div className="grid grid-cols-5 gap-0.5 w-full h-full">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'dots',
      name: 'Dots',
      preview: (
        <div className="w-16 h-16 border-2 border-gray-300 bg-white p-1 flex items-center justify-center">
          <div className="grid grid-cols-5 gap-0.5 w-full h-full items-center justify-items-center">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'rounded',
      name: 'Rounded',
      preview: (
        <div className="w-16 h-16 border-2 border-gray-300 bg-white p-1">
          <div className="grid grid-cols-5 gap-0.5 w-full h-full">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`w-full h-full rounded ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'gradient',
      name: 'Gradient',
      preview: (
        <div className="w-16 h-16 border-2 border-gray-300 bg-gradient-to-br from-blue-500 to-purple-600 p-1">
          <div className="grid grid-cols-5 gap-0.5 w-full h-full">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`w-full h-full rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'circular',
      name: 'Circular',
      preview: (
        <div className="w-16 h-16 border-2 border-gray-300 bg-white rounded-full p-2 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-0.5 w-full h-full items-center justify-items-center">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${Math.random() > 0.5 ? 'bg-blue-600' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'artistic',
      name: 'Artistic',
      preview: (
        <div className="w-16 h-16 border-2 border-gray-300 bg-gradient-to-tr from-green-400 to-blue-500 p-1">
          <div className="grid grid-cols-5 gap-0.5 w-full h-full">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`w-full h-full ${Math.random() > 0.6 ? 'bg-white' : 'bg-transparent'} ${i % 3 === 0 ? 'rounded-full' : 'rounded'}`} />
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <Label>Select QR Code Template</Label>
      <div className="grid grid-cols-3 gap-3">
        {designs.map((design) => (
          <Card
            key={design.id}
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedStyle === design.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onStyleChange(design.id)}
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center">{design.preview}</div>
              <p className="text-xs font-medium">{design.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QRDesignSelector;
