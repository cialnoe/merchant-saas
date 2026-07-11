"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createOrder, type OrderFormState } from "@/actions/orders";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/types/database.types";

const initialState: OrderFormState = { error: null, success: false };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSuccess: () => void;
  locale: Locale;
  dict: Dictionary;
}

export function OrderDialog({
  open,
  onOpenChange,
  products,
  onSuccess,
  locale,
  dict,
}: OrderDialogProps) {
  
  // Resolusi TypeScript: Wrapper fungsi statis untuk mencegah 
  // ketidakcocokan tipe antara Server Action dan useFormState
  const action = async (prevState: OrderFormState, formData: FormData) => {
    return createOrder(prevState, formData);
  };

  const [state, formAction] = useFormState(action, initialState);
  
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const prevSuccess = useRef(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const t = dict.orders;

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  useEffect(() => {
    if (state.success && !prevSuccess.current) {
      prevSuccess.current = true;
      toast({ title: t.toastCreated, variant: "success" });
      formRef.current?.reset();
      setSelectedProductId("");
      onSuccess();
      onOpenChange(false);
    }
    if (!state.success) {
      prevSuccess.current = false;
    }
  }, [state.success, onSuccess, onOpenChange, toast, t]);

  const availableProducts = products.filter((p) => p.stock > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.dialogTitle}</DialogTitle>
          <DialogDescription>{t.dialogDesc}</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">{t.fieldCustomer}</Label>
            <Input
              id="customer_name"
              name="customer_name"
              required
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product_id">{t.fieldProduct}</Label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              required
            >
              <SelectTrigger id="product_id">
                <SelectValue placeholder={t.fieldProductPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground">
                    {t.noProductsInStock}
                  </div>
                ) : (
                  availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} &mdash; {formatCurrency(Number(product.price), locale)} ({product.stock})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {/* Hidden input keeps the Radix Select value submittable via FormData */}
            <input type="hidden" name="product_id" value={selectedProductId} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">{t.fieldQuantity}</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              max={selectedProduct?.stock ?? undefined}
              defaultValue={1}
              required
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {dict.common.cancel}
            </Button>
            <SubmitButton label={t.createButton} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}