// frontend/src/app/components/LoginPage.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export function LoginPage() {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 🔄 attendre la réponse du backend
    const success = await login(matricule, password);
    if (!success) {
      setError('Échec de l\'authentification. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl border border-border p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-full p-4">
              {/*<Shield className="w-12 h-12 text-primary-foreground" />*/}
              <img 
                src="/Logo2.jpg" 
                alt="Logo CIRGN" 
                className="w-18 h-21 object-cover rounded-full"
              />
            </div>
          </div>
          
          <h1 className="text-center text-foreground mb-2">
            Système de Gestion SPA
          </h1>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Authentification
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="matricule" className="block text-sm text-foreground mb-1.5">
                Matricule
              </label>
              <input
                id="matricule"
                type="text"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Votre matricule"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-foreground mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-md hover:opacity-90 transition-opacity"
            >
              Se connecter
            </button>
          </form>

          {
          /*
            <div className="mt-6 p-4 bg-muted rounded border border-border">
            <p className="text-xs text-muted-foreground mb-2">Comptes de démonstration :</p>
            <div className="text-xs space-y-1">
              <div className="text-foreground">
                <span className="font-medium">Admin:</span> ADM001 / admin123
              </div>
              <div className="text-foreground">
                <span className="font-medium">Chargé SPA:</span> SPA001 / spa123
              </div>
            </div>
          </div>
          */
          }
        </div>
      </div>
    </div>
  );
}
