'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiGet } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Step2Props {
  applicationId: string | null;
  onSave: (data: any) => Promise<void>;
  onNext: () => void;
}

export function Step2ApcdTypes({ applicationId: _applicationId, onSave, onNext }: Step2Props) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [advancedTechnologies, setAdvancedTechnologies] = useState<string[]>([]);
  const [newTechName, setNewTechName] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['apcd-categories'],
    queryFn: () => apiGet<{ success: boolean; data: any[] }>('/apcd-types/categories'),
  });
  const categories = response?.data;

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId],
    );
  };

  const addTechnology = () => {
    const name = newTechName.trim();
    if (name && !advancedTechnologies.includes(name)) {
      setAdvancedTechnologies((prev) => [...prev, name]);
      setNewTechName('');
    }
  };

  const removeTechnology = (index: number) => {
    setAdvancedTechnologies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    await onSave({
      apcdSelections: selectedTypes.map((typeId) => ({
        apcdTypeId: typeId,
        seekingEmpanelment: true,
      })),
      advancedTechnologies,
    });
    onNext();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800">Select APCD Types for Empanelment</h3>
        <p className="text-sm text-blue-700 mt-1">
          Choose the Air Pollution Control Device types you want to get empaneled for. Empanelment
          fee: ₹65,000 per APCD type (+ 18% GST).
        </p>
      </div>

      <div className="space-y-6">
        {categories?.map((category) => (
          <div key={category.id} className="space-y-3">
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {category.types?.map((type: any) => {
                const isSelected = selectedTypes.includes(type.id);

                return (
                  <Card
                    key={type.id}
                    className={cn(
                      'cursor-pointer transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'hover:border-primary/50',
                    )}
                    onClick={() => toggleType(type.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{type.name}</p>
                          {type.description && (
                            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                          )}
                        </div>
                        <div
                          className={cn(
                            'h-5 w-5 rounded-full border flex items-center justify-center',
                            isSelected ? 'bg-primary border-primary' : 'border-muted-foreground',
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* New Advance/Patented/Hybrid Technologies */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Label className="text-base font-semibold">
            New Advance / Patented / Hybrid Technologies
          </Label>
          <p className="text-sm text-muted-foreground">
            If you have any new, patented, or hybrid APCD technologies not listed above, please
            specify them here.
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={newTechName}
              onChange={(e) => setNewTechName(e.target.value)}
              placeholder="Enter technology name"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTechnology}
              disabled={!newTechName.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          {advancedTechnologies.length > 0 && (
            <div className="space-y-2">
              {advancedTechnologies.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{tech}</span>
                  <button
                    onClick={() => removeTechnology(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Selected APCD Types: {selectedTypes.length}</p>
            <p className="text-sm text-muted-foreground">
              Estimated Empanelment Fee: ₹
              {(selectedTypes.length * 65000 * 1.18).toLocaleString('en-IN')}
              (including GST)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onNext}>
          Skip for now
        </Button>
        <Button onClick={handleSubmit}>Save & Continue</Button>
      </div>
    </div>
  );
}
