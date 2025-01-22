'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Leaf, Sprout } from 'lucide-react'

interface ModeToggleProps {
  onModeChange: (isAdvanced: boolean) => void
}

export function ModeToggle({ onModeChange }: ModeToggleProps) {
  const [isAdvanced, setIsAdvanced] = useState(false)

  const handleToggle = (checked: boolean) => {
    setIsAdvanced(checked)
    onModeChange(checked)
  }

  return (
    <div className="flex items-center gap-3 bg-green-600/10 px-4 py-2 rounded-full border border-green-600/20">
      <Leaf className={`h-5 w-5 transition-colors duration-200 ${isAdvanced ? 'text-green-300' : 'text-green-600'}`} />
      <Switch
        id="mode-toggle"
        checked={isAdvanced}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-green-600"
      />
      <Sprout className={`h-5 w-5 transition-colors duration-200 ${isAdvanced ? 'text-green-600' : 'text-green-300'}`} />
      <Label htmlFor="mode-toggle" className={`text-sm font-medium transition-colors duration-200 ${isAdvanced ? 'text-green-600' : 'text-green-700'}`}>
        {isAdvanced ? 'Advanced' : 'Simple'}
      </Label>
    </div>
  )
}

