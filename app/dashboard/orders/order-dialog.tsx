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
import type { Product } from "@/types/database.types";

const initialState: OrderFormState = { error: null, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Create order
    </Button>
  );
}

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSuccess: () => void;
}

export function OrderDialog({ open, onOpenChange, products, onSuccess }: OrderDialogProps) {
  const [state, formAction] = useFormState(createOrder, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const prevSuccess = useRef(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  useEffect(() => {
    if (state.success && !prevSuccess.current) {
      prevSuccess.current = true;
      toast({ title: "Order created", variant: "success" });
      formRef.current?.reset();
      setSelectedProductId("");
      onSuccess();
      onOpenChange(false);
    }
    if (!state.success) {
      prevSuccess.current = false;
    }
  }, [state.success, onSuccess, onOpenChange, toast]);

  const availableProducts = products.filter((p) => p.stock > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New order</DialogTitle>
          <DialogDescription>
            Create an order for one of your products. Stock will be reduced automatically.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer name</Label>
            <Input
              id="customer_name"
              name="customer_name"
              required
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product_id">Product</Label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              required
            >
              <SelectTrigger id="product_id">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground">
                    No products in stock
                  </div>
                ) : (
                  availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} — {formatCurrency(Number(product.price))} ({product.stock} in stock)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {/* Hidden input keeps the Radix Select value submittable via FormData */}
            <input type="hidden" name="product_id" value={selectedProductId} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
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
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
