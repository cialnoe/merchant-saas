"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProductDialog } from "./product-dialog";
import { deleteProduct } from "@/actions/products";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { interpolate, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { MoreHorizontal, Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Product } from "@/types/database.types";

export function ProductTable({
  initialProducts,
  locale,
  dict,
}: {
  initialProducts: Product[];
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = dict.products;

  const filtered = useMemo(() => {
    if (!search.trim()) return initialProducts;
    const q = search.toLowerCase();
    return initialProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [initialProducts, search]);

  function handleCreate() {
    setEditingProduct(null);
    setDialogOpen(true);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setDialogOpen(true);
  }

  function handleSuccess() {
    router.refresh();
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteProduct(deleteTarget.id);
      if (result.error) {
        toast({ title: t.toastDeleteFailed, description: result.error, variant: "destructive" });
      } else {
        toast({ title: t.toastDeleted, variant: "success" });
        router.refresh();
      }
      setDeleteTarget(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.addProduct}
        </Button>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.colName}</TableHead>
              <TableHead>{t.colSku}</TableHead>
              <TableHead>{t.colPrice}</TableHead>
              <TableHead>{t.colStock}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  {initialProducts.length === 0 ? t.emptyNoProducts : t.emptyNoMatch}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>{formatCurrency(Number(product.price), locale)}</TableCell>
                  <TableCell>
                    {product.stock === 0 ? (
                      <Badge variant="destructive">{t.outOfStock}</Badge>
                    ) : product.stock < 10 ? (
                      <Badge variant="warning">
                        {product.stock} {t.leftSuffix}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {product.stock} {t.inStock}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)} className="gap-2">
                          <Pencil className="h-4 w-4" /> {dict.common.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(product)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> {dict.common.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSuccess={handleSuccess}
        dict={dict}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.deleteTitle}</DialogTitle>
            <DialogDescription>
              {interpolate(t.deleteDesc, { name: deleteTarget?.name ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isPending}>
              {dict.common.cancel}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {dict.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
