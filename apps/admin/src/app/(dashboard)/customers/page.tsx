import type { Metadata } from "next";
import Link from "next/link";
import type { CustomerWithStats } from "@shop/db";
import { SearchX } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { EmptyState } from "@/components/empty-state";
import { SearchInput, SelectFilter } from "@/components/filters";
import { param } from "@/components/notice";
import { PageIntro } from "@/components/page-intro";
import { buttonClass } from "@/components/ui/button";
import { Card, TableScroll, td, th } from "@/components/ui/card";
import { getData } from "@/lib/data";
import { formatDate, formatInt, formatPrice, formatRelative, pluralize } from "@/lib/format";

export const metadata: Metadata = { title: "Customers" };

const SORT_OPTIONS = [
  { value: "", label: "Top spenders" },
  { value: "orders", label: "Most orders" },
  { value: "recent", label: "Recent activity" },
  { value: "newest", label: "Newest customers" },
  { value: "name", label: "Name A–Z" },
];

function sortCustomers(list: CustomerWithStats[], sort: string) {
  const sorted = [...list];
  const time = (iso: string | null) => (iso ? Date.parse(iso) : 0);
  switch (sort) {
    case "orders":
      return sorted.sort((a, b) => b.orderCount - a.orderCount || b.totalSpent - a.totalSpent);
    case "recent":
      return sorted.sort((a, b) => time(b.lastOrderAt) - time(a.lastOrderAt));
    case "newest":
      return sorted.sort((a, b) => time(b.createdAt) - time(a.createdAt));
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted.sort((a, b) => b.totalSpent - a.totalSpent);
  }
}

export default async function CustomersPage({ searchParams }: PageProps<"/customers">) {
  const sp = await searchParams;
  const q = param(sp.q).toLowerCase();
  const sort = param(sp.sort);

  const data = await getData();
  const all = await data.listCustomers();
  const filtered = q
    ? all.filter((c) => [c.name, c.email, c.city ?? "", c.phone ?? ""].some((s) => s.toLowerCase().includes(q)))
    : all;
  const customers = sortCustomers(filtered, sort);
  const lifetime = all.reduce((s, c) => s + c.totalSpent, 0);
  const repeat = all.filter((c) => c.orderCount > 1).length;

  return (
    <div className="animate-fade-in">
      <PageIntro>
        {pluralize(all.length, "customer")} · {formatInt(repeat)} repeat buyers · {formatPrice(lifetime)} lifetime
        sales.
      </PageIntro>

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search by name, email or city" label="Search customers" className="sm:flex-1" />
          <SelectFilter param="sort" label="Sort customers" options={SORT_OPTIONS} className="sm:w-48" />
        </div>

        {customers.length ? (
          <>
            <TableScroll>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-page/60">
                    <th scope="col" className={th}>
                      Customer
                    </th>
                    <th scope="col" className={th}>
                      City
                    </th>
                    <th scope="col" className={`${th} text-right`}>
                      Orders
                    </th>
                    <th scope="col" className={`${th} text-right`}>
                      Total spent
                    </th>
                    <th scope="col" className={th}>
                      Last order
                    </th>
                    <th scope="col" className={th}>
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {customers.map((c) => (
                    <tr key={c.id} className="transition-colors hover:bg-page/60">
                      <td className={td}>
                        <div className="flex items-center gap-3">
                          <Avatar name={c.name} size={36} />
                          <div className="min-w-0">
                            <p className="font-semibold text-ink">{c.name}</p>
                            <a href={`mailto:${c.email}`} className="text-xs text-muted hover:text-tan-600">
                              {c.email}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className={`${td} text-muted`}>{c.city ?? "—"}</td>
                      <td className={`${td} text-right tabular-nums`}>
                        {c.orderCount ? (
                          <Link
                            href={`/orders?q=${encodeURIComponent(c.email)}`}
                            className="font-medium text-navy hover:text-tan-600"
                            title={`View ${c.name}'s orders`}
                          >
                            {formatInt(c.orderCount)}
                          </Link>
                        ) : (
                          <span className="text-subtle">0</span>
                        )}
                      </td>
                      <td className={`${td} text-right font-semibold tabular-nums`}>{formatPrice(c.totalSpent)}</td>
                      <td className={`${td} text-muted`}>
                        {c.lastOrderAt ? (
                          <time dateTime={c.lastOrderAt} title={formatDate(c.lastOrderAt)}>
                            {formatRelative(c.lastOrderAt)}
                          </time>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className={`${td} text-muted`}>
                        <time dateTime={c.createdAt}>{formatDate(c.createdAt)}</time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
            <p className="border-t border-line px-5 py-3 text-xs text-muted">
              Showing {formatInt(customers.length)} of {pluralize(all.length, "customer")}. Order counts and totals
              exclude cancelled orders.
            </p>
          </>
        ) : (
          <EmptyState
            icon={<SearchX />}
            title={q ? "No customers found" : "No customers yet"}
            action={
              q ? (
                <Link href="/customers" className={buttonClass({ variant: "secondary" })}>
                  Clear search
                </Link>
              ) : null
            }
          >
            {q ? "Try a different name, email or city." : "Customers are created when they place an order."}
          </EmptyState>
        )}
      </Card>
    </div>
  );
}
