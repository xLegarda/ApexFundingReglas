import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, TrendingUp, Shield, DollarSign, Calendar, Award } from 'lucide-react';

const Apex100KRules = () => {
  const [activePhase, setActivePhase] = useState('pa');
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedAccount, setSelectedAccount] = useState('100k');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const accountConfigs = {
    '25k': {
      size: 25000,
      maxContracts: 4,
      drawdown: 1500,
      safetyNet: 26600,
      minPayout: 500,
      maxPayoutFirst5: 1500,
      profitGoal: 1500,
      monthlyFee: 157,
      type: 'FULL'
    },
    '50k': {
      size: 50000,
      maxContracts: 10,
      drawdown: 2500,
      safetyNet: 52600,
      minPayout: 500,
      maxPayoutFirst5: 2000,
      profitGoal: 3000,
      monthlyFee: 177,
      type: 'FULL'
    },
    '75k': {
      size: 75000,
      maxContracts: 12,
      drawdown: 2750,
      safetyNet: 77850,
      minPayout: 500,
      maxPayoutFirst5: 2250,
      profitGoal: 4500,
      monthlyFee: 187,
      type: 'FULL'
    },
    '100k': {
      size: 100000,
      maxContracts: 14,
      drawdown: 3000,
      safetyNet: 103100,
      minPayout: 500,
      maxPayoutFirst5: 2500,
      profitGoal: 6000,
      monthlyFee: 297,
      type: 'FULL'
    },
    '150k': {
      size: 150000,
      maxContracts: 20,
      drawdown: 5000,
      safetyNet: 155100,
      minPayout: 500,
      maxPayoutFirst5: 2750,
      profitGoal: 9000,
      monthlyFee: 397,
      type: 'FULL'
    },
    '250k': {
      size: 250000,
      maxContracts: 30,
      drawdown: 6500,
      safetyNet: 256600,
      minPayout: 500,
      maxPayoutFirst5: 3000,
      profitGoal: 15000,
      monthlyFee: 497,
      type: 'FULL'
    },
    '300k': {
      size: 300000,
      maxContracts: 35,
      drawdown: 7500,
      safetyNet: 307600,
      minPayout: 500,
      maxPayoutFirst5: 3500,
      profitGoal: 18000,
      monthlyFee: 597,
      type: 'FULL'
    },
    '100k-static': {
      size: 100000,
      maxContracts: 10,
      drawdown: 625,
      safetyNet: 102600,
      minPayout: 500,
      maxPayoutFirst5: 1000,
      profitGoal: 2000,
      monthlyFee: 137,
      type: 'STATIC'
    }
  };

  const account = accountConfigs[selectedAccount];
  
  const halfContracts = Math.ceil(account.maxContracts / 2);
  const trailingStart = account.size - account.drawdown;
  const mae30Percent = Math.round(account.drawdown * 0.3);
  const mae50Percent = Math.round(account.drawdown * 0.5);

  const evaluationRules = useMemo(() => [
    {
      id: 'eval-trailing',
      title: '?? Trailing Drawdown',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-blue-500',
      summary: `${account.type === 'STATIC' ? 'Drawdown fijo' : 'Drawdown móvil'} - Regla principal en Evaluación`,
      details: account.type === 'STATIC' ? {
        fixed: `Drawdown FIJO en $${(account.size - account.drawdown).toLocaleString()}`,
        noMovement: 'El drawdown NO se mueve - permanece en el mismo nivel',
        liquidation: 'Si tu balance toca este nivel, la cuenta se liquida',
        monitoring: 'Monitorea constantemente en RTrader/Tradovate dashboard'
      } : {
        starts: `Comienza en $${trailingStart.toLocaleString()} (Balance inicial - $${account.drawdown.toLocaleString()} drawdown)`,
        moves: 'Se mueve hacia arriba siguiendo tu balance máximo (high watermark)',
        liveValue: 'Basado en el valor LIVE más alto durante trades, NO en trades cerrados',
        stops: `Se detiene cuando alcanzas $${account.safetyNet.toLocaleString()} (Safety Net = $${account.size.toLocaleString()} + $${account.drawdown.toLocaleString()} + $100)`,
        liquidation: 'Si tu balance toca el trailing drawdown, la cuenta se liquida',
        monitoring: 'Monitorea constantemente en RTrader/Tradovate dashboard'
      },
      examples: account.type === 'STATIC' ? [
        `? Balance $${account.size.toLocaleString()} ? Drawdown FIJO en $${(account.size - account.drawdown).toLocaleString()}`,
        `? Balance sube a $${(account.size + 2000).toLocaleString()} ? Drawdown sigue en $${(account.size - account.drawdown).toLocaleString()}`,
        `? Balance toca $${(account.size - account.drawdown).toLocaleString()} = Cuenta liquidada`
      ] : [
        `? Balance $${account.size.toLocaleString()} ? Trailing en $${trailingStart.toLocaleString()}`,
        `? Trade peak $${(account.size + 2000).toLocaleString()}, cierras en $${(account.size + 1500).toLocaleString()} ? Trailing en $${(account.size + 2000 - account.drawdown).toLocaleString()} (sigue el peak)`,
        `? Balance llega a $${account.safetyNet.toLocaleString()}+ ? Trailing se fija permanentemente en $${(account.size + 100).toLocaleString()}`,
        `? Balance toca el trailing = Cuenta liquidada inmediatamente`
      ]
    },
    {
      id: 'eval-days',
      title: '?? Días Mínimos de Trading',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-indigo-500',
      summary: '7 días de trading para pasar evaluación',
      details: {
        minimum: '7 días de trading completados (no consecutivos)',
        noMaximum: 'No hay máximo - toma el tiempo que necesites',
        profitGoal: `Debes alcanzar el objetivo de profit ($${account.profitGoal.toLocaleString()} para ${selectedAccount.toUpperCase()})`,
        maintain: 'Si alcanzas el objetivo antes de los 7 días, mantén el balance arriba hasta completar los días'
      },
      examples: [
        `? 7 días trading + $${account.profitGoal.toLocaleString()} profit = Pasas evaluación`,
        '? Puedes tomar días libres - no tienen que ser consecutivos',
        '? Solo 6 días de trading = No pasas aunque tengas profit',
        `?? Alcanzas $${account.profitGoal.toLocaleString()} en día 4 ? Sigue trading hasta completar 7 días`
      ]
    },
    {
      id: 'eval-close-time',
      title: '? Cierre de Operaciones',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-red-500',
      summary: 'Todas las operaciones deben cerrarse antes de 4:59 PM ET',
      details: {
        deadline: 'Cierra todas las operaciones y cancela órdenes pendientes antes de 4:59 PM ET',
        autoClose: 'Apex cierra posiciones automáticamente a las 4:59 PM, pero NO confíes en esto',
        manual: 'Debes cancelar manualmente órdenes que NO estén attached a posiciones',
        risk: 'Dejar operaciones abiertas puede causar gaps que liquiden tu cuenta',
        holidays: 'En días festivos con cierre temprano, cierra a la hora correspondiente del mercado'
      },
      examples: [
        '? Cierras todas las posiciones a las 4:30 PM ET',
        '? Confiar en el auto-close como estrategia principal',
        '? Dejar órdenes pendientes sin attached position',
        '?? Día festivo con cierre 1:00 PM ? Cierra a esa hora'
      ]
    },
    {
      id: 'eval-holidays',
      title: '?? Trading en Días Festivos',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-purple-500',
      summary: 'Puedes tradear festivos pero half-days no cuentan',
      details: {
        fullDays: 'Si el mercado está abierto full day en festivo, cuenta como día de trading',
        halfDays: 'Half-day holidays NO cuentan como día de trading separado',
        combined: 'Half-day se combina con el siguiente día de trading',
        sundays: 'Trading los domingos cuenta como parte del lunes (6:00 PM domingo - 4:59 PM lunes)'
      },
      examples: [
        '? Festivo mercado abierto full ? Cuenta como 1 día',
        '? Half-day holiday ? No cuenta separado',
        '?? Domingo 8:00 PM trading ? Cuenta como lunes',
        '?? Día de trading = 6:00 PM ET un día hasta 4:59 PM ET siguiente día'
      ]
    },
    {
      id: 'eval-freedom',
      title: '?? Sin Reglas de Consistencia',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      summary: 'Libertad total para alcanzar objetivos',
      details: {
        noRules: 'No hay límites de contratos, P&L negativo, ni consistencia',
        focus: 'Solo enfócate en no tocar el drawdown',
        contracts: `Puedes usar los ${account.maxContracts} contratos completos desde el inicio`,
        trading: 'Trading libre - cualquier estrategia que respete el drawdown',
        allIn: 'Puedes hacer "all-in" trades si quieres - no hay restricciones'
      }
    },
    {
      id: 'eval-profit-goal',
      title: '?? Objetivo de Profit',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-600',
      summary: `$${account.profitGoal.toLocaleString()} profit neto (después de comisiones)`,
      details: {
        target: `Necesitas alcanzar $${account.profitGoal.toLocaleString()} de profit para la cuenta ${selectedAccount.toUpperCase()}`,
        netCommissions: 'El profit es NETO de comisiones y todos los costos',
        realTime: 'Puedes ver tu P&L en tiempo real en RTrader/Tradovate',
        maintain: 'Una vez alcanzado, mantén el balance arriba hasta completar 7 días'
      },
      examples: [
        `? Balance $${(account.size + account.profitGoal).toLocaleString()}+ = $${account.profitGoal.toLocaleString()} profit alcanzado`,
        '?? Comisiones ya están descontadas del balance mostrado',
        `?? Si llegas a $${(account.size + account.profitGoal).toLocaleString()} en día 5, mantente arriba 2 días más`
      ]
    }
  ], [selectedAccount, account]);

  const paRules = useMemo(() => [
    {
      id: 'trading-days',
      title: '?? Días de Trading Requeridos',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-indigo-500',
      summary: 'Requisitos de días antes de solicitar payout',
      details: {
        minimum: '8 días de trading completados',
        profitable: '5 de esos 8 días deben mostrar profit de $50 o más',
        verification: 'Si no cumples los días mínimos, NO se verifica tu solicitud',
        cycle: 'Después de cada payout aprobado, necesitas otros 8 días para el siguiente'
      },
      examples: [
        '? 8 días trading, 5 con +$50 profit = Elegible',
        '? 10 días trading, 6 con +$50 profit = Elegible',
        '? 8 días pero solo 4 con +$50 = NO elegible',
        '? Solo 6 días de trading = Solicitud NO verificada'
      ]
    },
    {
      id: 'contract-scaling',
      title: '?? Escalado de Contratos',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-blue-500',
      summary: account.type === 'STATIC' 
        ? `Contratos completos después de $${account.safetyNet.toLocaleString()}`
        : 'Máximo 50% de contratos hasta alcanzar Safety Net',
      details: account.type === 'STATIC' ? {
        restriction: `Contratos completos (${account.maxContracts}) disponibles después de alcanzar $${account.safetyNet.toLocaleString()}`,
        safetyNet: `Safety Net = $${account.size.toLocaleString()} + $${account.drawdown.toLocaleString()} + $2,000 = $${account.safetyNet.toLocaleString()}`,
        important: 'Una vez desbloqueado, mantienes el límite completo incluso si el balance baja'
      } : {
        restriction: `Puedes operar máximo ${halfContracts} contratos (50% del máximo)`,
        unlock: `Cuando tu balance EOD llegue a $${account.safetyNet.toLocaleString()} (Balance inicial + $${account.drawdown.toLocaleString()} drawdown + $100)`,
        after: `Después de alcanzar este nivel, podrás usar los ${account.maxContracts} contratos completos`,
        important: 'Una vez desbloqueado, mantienes el límite completo incluso si el balance baja',
        penalty: 'Violar esta regla = Payout denegado + Reset a balance del día anterior'
      },
      examples: account.type === 'STATIC' ? [
        `? Balance: $${account.size.toLocaleString()} ? Espera llegar a safety net`,
        `? Balance EOD: $${account.safetyNet.toLocaleString()}+ ? Desbloqueado ${account.maxContracts} contratos`
      ] : [
        `? Balance: $${account.size.toLocaleString()} ? Máximo ${halfContracts} contratos`,
        `? Balance EOD: $${account.safetyNet.toLocaleString()}+ ? Desbloqueado ${account.maxContracts} contratos`,
        `? Usar ${halfContracts + 2} contratos antes de $${account.safetyNet.toLocaleString()}`,
        '? No cerrar exceso inmediatamente = Penalización'
      ]
    },
    {
      id: 'negative-pnl',
      title: '?? Regla 30% P&L Negativo (MAE)',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-500',
      summary: 'Pérdida máxima por operación: 30% del profit',
      details: account.type === 'STATIC' ? {
        belowSafetyNet: `Debajo de $${account.safetyNet.toLocaleString()}: Máx pérdida $${Math.round(account.drawdown * 0.3)} (30% de $${account.drawdown})`,
        aboveSafetyNet: 'Arriba del Safety Net: 30% del profit actual en la cuenta',
        example: `Balance $${(account.size + 3000).toLocaleString()} (profit $3,000) ? Máx pérdida: $900 (30%)`,
        perTrade: 'Límite es POR OPERACIÓN, no pérdida diaria total'
      } : {
        perTrade: 'Límite es POR OPERACIÓN, no pérdida diaria total',
        newAccount: `Cuenta nueva o bajo profit: 30% del trailing threshold ($${account.drawdown.toLocaleString()}) = $${mae30Percent} máximo`,
        withProfit: 'Con profit establecido: 30% del balance de profit al inicio del día',
        upgrade: `Si duplicas el safety net ($${(account.drawdown + 100) * 2}+ profit): límite aumenta a 50%`,
        monitoring: 'Debes monitorear CONSTANTEMENTE tus posiciones abiertas',
        temporary: 'Excesos temporales corregidos rápido no generan penalización automática'
      },
      examples: account.type === 'STATIC' ? [
        `? Balance $${account.size.toLocaleString()} ? Máx pérdida: $${Math.round(account.drawdown * 0.3)}`,
        `? Balance $${(account.size + 3000).toLocaleString()} (profit $3K) ? Máx pérdida: $900`,
        '? Permitir que UNA operación baje más del límite'
      ] : [
        `? Balance $${account.size.toLocaleString()} (sin profit) ? Máx pérdida: $${mae30Percent}`,
        `? Balance $${(account.size + 4000).toLocaleString()} (profit $4K) ? Máx pérdida: $${Math.round(4000 * 0.3)} (30%)`,
        `? Balance $${(account.size + (account.drawdown + 100) * 2).toLocaleString()}+ (profit $${((account.drawdown + 100) * 2).toLocaleString()}+) ? Máx pérdida: $${Math.round(((account.drawdown + 100) * 2) * 0.5)} (50%)`,
        '? Permitir que UNA operación baje más del límite',
        '?? Si llegas a 32% y cierras rápido = OK, no es penalización'
      ]
    },
    {
      id: 'risk-reward',
      title: '?? Ratio Riesgo-Recompensa 5:1',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500',
      summary: 'Stop loss máximo: 5 veces tu objetivo de ganancia',
      details: {
        rule: 'Por cada dólar que buscas ganar, no puedes arriesgar más de $5',
        calculation: 'Si tu objetivo es $100 ? Stop loss máximo $500',
        ticks: 'Si buscas 10 ticks de ganancia ? Stop loss máximo 50 ticks',
        mental: 'Stops mentales están permitidos (excepto si estás en probation)',
        trailing: 'Puedes mover stops hacia adelante (proteger profit), nunca hacia atrás'
      },
      examples: [
        '? Target: $200 | Stop: $800 (ratio 4:1)',
        '? Target: 20 ticks | Stop: 80 ticks (ratio 4:1)',
        '? Target: $100 | Stop: $1,000 (ratio 10:1)',
        '? Target: 5 ticks | Stop: 150 ticks (ratio 30:1)'
      ]
    },
    {
      id: 'consistency',
      title: '?? Regla Consistencia 30% (Windfall)',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-yellow-500',
      summary: 'Ningún día puede representar más del 30% del profit total',
      details: {
        rule: 'Un solo día de trading no puede generar más del 30% de tu profit acumulado',
        calculation: 'Fórmula: Día más alto de ganancia ÷ 0.3 = Profit mínimo total requerido',
        reset: 'Se reinicia después de cada payout aprobado',
        expires: 'Se elimina en el 6to payout o al pasar a Live Prop Account',
        period: 'Se mide desde el último payout aprobado (o inicio si es primer payout)'
      },
      examples: [
        '?? Día más alto: $1,500 ? Necesitas $5,000 profit total',
        '?? Día más alto: $2,000 ? Necesitas $6,667 profit total',
        '?? Fórmula: $1,500 ÷ 0.3 = $5,000 mínimo',
        '? Si tu profit total es $6,000 y mejor día fue $1,500 = OK',
        '? Si tu profit total es $4,000 y mejor día fue $1,500 = NO elegible'
      ]
    },
    {
      id: 'hedging',
      title: '?? Prohibido Hedging',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-purple-500',
      summary: 'Solo una dirección a la vez - No Long y Short simultáneos',
      details: {
        rule: 'No puedes mantener posiciones Long y Short al mismo tiempo',
        correlation: 'Tampoco en instrumentos correlacionados (ES + YM, NQ + ES, etc.)',
        direction: 'Solo trading direccional - una dirección por vez',
        sizes: 'No puedes ir long en minis y short en micros simultáneamente',
        news: 'Durante eventos de noticias: solo una dirección permitida'
      },
      examples: [
        '? Solo Long en ES',
        '? Solo Short en NQ',
        '? Long ES + Short YM (correlacionados)',
        '? Long en minis + Short en micros',
        '? Long NQ + Short ES'
      ]
    },
    {
      id: 'safety-net',
      title: '??? Safety Net (Primeros 3 Payouts)',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-indigo-500',
      summary: `Mantén balance mínimo de $${account.safetyNet.toLocaleString()} para payouts`,
      details: {
        applies: 'Solo aplica para los primeros 3 payouts APROBADOS',
        definition: `$${account.size.toLocaleString()} + $${account.drawdown.toLocaleString()} (drawdown) + $${account.type === 'STATIC' ? '2,000' : '100'} = $${account.safetyNet.toLocaleString()}`,
        minPayout: `Con $${account.safetyNet.toLocaleString()} puedes retirar mínimo $500`,
        moreThan500: 'Para retirar más de $500: balance debe exceder safety net por el monto adicional',
        expires: 'Después del 3er payout aprobado, esta regla desaparece'
      },
      examples: [
        `? Balance $${account.safetyNet.toLocaleString()} ? Puedes retirar $500 (queda $${(account.safetyNet - 500).toLocaleString()})`,
        `? Balance $${(account.safetyNet + 700).toLocaleString()} ? Puedes retirar $1,200`,
        '   +- Cálculo: $500 base + $700 extra = $1,200',
        `   +- Necesitas: $${account.safetyNet.toLocaleString()} + $700 = $${(account.safetyNet + 700).toLocaleString()}`,
        `? Balance $${(account.safetyNet - 100).toLocaleString()} ? NO puedes solicitar payout`,
        '?? Payout 4 en adelante: Sin safety net!'
      ]
    },
    {
      id: 'max-contracts',
      title: '?? Límite Máximo de Contratos',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-cyan-500',
      summary: `No exceder los ${account.maxContracts} contratos totales`,
      details: {
        limit: `Máximo ${account.maxContracts} contratos en total en cualquier momento`,
        instruments: `No puedes tener ${account.maxContracts} en ES + ${account.maxContracts} en YM = ${account.maxContracts * 2} total`,
        micros: 'No uses micros para evadir el límite de contratos',
        violation: 'Violación = Descalificación de payout + Remoción de ganancias'
      },
      examples: [
        `? ${account.maxContracts} contratos en ES`,
        `? ${Math.floor(account.maxContracts * 0.6)} contratos en NQ`,
        `? ${Math.floor(account.maxContracts * 0.7)} en ES + ${Math.floor(account.maxContracts * 0.7)} en YM = ${Math.floor(account.maxContracts * 1.4)} total`,
        '? Abusar de micros para exceder límite'
      ]
    },
    {
      id: 'contract-consistency',
      title: '?? Consistencia de Tamaño de Contratos',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
      summary: 'Mantén tamaños consistentes - No manipules',
      details: {
        principle: 'Debes mantener tamaños de contratos consistentes con tu estrategia',
        scaling: 'Incrementar tamaño con crecimiento de balance = OK',
        reducing: 'Reducir por pérdidas o después de retiro = OK',
        prohibited: 'Usar tamaños grandes al inicio, luego pequeños = Manipulación',
        proof: 'Podrías necesitar 8 días de trading consistente para probar estabilidad'
      },
      examples: [
        '? Empiezas con 2 contratos, escalas a 4-6 con crecimiento',
        '? Después de retiro, reduces de 8 a 4 contratos',
        `? Día 1-2: ${account.maxContracts} contratos | Día 3-8: 2 contratos`,
        '? "Ir all-in" al inicio, luego reducir drásticamente'
      ]
    },
    {
      id: 'payout-requirements',
      title: '?? Requisitos para Solicitar Payout',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-emerald-500',
      summary: 'Condiciones que debes cumplir antes de retirar',
      details: {
        minDays: '8 días de trading completados desde último payout (o inicio)',
        profitableDays: '5 de esos 8 días con profit de $50 o más',
        minBalance: `Balance mínimo: ${account.safetyNet.toLocaleString()} (primeros 3 payouts)`,
        minAmount: `Monto mínimo: ${account.minPayout}`,
        maxAmount: `Monto máximo: ${account.maxPayoutFirst5.toLocaleString()} (primeros 5 payouts)`,
        consistency30: 'Cumplir regla 30% Consistencia (primeros 5 payouts)',
        postRequest: 'Después de solicitar: Puedes seguir trading INMEDIATAMENTE'
      },
      examples: [
        `? 8 días, 5 con $50+, balance ${account.safetyNet.toLocaleString()}+ = Elegible`,
        `? Solicitas ${account.minPayout} y sigues trading sin esperar aprobación`,
        `? Solo 7 días completados = Solicitud NO verificada`,
        `? Balance cae bajo ${account.safetyNet.toLocaleString()} después de solicitar = Payout DENEGADO`
      ]
    },
    {
      id: 'post-payout-trading',
      title: '?? Trading Después de Solicitar Payout',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-blue-600',
      summary: 'Reglas críticas después de solicitar retiro',
      details: {
        canTrade: 'Puedes seguir trading INMEDIATAMENTE - No necesitas esperar aprobación',
        critical: 'Opera como si el dinero YA fue retirado de tu balance',
        minBalance: `Si tu balance cae bajo ${account.safetyNet.toLocaleString()} después de solicitar = PAYOUT DENEGADO`,
        noCancel: 'No necesitas cancelar/editar - Se denegará automáticamente si no cumples',
        conservative: 'Recomendación: Opera conservadoramente o toma break hasta aprobación'
      },
      examples: [
        `Balance ${(account.safetyNet + 1000).toLocaleString()}, solicitas ${account.minPayout} ? Puedes seguir trading`,
        `?? Después de solicitar, balance baja a ${(account.safetyNet - 200).toLocaleString()} ? Payout DENEGADO`,
        '? Opera como si ya tuvieras $500 menos en cuenta',
        `? Balance ${account.safetyNet.toLocaleString()}, solicitas ${account.minPayout}, caes a ${(account.safetyNet - 100).toLocaleString()} = Denegado`
      ]
    },
    {
      id: 'prohibited-activities',
      title: '?? Actividades Estrictamente Prohibidas',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-red-600',
      summary: 'Violación = Cierre de cuenta y pérdida de fondos',
      details: {
        noRiskManagement: 'Trading sin stop losses o risk management definido',
        hft: 'High Frequency Trading (HFT) - Manipulación del entorno simulado',
        automation: 'Bots completamente automatizados, AI, algoritmos full-auto',
        thresholdAsStop: 'Usar el Trailing Threshold como stop loss',
        copyTrading: 'Copy trading, trade mirroring, sistemas automatizados de terceros',
        sharing: 'Compartir MAC address, IPs, computadoras, tarjetas de crédito',
        multipleUsers: 'Permitir que otra persona opere tu cuenta',
        accountSharing: 'Crear múltiples user accounts (bannable offense)',
        stockpiling: 'Comprar múltiples cuentas de evaluación con descuento para "quemar"'
      },
      examples: [
        '? Usar bot 24/7 que opera solo',
        '? HFT o explotar el entorno de simulación',
        '? Dejar que amigo opere tu cuenta',
        '? Compartir IP/MAC con otro trader',
        '? Trading sin stops definidos',
        '? Crear 2+ user accounts diferentes',
        '?? Violación = Cuenta cerrada + Pérdida de todos los fondos'
      ]
    }
  ], [selectedAccount, account, halfContracts, mae30Percent]);

  const liveRules = [
    {
      id: 'invitation',
      title: '?? Invitación a Live Prop',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-purple-600',
      summary: 'Solo por invitación de Apex',
      details: {
        process: 'Apex te contacta cuando cumples criterios (no solicitable)',
        criteria: 'Consistencia, disciplina, cumplimiento de reglas',
        noInfo: 'Help Desk no tiene información sobre cuándo serás considerado',
        patience: 'Sigue operando bien - serás contactado cuando califiques'
      }
    },
    {
      id: 'payout4-freedom',
      title: '?? Payout 4: Eliminación Safety Net',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-600',
      summary: `Ya no necesitas mantener $${account.safetyNet.toLocaleString()}`,
      details: {
        removed: 'La restricción de Safety Net desaparece',
        flexibility: 'Más flexibilidad en montos de retiro',
        minimum: 'Solo necesitas balance suficiente para no tocar drawdown',
        freedom: 'Puedes retirar cantidades mayores más fácilmente'
      }
    },
    {
      id: 'full-contracts',
      title: '?? Contratos Completos Permanentes',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-blue-600',
      summary: `Ya tienes ${account.maxContracts} contratos desbloqueados desde Safety Net`,
      details: {
        unlocked: `Desbloqueaste esto en PA al llegar a $${account.safetyNet.toLocaleString()}`,
        maintains: 'Este beneficio se mantiene en Live Prop',
        scaling: 'Puedes escalar posiciones según tu estrategia',
        permanent: 'Ya no hay restricción de 50%'
      }
    },
    {
      id: 'enhanced-mae',
      title: '? MAE Mejorado (50%)',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-indigo-600',
      summary: 'Límite de pérdida aumenta con tu crecimiento',
      details: {
        threshold: `Si tu profit duplica el safety net (${((account.drawdown + (account.type === 'STATIC' ? 2000 : 100)) * 2).toLocaleString()}+), límite aumenta a 50%`,
        calculation: 'Con profit duplicado ? Máx pérdida: 50% del profit',
        example: `Balance ${(account.size + (account.drawdown + (account.type === 'STATIC' ? 2000 : 100)) * 2).toLocaleString()} ? Máx pérdida ${Math.round(((account.drawdown + (account.type === 'STATIC' ? 2000 : 100)) * 2) * 0.5).toLocaleString()} (50%)`,
        scaling: 'A medida que creces, tu margen de riesgo crece proporcionalmente'
      },
      examples: [
        `Profit ${(account.drawdown + (account.type === 'STATIC' ? 2000 : 100)).toLocaleString()}-${((account.drawdown + (account.type === 'STATIC' ? 2000 : 100)) * 2 - 1).toLocaleString()} ? Límite 30%`,
        `Profit ${((account.drawdown + (account.type === 'STATIC' ? 2000 : 100)) * 2).toLocaleString()}+ ? Límite 50%`,
        `Balance ${(account.size + 10000).toLocaleString()} (profit $10K) ? Máx pérdida $5,000`
      ]
    },
    {
      id: 'payout6-consistency',
      title: '?? Payout 6: Sin Regla 30% Consistencia',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-yellow-600',
      summary: 'Eliminación de restricción de windfall',
      details: {
        removed: 'La regla de consistencia 30% ya no aplica',
        bigDays: 'Puedes tener días grandes de profit sin restricciones',
        freedom: 'Ya no importa si un día genera 50%, 80% del profit',
        milestone: 'También se elimina si pasas a Live Prop Account antes del 6to payout'
      }
    },
    {
      id: 'payout6-unlimited',
      title: '?? Payout 6: Sin Límite Máximo',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-700',
      summary: `Ya no hay tope de ${account.maxPayoutFirst5.toLocaleString()} por payout`,
      details: {
        noMax: `Ya no hay límite máximo de ${account.maxPayoutFirst5.toLocaleString()} por payout`,
        condition: 'Siempre que mantengas balance mínimo después del retiro',
        frequency: 'Cada 8 días de trading puedes solicitar',
        amounts: 'Retira la cantidad que necesites (respetando balance mínimo)'
      },
      examples: [
        '? Puedes retirar $5,000',
        '? Puedes retirar $10,000',
        '? Puedes retirar $15,000+',
        '?? Solo mantén balance suficiente después del retiro'
      ]
    },
    {
      id: 'payout-split',
      title: '?? División de Payouts',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-emerald-600',
      summary: '100% de primeros $25K, luego 90%',
      details: {
        first25k: '100% de los primeros $25,000 por cuenta',
        after: '90% del profit después de los primeros $25,000',
        perAccount: 'Aplica por cuenta individual',
        example: 'Si retiras $30,000 total: $25,000 (100%) + $5,000 (90% = $4,500)'
      }
    },
    {
      id: 'timeline',
      title: '?? Timeline de Progresión',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-pink-600',
      summary: 'Ruta de progresión completa',
      details: {
        fast: 'Mínimo 48 días de trading (6 payouts x 8 días)',
        payout1to3: `Payouts 1-3: Safety Net + Máx ${account.maxPayoutFirst5.toLocaleString()}`,
        payout4to5: `Payouts 4-5: Sin Safety Net + Máx ${account.maxPayoutFirst5.toLocaleString()}`,
        payout6plus: 'Payout 6+: Sin Safety Net + Sin límite + Sin regla 30%',
        liveProp: 'O invitación a Live Prop (elimina varias restricciones)'
      }
    }
  ];

  const RuleCard = ({ rule }) => {
    const isExpanded = expandedSections[rule.id];
    
    return (
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden border-l-4" style={{borderLeftColor: rule.color.replace('bg-', '#')}}>
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(rule.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${rule.color} text-white p-2 rounded-lg`}>
                {rule.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{rule.title}</h3>
                <p className="text-sm text-gray-600">{rule.summary}</p>
              </div>
            </div>
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="space-y-3">
              {Object.entries(rule.details).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded border-l-2 border-blue-400">
                  <p className="text-sm font-semibold text-gray-700 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </p>
                  <p className="text-sm text-gray-600">{value}</p>
                </div>
              ))}
              
              {rule.examples && (
                <div className="mt-4">
                  <p className="font-semibold text-sm mb-2">?? Ejemplos:</p>
                  <div className="space-y-1">
                    {rule.examples.map((example, idx) => (
                      <div 
                        key={idx} 
                        className={`text-sm p-2 rounded ${
                          example.startsWith('?') ? 'bg-green-50 text-green-800' : 
                          example.startsWith('?') ? 'bg-red-50 text-red-800' : 
                          example.startsWith('??') || example.startsWith('??') ? 'bg-yellow-50 text-yellow-800' :
                          example.startsWith('??') || example.startsWith('??') ? 'bg-blue-50 text-blue-800' :
                          'bg-gray-50 text-gray-800'
                        }`}
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reglas Apex Trader Funding - Guía Completa
          </h1>
          <p className="text-gray-600 mb-4">Selecciona tu tipo de cuenta y explora las 3 fases</p>
          
          {/* Account Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selecciona tu Cuenta:
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg font-semibold text-lg bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="25k">25K FULL - ${accountConfigs['25k'].size.toLocaleString()}</option>
              <option value="50k">50K FULL - ${accountConfigs['50k'].size.toLocaleString()}</option>
              <option value="75k">75K FULL - ${accountConfigs['75k'].size.toLocaleString()}</option>
              <option value="100k">100K FULL - ${accountConfigs['100k'].size.toLocaleString()}</option>
              <option value="150k">150K FULL - ${accountConfigs['150k'].size.toLocaleString()}</option>
              <option value="250k">250K FULL - ${accountConfigs['250k'].size.toLocaleString()}</option>
              <option value="300k">300K FULL - ${accountConfigs['300k'].size.toLocaleString()}</option>
              <option value="100k-static">100K STATIC - ${accountConfigs['100k-static'].size.toLocaleString()}</option>
            </select>
          </div>
          
          {/* Account Info */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Tamaño</p>
              <p className="text-lg font-bold text-blue-600">${account.size.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Contratos</p>
              <p className="text-lg font-bold text-green-600">{account.maxContracts}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Drawdown</p>
              <p className="text-lg font-bold text-red-600">${account.drawdown.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Safety Net</p>
              <p className="text-lg font-bold text-purple-600">${account.safetyNet.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Profit Goal</p>
              <p className="text-lg font-bold text-yellow-600">${account.profitGoal.toLocaleString()}</p>
            </div>
          </div>
          
          {account.type === 'STATIC' && (
            <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
              <p className="text-sm font-semibold text-amber-800">?? Cuenta STATIC</p>
              <p className="text-xs text-amber-700">Drawdown fijo que NO se mueve con el balance</p>
            </div>
          )}
        </div>

        {/* Phase Selector */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6 grid grid-cols-3 gap-2">
          <button
            onClick={() => setActivePhase('eval')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activePhase === 'eval'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="text-sm">Fase 1</div>
            <div className="text-xs opacity-80">Evaluation</div>
          </button>
          <button
            onClick={() => setActivePhase('pa')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activePhase === 'pa'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="text-sm">Fase 2</div>
            <div className="text-xs opacity-80">Performance Account</div>
          </button>
          <button
            onClick={() => setActivePhase('live')}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              activePhase === 'live'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="text-sm">Fase 3</div>
            <div className="text-xs opacity-80">Live Prop Account</div>
          </button>
        </div>

        {/* Rules Display */}
        <div className="space-y-4">
          {activePhase === 'eval' && (
            <>
              <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
                <h2 className="text-xl font-bold mb-2">?? Fase 1: Evaluation Account</h2>
                <p className="text-sm opacity-90">
                  Fase de prueba - Solo regla de {account.type === 'STATIC' ? 'drawdown fijo' : 'trailing drawdown'}, sin restricciones de consistencia
                </p>
              </div>
              {evaluationRules.map(rule => <RuleCard key={rule.id} rule={rule} />)}
              
              <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
                <p className="font-bold text-green-800 mb-2">? Ventaja de Evaluation:</p>
                <p className="text-sm text-green-700">
                  Usa estrategias agresivas si quieres - no hay límites de contratos, consistencia, o P&L negativo.
                  Solo no toques el drawdown. Una vez que pasas, prepárate para las reglas de PA.
                </p>
              </div>
            </>
          )}

          {activePhase === 'pa' && (
            <>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-xl font-bold mb-2">?? Fase 2: Performance Account (PA)</h2>
                <p className="text-sm opacity-90">
                  Todas las reglas de consistencia activas - Trading disciplinado y profesional requerido
                </p>
              </div>
              {paRules.map(rule => <RuleCard key={rule.id} rule={rule} />)}
              
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="font-bold text-yellow-800 mb-2">?? Importante:</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Si no cumples los 8 días de trading, tu solicitud NO se verifica</li>
                  <li>• Necesitas 5 días con $50+ profit de esos 8 días</li>
                  <li>• Después de cada payout, el ciclo de 8 días se reinicia</li>
                </ul>
              </div>
            </>
          )}

          {activePhase === 'live' && (
            <>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-xl font-bold mb-2">?? Fase 3: Live Prop Account</h2>
                <p className="text-sm opacity-90">
                  Eliminación progresiva de restricciones - Beneficios desbloqueados gradualmente
                </p>
              </div>
              {liveRules.map(rule => <RuleCard key={rule.id} rule={rule} />)}
              
              <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded">
                <p className="font-bold text-purple-800 mb-2">?? Timeline de Beneficios:</p>
                <div className="text-sm text-purple-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">Payout 4</span>
                    <span>Sin Safety Net</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">Payout 6</span>
                    <span>Sin regla 30% + Sin límite máximo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">Live Prop</span>
                    <span>Invitación de Apex - Elimina varias restricciones</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Reference */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold mb-3">?? Referencia Rápida - {selectedAccount.toUpperCase()}</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-bold mb-2 opacity-90">Fase 1: Evaluation</p>
              <ul className="space-y-1 opacity-80">
                <li>• {account.type === 'STATIC' ? 'Drawdown fijo' : 'Trailing drawdown'}</li>
                <li>• {account.maxContracts} contratos disponibles</li>
                <li>• Sin reglas consistencia</li>
                <li>• 7 días mínimos</li>
                <li>• Meta: ${account.profitGoal.toLocaleString()}</li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2 opacity-90">Fase 2: PA</p>
              <ul className="space-y-1 opacity-80">
                <li>• 8 días trading (5 con $50+)</li>
                <li>• {account.type === 'STATIC' ? `${account.maxContracts} después de Safety Net` : `${halfContracts} contratos hasta ${account.safetyNet.toLocaleString()}`}</li>
                <li>• Reglas consistencia activas</li>
                <li>• Safety Net primeros 3 payouts</li>
                <li>• Máx payout: ${account.maxPayoutFirst5.toLocaleString()}</li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2 opacity-90">Fase 3: Live Prop</p>
              <ul className="space-y-1 opacity-80">
                <li>• Payout 4: Sin Safety Net</li>
                <li>• Payout 6: Sin límites</li>
                <li>• Invitación Live Prop</li>
                <li>• 100%/90% split</li>
                <li>• Más flexibilidad</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Haz clic en cada regla para ver detalles completos, ejemplos y cálculos específicos para tu cuenta</p>
        </div>
      </div>
    </div>
  );
};


export default Apex100KRules;
