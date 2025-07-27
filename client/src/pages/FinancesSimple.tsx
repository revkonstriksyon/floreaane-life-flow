import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Banknote,
  PieChart,
  BarChart3
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <SafeArea>
        <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finans Mwen</h1>
              <p className="text-gray-600 mt-1">
                Jere ak kontwole lajan ou
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nouvo Tranzaksyon
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajoute Nouvo Tranzaksyon</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tip</Label>
                      <Select value={newTransaction.type} onValueChange={(value: "income" | "expense") => setNewTransaction({...newTransaction, type: value})}>
                        <SelectTrigger className="border-gray-200">
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
                        className="border-gray-200 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label>Deskripsyon</Label>
                      <Input
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        placeholder="Egzanp: Achte manje"
                        className="border-gray-200 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(transactionCategories).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addTransaction} className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                      Ajoute Tranzaksyon
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6">
          {/* Balance Card */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-blue-100 text-sm mb-2">Balans Disponib</p>
                <h2 className="text-4xl font-bold mb-4">${balance.toLocaleString()}</h2>
                <div className="grid grid-cols-4 gap-4">
                  <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Voye
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <ArrowDownLeft className="h-4 w-4 mr-1" />
                    Resevwa
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Peye
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Ajoute
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Transfer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">Transfè Rapid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Button size="sm" className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  {['Marie', 'Jean', 'Paul', 'Lisa', 'Max'].map((name, i) => (
                    <Avatar key={i} className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                      <AvatarFallback className="text-sm">{name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Estatistik
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-gray-900 text-white border-0">
                      Semèn
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200">
                      Mwa
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Antre</span>
                    </div>
                    <span className="font-semibold">${totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Sòti</span>
                    </div>
                    <span className="font-semibold">${totalExpenses.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Old Stats - keeping for compatibility */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Balans</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${balance.toLocaleString()}
                  </p>
                </div>
                <Wallet className={`h-8 w-8 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Antre</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sòti</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-6">
          <Tabs defaultValue="transactions" className="h-full flex flex-col">
            <TabsList className="mb-6 bg-white/60 backdrop-blur-sm">
              <TabsTrigger value="transactions">Tranzaksyon</TabsTrigger>
              <TabsTrigger value="bills">Bòdwo</TabsTrigger>
              <TabsTrigger value="analysis">Analiz</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="flex-1 overflow-auto">
              <Card className="bg-white/60 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Tranzaksyon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'income' ? 
                              <ArrowDownLeft className="h-5 w-5 text-green-600" /> : 
                              <ArrowUpRight className="h-5 w-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              {transactionCategories[transaction.category as keyof typeof transactionCategories] || transaction.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bills" className="flex-1 overflow-auto">
              <Card className="bg-white/60 backdrop-blur-sm border-0">
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
                        <div key={bill.id} className={`flex items-center justify-between p-4 rounded-xl border ${
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
                            <Badge variant={isOverdue ? "destructive" : "outline"} className="mt-1">
                              {isOverdue ? "An reta" : "Ap vini"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                    {upcomingBills.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <p className="text-muted-foreground">Pa gen bòdwo ki ap vini</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="flex-1 overflow-auto">
              <Card className="bg-white/60 backdrop-blur-sm border-0">
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
                          <p className="text-xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Sòti</p>
                          <p className="text-xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                        </div>
                        <div className="col-span-2 text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Balans Net</p>
                          <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

        </div>
      </SafeArea>
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