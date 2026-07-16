import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center animate-fade-in">
      <div className="mb-6 rounded-2xl bg-destructive/10 p-6 text-destructive ring-1 ring-destructive/20">
        <ShieldAlert className="h-12 w-12" />
      </div>
      
      <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground">Access Denied</h1>
      <p className="mb-8 max-w-md text-sm font-medium text-muted-foreground leading-relaxed">
        You don't have the required permissions to view this module.
        Please contact your administrator if you believe this is an error.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="secondary" 
          onClick={() => navigate(-1)}
          className="min-w-[140px]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Button 
          onClick={() => navigate('/')}
          className="min-w-[140px]"
        >
          <Home className="mr-2 h-4 w-4" /> Home Dashboard
        </Button>
      </div>
      
      <div className="mt-12 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
        <div className="h-px w-8 bg-border/60" />
        <span>Security Protocol active</span>
        <div className="h-px w-8 bg-border/60" />
      </div>
    </div>
  );
}




