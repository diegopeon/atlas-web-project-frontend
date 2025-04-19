
import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    AGUARDANDO_ANALISE_PRELIMINAR: {
      label: "Aguardando Análise",
      variant: "outline" as const,
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    EM_ANALISE: {
      label: "Em Análise",
      variant: "outline" as const,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    PROJETO_RECUSADO: {
      label: "Recusado",
      variant: "outline" as const,
      className: "bg-red-50 text-red-700 border-red-200",
    },
    EM_ANDAMENTO: {
      label: "Em Andamento",
      variant: "outline" as const,
      className: "bg-purple-50 text-purple-700 border-purple-200",
    },
    FINALIZADO: {
      label: "Finalizado",
      variant: "outline" as const,
      className: "bg-green-50 text-green-700 border-green-200",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
