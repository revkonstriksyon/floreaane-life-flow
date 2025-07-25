import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  PlusCircle,
  Calendar,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
// TODO: Migrate to new API hooks
import { SafeArea } from "@/components/mobile/SafeArea";
import { AIChat } from "@/components/ai/AIChat";

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  user_id: string;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
  user_id: string;
}

const transactionCategories = {
  salary: "Salè",
  freelance: "Travay lib",
  business: "Biznis",
  investment: "Envestisman",
  other_income: "Lòt revni",
  housing: "Lojman",
  food: "Manje",
  transport: "Transpò",
  entertainment: "Divetiseman",
  shopping: "Shopping",
  healthcare: "Sante",
  education: "Edikasyon",
  other: "Lòt"
};

export default function Finances() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: 0,
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const isMobile = useIsMobile();

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      const [transactionsResult, billsResult] = await Promise.all([
        supabase.from('transactions').select('*').order('transaction_date', { ascending: false }),
        supabase.from('bills').select('*').order('due_date', { ascending: true })
      ]);

      if (transactionsResult.error) throw transactionsResult.error;
      if (billsResult.error) throw billsResult.error;

      setTransactions(transactionsResult.data || []);
      setBills(billsResult.data || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const addTransaction = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...newTransaction,
          transaction_date: newTransaction.date
        }])
        .select();

      if (error) throw error;

      if (data) {
        setTransactions([...data, ...transactions]);
        setNewTransaction({
          amount: 0,
          type: 'expense',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        setIsTransactionDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleRefresh = async () => {
    await fetchFinancialData();
  };

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const upcomingBills = bills.filter(bill => {
    const today = new Date();
    const dueDate = new Date(bill.due_date);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0 && !bill.is_paid;
  });

  if (isLoading) {
    return (
      <ResponsiveLayout currentPath="/finances">
        <SafeArea>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chaje done finansye yo...</p>
            </div>
          </div>
        </SafeArea>
      </ResponsiveLayout>
    );
  }

  const content = (
    <SafeArea>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Finans Mwen
              </h1>
              <p className="text-muted-foreground mt-1">
                Jere ak kontwole lajan ou
              </p>
            </div>
            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
              <DialogTrigger asChild>
                <TouchOptimizedButton>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nouvo
                </TouchOptimizedButton>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajoute Nouvo Tranzaksyon</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Tip</Label>
                    <Select value={newTransaction.type} onValueChange={(value: "income" | "expense") => setNewTransaction({...newTransaction, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Antre</SelectItem>
                        <SelectItem value="expense">Sòti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Kantite</Label>
                    <Input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Deskripsyon</Label>
                    <Input
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      placeholder="Egzanp: Achte manje"
                    />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(transactionCategories).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addTransaction} className="w-full">
                    Ajoute Tranzaksyon
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Balans</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${balance.toLocaleString()}
                  </p>
                </div>
                <Wallet className={`h-8 w-8 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Antre</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sòti</p>
                  <p className="text-2xl font-bold text-red-500">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="transactions" className="h-full flex flex-col">
            <TabsList className="mx-4 md:mx-6 mb-4">
              <TabsTrigger value="transactions">Tranzaksyon</TabsTrigger>
              <TabsTrigger value="bills">Bòdwo</TabsTrigger>
              <TabsTrigger value="analysis">Analiz</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="flex-1 overflow-auto px-4 md:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dènye Tranzaksyon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'income' ? 
                              <TrendingUp className="h-4 w-4 text-green-600" /> : 
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transactionCategories[transaction.category as keyof typeof transactionCategories] || transaction.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bills" className="flex-1 overflow-auto px-4 md:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bòdwo ki Ap Vini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBills.map((bill) => {
                      const today = new Date();
                      const dueDate = new Date(bill.due_date);
                      const isOverdue = dueDate < today && !bill.is_paid;
                      const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div key={bill.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                          isOverdue ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                        }`}>
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${isOverdue ? 'bg-red-100' : 'bg-yellow-100'}`}>
                              {isOverdue ? 
                                <AlertTriangle className="h-5 w-5 text-red-600" /> : 
                                <Calendar className="h-5 w-5 text-yellow-600" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{bill.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {isOverdue ? `${Math.abs(daysUntil)} jou an reta` : `${daysUntil} jou ki rete`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${bill.amount.toLocaleString()}</p>
                            <Badge variant={isOverdue ? "destructive" : "outline"}>
                              {isOverdue ? "An reta" : "Ap vini"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                    {upcomingBills.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-muted-foreground">Pa gen bòdwo ki ap vini</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="flex-1 overflow-auto px-4 md:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analiz Finansye</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Depans pa Kategori</h4>
                      <div className="space-y-4">
                        {Object.entries(
                          transactions
                            .filter(t => t.type === 'expense')
                            .reduce((acc, t) => {
                              const category = t.category || 'other';
                              acc[category] = (acc[category] || 0) + t.amount;
                              return acc;
                            }, {} as Record<string, number>)
                        )
                        .sort(([,a], [,b]) => b - a)
                        .map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-primary rounded"></div>
                              <span>{transactionCategories[category as keyof typeof transactionCategories] || category}</span>
                            </div>
                            <span className="font-medium">${amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Rezime</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Antre</p>
                          <p className="text-xl font-bold text-green-500">${totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Sòti</p>
                          <p className="text-xl font-bold text-red-500">${totalExpenses.toLocaleString()}</p>
                        </div>
                        <div className="col-span-2 text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Balans Net</p>
                          <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${Math.abs(balance).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Chat */}
        <AIChat 
          context="Mwen gen done finansye ak tranzaksyon pou analiz ak konsèy."
          suggestions={[
            "Ki konsèy ou genyen pou ekonomize lajan?",
            "Ki kategori m depanse pi plis ladan?",
            "Ki jan pou jere bidjè mwen pi byen?",
            "Bay m estrateji pou ogmante revni m"
          ]}
        />
      </div>
    </SafeArea>
  );

  return (
    <ResponsiveLayout currentPath="/finances">
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {content}
        </PullToRefresh>
      ) : (
        content
      )}
    </ResponsiveLayout>
  );
}