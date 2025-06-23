
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface QRDesignSelectorProps {
  selectedStyle: 'square' | 'dots' | 'rounded';
  onStyleChange: (style: 'square' | 'dots' | 'rounded') => void;
}

const QRDesignSelector: React.FC<QRDesignSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  const designs = [
    {
      id: 'square' as const,
      name: 'Classic Square',
      preview: (
        <div className="grid grid-cols-5 gap-1 w-16 h-16">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} border border-gray-200`} />
          ))}
        </div>
      )
    },
    {
      id: 'dots' as const,
      name: 'Dots',
      preview: (
        <div className="grid grid-cols-5 gap-1 w-16 h-16 items-center justify-items-center">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
          ))}
        </div>
      )
    },
    {
      id: 'rounded' as const,
      name: 'Rounded',
      preview: (
        <div className="grid grid-cols-5 gap-1 w-16 h-16">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <Label>QR Code Design</Label>
      <div className="grid grid-cols-3 gap-3">
        {designs.map((design) => (
          <Card
            key={design.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
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
