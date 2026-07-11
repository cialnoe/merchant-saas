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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { OrderDialog } from "./order-dialog";
import { updateOrderStatus, deleteOrder } from "@/actions/orders";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { interpolate, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { MoreHorizontal, Plus, Search, Trash2, Loader2 } from "lucide-react";
import type { Order, OrderStatus, Product } from "@/types/database.types";

// Canonical DB values stay in English; only the on-screen label is translated.
const STATUS_OPTIONS: OrderStatus[] = ["Pending", "Processing", "Completed"];

function statusVariant(status: OrderStatus) {
  if (status === "Completed") return "success" as const;
  if (status === "Processing") return "warning" as const;
  return "secondary" as const;
}

export function OrderTable({
  initialOrders,
  products,
  locale,
  dict,
}: {
  initialOrders: Order[];
  products: Product[];
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = dict.orders;

  const statusLabel: Record<OrderStatus, string> = {
    Pending: t.statusPending,
    Processing: t.statusProcessing,
    Completed: t.statusCompleted,
  };

  const filtered = useMemo(() => {
    return initialOrders.filter((order) => {
      const matchesSearch =
        !search.trim() ||
        order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        order.product_name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialOrders, search, statusFilter]);

  function handleSuccess() {
    router.refresh();
  }

  function handleStatusChange(order: Order, status: OrderStatus) {
    setUpdatingId(order.id);
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, status);
      if (result.error) {
        toast({ title: t.toastStatusFailed, description: result.error, variant: "destructive" });
      } else {
        toast({ title: interpolate(t.statusUpdated, { status: statusLabel[status] }), variant: "success" });
        router.refresh();
      }
      setUpdatingId(null);
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteOrder(deleteTarget.id);
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder={t.allStatuses} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabel[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.newOrder}
        </Button>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.colCustomer}</TableHead>
              <TableHead>{t.colProduct}</TableHead>
              <TableHead>{t.colQty}</TableHead>
              <TableHead>{t.colTotal}</TableHead>
              <TableHead>{t.colDate}</TableHead>
              <TableHead>{t.colStatus}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  {initialOrders.length === 0 ? t.emptyNoOrders : t.emptyNoMatch}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.customer_name}</TableCell>
                  <TableCell className="text-muted-foreground">{order.product_name}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{formatCurrency(Number(order.total_amount), locale)}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {formatDate(order.created_at, locale)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order, value as OrderStatus)}
                      disabled={updatingId === order.id}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue>
                          <Badge variant={statusVariant(order.status)}>
                            {updatingId === order.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              statusLabel[order.status]
                            )}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {statusLabel[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(order)}
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

      <OrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        products={products}
        onSuccess={handleSuccess}
        locale={locale}
        dict={dict}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.deleteTitle}</DialogTitle>
            <DialogDescription>
              {interpolate(t.deleteDesc, { name: deleteTarget?.customer_name ?? "" })}
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
