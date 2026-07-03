"use client";

import { useEffect, useRef } from "react";
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
import { Loader2 } from "lucide-react";
import { createProduct, updateProduct, type ProductFormState } from "@/actions/products";
import { useToast } from "@/components/ui/toast";
import type { Product } from "@/types/database.types";

const initialState: ProductFormState = { error: null, success: false };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: () => void;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductDialogProps) {
  const isEditing = Boolean(product);
  const boundAction = isEditing
    ? updateProduct.bind(null, product!.id)
    : createProduct;
  const [state, formAction] = useFormState(boundAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const prevSuccess = useRef(false);

  useEffect(() => {
    if (state.success && !prevSuccess.current) {
      prevSuccess.current = true;
      toast({
        title: isEditing ? "Product updated" : "Product created",
        variant: "success",
      });
      formRef.current?.reset();
      onSuccess();
      onOpenChange(false);
    }
    if (!state.success) {
      prevSuccess.current = false;
    }
  }, [state.success, isEditing, onSuccess, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details for this product."
              : "Add a new product to your catalog."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={product?.name}
              placeholder="Wireless Mouse"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              required
              defaultValue={product?.sku}
              placeholder="WM-001"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={product?.price}
                placeholder="19.99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={product?.stock}
                placeholder="100"
              />
            </div>
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
            <SubmitButton label={isEditing ? "Save changes" : "Create product"} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
