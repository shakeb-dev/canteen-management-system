import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { Button } from '../../components/ui/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { employees } = useEmployeeStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = employees.find(emp => emp.username === username && emp.password === password);

    if (user) {
      // Mock token generation
      const token = `mock-jwt-token-${Date.now()}`;
      login(user, token);

      // Route based on role
      switch (user.role) {
        case 'super_admin':
        case 'canteen_supervisor':
          navigate('/admin/dashboard');
          break;
        case 'counter_manager':
          navigate('/manager/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
      }
    } else {
      setError('Invalid username or password');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword('1234');
    setShowPassword(false);
  };

  return (
    <div className="w-full animate-fade-in-up">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl text-center animate-shake">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground ml-1">Username</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-muted/20 border border-border/60 rounded-xl text-sm font-medium text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:font-normal placeholder:opacity-60"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-10 pr-12 bg-muted/20 border border-border/60 rounded-xl text-sm font-medium text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:font-normal placeholder:opacity-60"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="h-11 mt-6 text-sm font-medium group"
        >
          Sign In
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="pt-6 mt-6 border-t border-border/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center mb-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" /> Quick Access Demo
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleDemoLogin('superadmin')}
            className="p-3 text-left bg-muted/20 hover:bg-muted/40 border border-border/60 rounded-xl transition-all flex flex-col gap-0.5 border-l-4 border-l-primary shadow-sm"
          >
            <span className="text-xs font-semibold text-foreground">Admin</span>
            <span className="text-[10px] text-muted-foreground font-medium">superadmin / 1234</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('supervisor')}
            className="p-3 text-left bg-muted/20 hover:bg-muted/40 border border-border/60 rounded-xl transition-all flex flex-col gap-0.5 border-l-4 border-l-emerald-500 shadow-sm"
          >
            <span className="text-xs font-semibold text-foreground">Supervisor</span>
            <span className="text-[10px] text-muted-foreground font-medium">supervisor / 1234</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('counter')}
            className="p-3 text-left bg-muted/20 hover:bg-muted/40 border border-border/60 rounded-xl transition-all flex flex-col gap-0.5 border-l-4 border-l-blue-500 shadow-sm"
          >
            <span className="text-xs font-semibold text-foreground">Counter</span>
            <span className="text-[10px] text-muted-foreground font-medium">counter / 1234</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('employee')}
            className="p-3 text-left bg-muted/20 hover:bg-muted/40 border border-border/60 rounded-xl transition-all flex flex-col gap-0.5 border-l-4 border-l-orange-500 shadow-sm"
          >
            <span className="text-xs font-semibold text-foreground">Employee</span>
            <span className="text-[10px] text-muted-foreground font-medium">employee / 1234</span>
          </button>
        </div>
      </div>
    </div>
  );
}
