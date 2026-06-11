import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Proposals" };

export default async function ProposalsPage() {
  const user = await requireUser();
  const proposals = await db.proposal.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      rfpDocument: { select: { title: true } },
      sections: { select: { content: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Proposals</h1>
        <p className="text-sm text-muted-foreground">
          Drafts generated from your analyzed RFPs.
        </p>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <h2 className="mt-4 font-semibold">No proposals yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Analyze an RFP first, then create a proposal draft from its page.
            </p>
            <Link href="/dashboard/rfps" className="mt-4">
              <Button>Go to RFPs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>RFP</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((p) => {
                const drafted = p.sections.filter((s) => s.content.trim()).length;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/proposals/${p.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {p.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.rfpDocument?.title || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {drafted}/{p.sections.length} sections
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(p.updatedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
