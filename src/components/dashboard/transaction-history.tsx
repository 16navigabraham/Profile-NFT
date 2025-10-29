import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { transactions } from "@/lib/mock-data";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Star } from "lucide-react";

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="border-primary/50 bg-primary/10 text-primary"
        >
          Completed
        </Badge>
      );
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  const baseClass = "h-4 w-4 flex-shrink-0";
  switch (type) {
    case "Sent":
      return <ArrowUpRight className={`${baseClass} text-destructive`} />;
    case "Received":
      return <ArrowDownLeft className={`${baseClass} text-primary`} />;
    case "Swap":
      return <RefreshCw className={`${baseClass} text-accent-foreground`} />;
    case "Minted":
    case "Staked":
      return <Star className={`${baseClass} text-foreground`} />;
    default:
      return <div className={baseClass} />;
  }
};

const TransactionHistory = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                Value
              </TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-border">
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    {getTypeIcon(tx.type)}
                    <span>{tx.type}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{tx.asset}</TableCell>
                <TableCell className="text-right">{tx.amount}</TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {tx.value}
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
                  {tx.date}
                </TableCell>
                <TableCell className="text-right">
                  {getStatusBadge(tx.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
