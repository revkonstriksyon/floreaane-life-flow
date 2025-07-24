
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
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
  CreditCard,
  PiggyBank,
  Target,
  Bell,
  Download,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Filter,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string | null;
  type: 'income' | 'expense';
  date: string;
  recurring: boolean;
  user_id: string;
  created_at: string;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  category: string | null;
  is_recurring: boolean;
  is_paid: boolean;
  user_id: string;
  created_at: string;
}

const transactionCategories = {
  salary: "Salè",
  freelance: "Travay lib",
  investment: "Envestisman",
  business: "Biznis",
  gift: "Kado",
  housing: "Lojman",
  food: "Manje",
  transport: "Transpò",
  entertainment: "Divertiseman",
  shopping: "Shopping",
  healthcare: "Sante",
  education: "Edikasyon",
  other: "Lòt"
};

export default function Finances() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: 0,
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });
  const [newBill, setNewBill] = useState({
    name: "",
    amount: 0,
    due_date: "",
    category: "",
    is_recurring: false
  });

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const [transactionsResult, billsResult] = await Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
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

  const addTransaction = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select();

      if (error) throw error;

      setTransactions([...transactions, ...(data || [])]);
      setNewTransaction({
        amount: 0,
        description: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().split('T')[0],
        recurring: false
      });
      setIsTransactionDialogOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const addBill = async () => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([newBill])
        .select();

      if (error) throw error;

      setBills([...bills, ...(data || [])]);
      setNewBill({
        name: "",
        amount: 0,
        due_date: "",
        category: "",
        is_recurring: false
      });
      setIsBillDialogOpen(false);
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  const toggleBillPayment = async (billId: string, isPaid: boolean) => {
    try {
      const { error } = await supabase
        .from('bills')
        .update({ is_paid: !isPaid })
        .eq('id', billId);

      if (error) throw error;

      setBills(bills.map(bill => 
        bill.id === billId ? { ...bill, is_paid: !isPaid } : bill
      ));
    } catch (error) {
      console.error('Error updating bill payment:', error);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const upcomingBills = bills.filter(bill => {
    const today = new Date();
    const dueDate = new Date(bill.due_date);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0 && !bill.is_paid;
  });

  const overdueBills = bills.filter(bill => {
    const today = new Date();
    const dueDate = new Date(bill.due_date);
    return dueDate < today && !bill.is_paid;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje done finansye yo...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/finances"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Finans Mwen
              </h1>
              <p className="text-muted-foreground mt-1">
                Jere, planifye ak analize lajan ou
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Rapèl
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Rapò
              </Button>
              <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvo Transakyon
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajoute nouvo transakyon</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="type">Kalite transakyon</Label>
                      <Select value={newTransaction.type} onValueChange={(value: "income" | "expense") => setNewTransaction({...newTransaction, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Kòb ki antre</SelectItem>
                          <SelectItem value="expense">Depans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Kantite ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                        placeholder="100.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Deskripsyon</Label>
                      <Input
                        id="description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        placeholder="Achte manje, salè, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chwazi kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(transactionCategories).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Dat</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                      />
                    </div>
                    <Button onClick={addTransaction} className="w-full">
                      Ajoute transakyon an
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Balans Total</p>
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
                  <p className="text-sm text-muted-foreground">Kòb ki Antre</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>
                <ArrowUpCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Depans</p>
                  <p className="text-2xl font-bold text-red-500">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
                <ArrowDownCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Faktè ki Rete</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {upcomingBills.length + overdueBills.length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Apèsi</TabsTrigger>
              <TabsTrigger value="transactions">Transakyon</TabsTrigger>
              <TabsTrigger value="bills">Faktè</TabsTrigger>
              <TabsTrigger value="analytics">Analiz</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Transakyon Resan</span>
                      <Button variant="outline" size="sm">
                        Wè Tout
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {transaction.type === 'income' ? 
                                <ArrowUpCircle className="h-4 w-4 text-green-600" /> :
                                <ArrowDownCircle className="h-4 w-4 text-red-600" />
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

                {/* Upcoming Bills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Faktè ki Gen pou Peye</span>
                      <Dialog open={isBillDialogOpen} onOpenChange={setIsBillDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Ajoute
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Ajoute nouvo faktè</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Non faktè a</Label>
                              <Input
                                id="name"
                                value={newBill.name}
                                onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                                placeholder="Kouran, dlo, telefòn..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="amount">Kantite ($)</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={newBill.amount}
                                onChange={(e) => setNewBill({...newBill, amount: parseFloat(e.target.value) || 0})}
                                placeholder="50.00"
                              />
                            </div>
                            <div>
                              <Label htmlFor="due_date">Dat limit</Label>
                              <Input
                                id="due_date"
                                type="date"
                                value={newBill.due_date}
                                onChange={(e) => setNewBill({...newBill, due_date: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">Kategori</Label>
                              <Select value={newBill.category} onValueChange={(value) => setNewBill({...newBill, category: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chwazi kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="housing">Lojman</SelectItem>
                                  <SelectItem value="utilities">Sèvis</SelectItem>
                                  <SelectItem value="insurance">Asirans</SelectItem>
                                  <SelectItem value="subscription">Abonman</SelectItem>
                                  <SelectItem value="other">Lòt</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={addBill} className="w-full">
                              Ajoute faktè a
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Overdue Bills */}
                      {overdueBills.map((bill) => (
                        <div key={bill.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="font-medium text-red-900">{bill.name}</p>
                              <p className="text-sm text-red-600">
                                An reta: {new Date(bill.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-500">${bill.amount.toLocaleString()}</p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleBillPayment(bill.id, bill.is_paid)}
                              className="mt-1 text-xs"
                            >
                              Make Peye
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Upcoming Bills */}
                      {upcomingBills.map((bill) => (
                        <div key={bill.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="font-medium">{bill.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(bill.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${bill.amount.toLocaleString()}</p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleBillPayment(bill.id, bill.is_paid)}
                              className="mt-1 text-xs"
                            >
                              Make Peye
                            </Button>
                          </div>
                        </div>
                      ))}

                      {upcomingBills.length === 0 && overdueBills.length === 0 && (
                        <div className="text-center py-6">
                          <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Pa gen faktè ki gen pou peye kounye a</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Tout Transakyon yo</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtre
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Ekspòte
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'income' ? 
                              <ArrowUpCircle className="h-5 w-5 text-green-600" /> :
                              <ArrowDownCircle className="h-5 w-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-lg">{transaction.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{new Date(transaction.date).toLocaleDateString()}</span>
                              <Badge variant="outline">
                                {transactionCategories[transaction.category as keyof typeof transactionCategories] || transaction.category}
                              </Badge>
                              {transaction.recurring && (
                                <Badge variant="secondary">Rekuran</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bills">
              <Card>
                <CardHeader>
                  <CardTitle>Jesyon Faktè</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bills.map((bill) => {
                      const today = new Date();
                      const dueDate = new Date(bill.due_date);
                      const isOverdue = dueDate < today && !bill.is_paid;
                      const isUpcoming = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) <= 7;
                      
                      return (
                        <div key={bill.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                          bill.is_paid ? 'bg-green-50 border-green-200' :
                          isOverdue ? 'bg-red-50 border-red-200' :
                          isUpcoming ? 'bg-yellow-50 border-yellow-200' :
                          'bg-muted/50'
                        }`}>
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${
                              bill.is_paid ? 'bg-green-100' :
                              isOverdue ? 'bg-red-100' :
                              isUpcoming ? 'bg-yellow-100' :
                              'bg-gray-100'
                            }`}>
                              <CreditCard className={`h-5 w-5 ${
                                bill.is_paid ? 'text-green-600' :
                                isOverdue ? 'text-red-600' :
                                isUpcoming ? 'text-yellow-600' :
                                'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-lg">{bill.name}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Dat limit: {new Date(bill.due_date).toLocaleDateString()}</span>
                                {bill.category && (
                                  <Badge variant="outline">{bill.category}</Badge>
                                )}
                                {bill.is_recurring && (
                                  <Badge variant="secondary">Rekuran</Badge>
                                )}
                                {bill.is_paid && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Peye
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">${bill.amount.toLocaleString()}</p>
                            <Button 
                              size="sm" 
                              variant={bill.is_paid ? "secondary" : "default"}
                              onClick={() => toggleBillPayment(bill.id, bill.is_paid)}
                              className="mt-2"
                            >
                              {bill.is_paid ? 'Make pa peye' : 'Make peye'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Analiz Depans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                          <div className="text-right">
                            <p className="font-semibold">${amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {((amount / totalExpenses) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Rezime Mwa a
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          {totalIncome > totalExpenses ? (
                            <span className="text-green-500">+${(totalIncome - totalExpenses).toLocaleString()}</span>
                          ) : (
                            <span className="text-red-500">-${(totalExpenses - totalIncome).toLocaleString()}</span>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {totalIncome > totalExpenses ? 'Pwodiktif' : 'Pèt'} mwa sa a
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Kòb ki antre:</span>
                          <span className="font-semibold text-green-500">${totalIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Depans:</span>
                          <span className="font-semibold text-red-500">${totalExpenses.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="font-medium">Net:</span>
                          <span className={`font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${Math.abs(balance).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
