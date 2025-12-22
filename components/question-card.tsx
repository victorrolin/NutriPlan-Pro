"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { QuestionOption } from "@/types/assessment"

interface QuestionCardProps {
  option: QuestionOption
  selected: boolean
  onClick: () => void
  multiSelect?: boolean
}

export function QuestionCard({ option, selected, onClick, multiSelect }: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative group rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        "active:scale-[0.98]", // Feedback tátil para mobile
        selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50",
      )}
    >
      <div className="aspect-[4/3] md:aspect-[3/2] relative overflow-hidden">
        <img
          src={option.image || "/placeholder.svg"}
          alt={option.label}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

        {/* Selection indicator - menor em mobile */}
        {selected && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 p-1 md:p-1.5 rounded-full bg-primary">
            <Check className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
          </div>
        )}

        {multiSelect && !selected && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 p-1 md:p-1.5 rounded-full border-2 border-muted-foreground/50 bg-background/50">
            <div className="h-3 w-3 md:h-4 md:w-4" />
          </div>
        )}
      </div>

      <div className="p-2.5 md:p-4 text-left">
        <h3
          className={cn(
            "font-semibold text-sm md:text-base text-foreground transition-colors line-clamp-1",
            selected && "text-primary",
          )}
        >
          {option.label}
        </h3>
        {option.description && (
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1 line-clamp-1">{option.description}</p>
        )}
      </div>
    </button>
  )
}
