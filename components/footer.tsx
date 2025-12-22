export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-4 md:py-6">
      <div className="container mx-auto px-3 md:px-4 text-center">
        <p className="text-xs md:text-sm text-muted-foreground">
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
      </div>
    </footer>
  )
}
