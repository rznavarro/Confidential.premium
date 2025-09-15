import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { Team } from '../../types';

interface TeamVerificationProps {
  team: Team;
  onVerify: (teamCode: string) => boolean;
  onGoBack: () => void;
}

export const TeamVerification: React.FC<TeamVerificationProps> = ({ 
  team, 
  onVerify, 
  onGoBack 
}) => {
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = onVerify(teamCode);
    if (!success) {
      setError('Código de equipo incorrecto. Contacta a tu supervisor.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${team.color}20`, border: `2px solid ${team.color}` }}
          >
            {team.icon}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Verificación de Equipo
          </h1>
          <p className="text-slate-400">
            Ingresa el código de acceso para <span className="text-cyan-400 font-semibold">{team.name}</span>
          </p>
        </div>

        <Card className="space-y-6">
          <div className="text-center p-4 bg-slate-800/30 rounded-lg">
            <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white mb-1">{team.name}</h3>
            <p className="text-slate-400 text-sm">Supervisor: {team.supervisor}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Código de Equipo
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  placeholder="Ingresa el código del equipo"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onGoBack}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !teamCode}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Acceder al Equipo'
                )}
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            ¿No tienes el código? Contacta a tu supervisor del equipo.
          </p>
        </div>
      </div>
    </div>
  );
};