'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Building2, Check } from 'lucide-react'

export type PaymentMethodType = 'card' | 'bank'

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethodType) => void
  defaultMethod?: PaymentMethodType
}

export function PaymentMethodSelector({
  onSelect,
  defaultMethod = 'card',
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(defaultMethod)

  const handleChange = (value: PaymentMethodType) => {
    setSelectedMethod(value)
    onSelect(value)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Payment Method</h3>

      <RadioGroup value={selectedMethod} onValueChange={handleChange as (value: string) => void}>
        <div className="space-y-3">
          {/* Card Payment Option */}
          <label className="group cursor-pointer">
            <Card className="relative border-2 border-border p-4 transition-all hover:border-primary hover:bg-secondary">
              <div className="flex items-center gap-4">
                <RadioGroupItem value="card" id="card-method" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <label htmlFor="card-method" className="font-medium cursor-pointer text-foreground">
                      Credit or Debit Card
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Visa, Mastercard, American Express
                  </p>
                </div>
                {selectedMethod === 'card' && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            </Card>
          </label>

          {/* Bank Transfer Option */}
          <label className="group cursor-pointer">
            <Card className="relative border-2 border-border p-4 transition-all hover:border-primary hover:bg-secondary">
              <div className="flex items-center gap-4">
                <RadioGroupItem value="bank" id="bank-method" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <label htmlFor="bank-method" className="font-medium cursor-pointer text-foreground">
                      Bank Transfer
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Direct bank account transfer (ACH)
                  </p>
                </div>
                {selectedMethod === 'bank' && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            </Card>
          </label>
        </div>
      </RadioGroup>

      {/* Payment Method Details */}
      <Card className="border-0 bg-slate-50 p-4">
        {selectedMethod === 'card' && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Ending in 4242</p>
            <p className="text-xs text-muted-foreground">This is your saved card</p>
          </div>
        )}
        {selectedMethod === 'bank' && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Checking account ending in 6789</p>
            <p className="text-xs text-muted-foreground">Processing time: 1-2 business days</p>
          </div>
        )}
      </Card>
    </div>
  )
}
