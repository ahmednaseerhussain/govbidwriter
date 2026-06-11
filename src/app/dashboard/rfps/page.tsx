import type { Metadata } from "next";
import Link from "next/link";
import { FileSearch, Plus } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "RFPs" };

export default async function RfpsPage() {
  const user = await requireUser();
  const rfps = await db.rfpDocument.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      analysis: { select: { id: true, agency: true, deadline: true } },
      _count: { select: { requirements: true, proposals: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">RFPs</h1>
          <p className="text-sm text-muted-foreground">
            Upload a solicitation to analyze it and build your compliance matrix.
          </p>
        </div>
        <Link href="/dashboard/rfps/new">
          <Button>
            <Plus className="h-4 w-4" /> New RFP
          </Button>
        </Link>
      </div>

      {rfps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FileSearch className="h-10 w-10 text-muted-foreground/50" />
            <h2 className="mt-4 font-semibold">No RFPs yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Upload an RFP PDF or paste the solicitation text, and GovBidWriter
              will extract the requirements into a compliance matrix.
            </p>
            <Link href="/dashboard/rfps/new" className="mt-4">
              <Button>Upload your first RFP</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfps.map((rfp) => (
                <TableRow key={rfp.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/rfps/${rfp.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {rfp.title}
                    </Link>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {rfp.sourceType === "pdf" ? rfp.fileName : "Pasted text"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {rfp.analysis?.agency || <span className="text-muted-foreground">Not analyzed</span>}
                  </TableCell>
                  <TableCell className="text-sm">{rfp.analysis?.deadline || "—"}</TableCell>
                  <TableCell>
                    {rfp._count.requirements > 0 ? (
                      <Badge variant="secondary">{rfp._count.requirements}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(rfp.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
