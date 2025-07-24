import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  CreditCard,
  Wallet,
  Target,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Eye,
  Edit,
  Download,
  Bell
} from "lucide-react";

const mockTransactions = [
  {
    id: 1,
    type: "income",
    amount: 2500,
    category: "salary",
    description: "Salè travay",
    date: "2024-01-15",
    method: "bank_transfer"
  },
  {
    id: 2,
    type: "expense", 
    amount: 800,
    category: "housing",
    description: "Lokasyon kay",
    date: "2024-01-14",
    method: "cash"
  },
  {
    id: 3,
    type: "expense",
    amount: 150,
    category: "food",
    description: "Pwovizyon semèn nan",
    date: "2024-01-13",
    method: "card"
  },
  {
    id: 4,
    type: "income",
    amount: 500,
    category: "project",
    description: "Pwojè web development",
    date: "2024-01-12",
    method: "bank_transfer"
  }
];

const mockBudgets = [
  {
    id: 1,
    category: "food",
    name: "Manje ak Pwovizyon",
    monthlyLimit: 400,
    currentAmount: 275,
    targetDate: "2024-01-31"
  },
  {
    id: 2,
    category: "transport",
    name: "Transpò",
    monthlyLimit: 200,
    currentAmount: 120,
    targetDate: "2024-01-31"
  },
  {
    id: 3,
    category: "entertainment",
    name: "Divertiseman",
    monthlyLimit: 150,
    currentAmount: 85,
    targetDate: "2024-01-31"
  }
];

const incomeCategories = {
  salary: "Salè",
  project: "Pwojè",
  business: "Biznis",
  investment: "Envestisman",
  gift: "Kado",
  other: "Lòt"
};

const expenseCategories = {
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

  const totalIncome = mockTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = mockTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const totalBudgetLimit = mockBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalBudgetUsed = mockBudgets.reduce((sum, b) => sum + b.currentAmount, 0);

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
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Transakyon
              </Button>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Antre Lajan</p>
                  <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <ArrowUpRight className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Depans</p>
                  <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <ArrowDownRight className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Balans</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${balance.toLocaleString()}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Wallet className={`h-6 w-6 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bidjè Itilize</p>
                  <p className="text-2xl font-bold">{Math.round((totalBudgetUsed / totalBudgetLimit) * 100)}%</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="overview">Apèsi</TabsTrigger>
                <TabsTrigger value="transactions">Transakyon</TabsTrigger>
                <TabsTrigger value="budgets">Bidjè</TabsTrigger>
                <TabsTrigger value="goals">Objektif</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Transakyon Resan</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Wè Tout
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {transaction.type === 'income' ? 
                                <ArrowUpRight className={`h-4 w-4 text-green-600`} /> :
                                <ArrowDownRight className={`h-4 w-4 text-red-600`} />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.type === 'income' ? 
                                  incomeCategories[transaction.category as keyof typeof incomeCategories] :
                                  expenseCategories[transaction.category as keyof typeof expenseCategories]
                                }
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Eta Bidjè Mwa Sa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockBudgets.map((budget) => {
                        const percentage = (budget.currentAmount / budget.monthlyLimit) * 100;
                        const isOverBudget = percentage > 100;
                        
                        return (
                          <div key={budget.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{budget.name}</span>
                              <div className="flex items-center gap-2">
                                {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-muted-foreground'}`}>
                                  ${budget.currentAmount} / ${budget.monthlyLimit}
                                </span>
                              </div>
                            </div>
                            <Progress 
                              value={Math.min(percentage, 100)} 
                              className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{Math.round(percentage)}% itilize</span>
                              <span>${budget.monthlyLimit - budget.currentAmount} ki rete</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Tout Transakyon</CardTitle>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Rechèch..." className="w-64" />
                      <Button variant="outline" size="sm">
                        Filtre
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'income' ? 
                              <TrendingUp className="h-5 w-5 text-green-600" /> :
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-semibold">{transaction.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {transaction.type === 'income' ? 
                                  incomeCategories[transaction.category as keyof typeof incomeCategories] :
                                  expenseCategories[transaction.category as keyof typeof expenseCategories]
                                }
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {transaction.method === 'cash' ? 'Kach' : 
                                 transaction.method === 'card' ? 'Kat' : 'Bank'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(transaction.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budgets">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBudgets.map((budget) => {
                  const percentage = (budget.currentAmount / budget.monthlyLimit) * 100;
                  const isOverBudget = percentage > 100;
                  const remaining = budget.monthlyLimit - budget.currentAmount;
                  
                  return (
                    <Card key={budget.id} className={`${isOverBudget ? 'border-red-200 bg-red-50/50' : ''}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{budget.name}</CardTitle>
                          {isOverBudget && <AlertTriangle className="h-5 w-5 text-red-500" />}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold">${budget.currentAmount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">nan ${budget.monthlyLimit.toLocaleString()}</p>
                          </div>
                          
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className={`h-3 ${isOverBudget ? 'bg-red-100' : ''}`}
                          />
                          
                          <div className="flex justify-between text-sm">
                            <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                              {Math.round(percentage)}% itilize
                            </span>
                            <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {remaining >= 0 ? `$${remaining} ki rete` : `$${Math.abs(remaining)} depase`}
                            </span>
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              Detay
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {/* Add New Budget Card */}
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Nouvo Bidjè</h3>
                    <p className="text-sm text-muted-foreground">
                      Kreye yon nouvo bidjè pou kontwòle depans ou yo
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="goals">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="h-5 w-5 text-blue-500" />
                      Fon Ijans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">$2,500</p>
                        <p className="text-sm text-muted-foreground">nan $5,000</p>
                      </div>
                      <Progress value={50} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>50% konplete</span>
                        <span>$2,500 ki rete</span>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        Objektif: Mès 2024
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Laptop className="h-5 w-5 text-green-500" />
                      Laptop Nouvo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">$1,200</p>
                        <p className="text-sm text-muted-foreground">nan $2,000</p>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>60% konplete</span>
                        <span>$800 ki rete</span>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        Objektif: Avril 2024
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center h-full text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Nouvo Objektif</h3>
                    <p className="text-sm text-muted-foreground">
                      Mete yon nouvo objektif finansye
                    </p>
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