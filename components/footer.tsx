export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-4 md:py-6">
      <div className="container mx-auto px-3 md:px-4 text-center">
        <p className="text-xs md:text-sm text-muted-foreground mb-4">
          Desenvolvido por{" "}
          <a
            href="https://astatonn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline"
          >
            Astatonn.com
          </a>
        </p>
        <div className="flex justify-center border-t border-border pt-4">
          <a
            href="https://wa.me/555131994389"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs md:text-sm font-medium text-green-500 hover:text-green-400 transition-colors"
          >
            Precisa de ajuda? Fale com o Suporte Técnico
          </a>
        </div>
      </div>
    </footer>
  )
}
