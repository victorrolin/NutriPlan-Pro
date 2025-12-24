"use client"

import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Dumbbell, Zap, Target, Brain, ArrowRight, Play, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Phone, Mail, User } from "lucide-react"

export function LandingPage() {
    const [step, setStep] = useState<"idle" | "register" | "payment">("idle")

    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg tracking-tight">FitPlan Pro</span>
                            <p className="text-[10px] text-gray-400 font-medium leading-none">Personal Trainer IA</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
                        <a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a>
                        <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link href="/auth/login">
                            <Button variant="ghost" className="text-sm font-medium hover:bg-white/5 text-gray-300">
                                Entrar
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-4 text-center pb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-green-400 mb-8 animate-fade-in">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="flex items-center gap-1.5">
                            <Bot className="w-3 h-3" />
                            Powered by Artificial Intelligence
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        A Revolução do <br />
                        <span className="bg-gradient-to-r from-green-400 tracking-tighter to-emerald-500 bg-clip-text text-transparent italic">
                            Treino Inteligente
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
                        Treinos personalizados criados por <span className="text-white font-medium">Inteligência Artificial</span> sob medida.
                        Responda algumas perguntas e nossa IA irá montar o plano perfeito para seus objetivos.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-6">
                        {step === "idle" && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => setStep("register")}
                                    className="h-14 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-transform text-lg font-bold rounded-2xl group shadow-lg shadow-green-500/20"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Começar Agora
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <a href="#como-funciona">
                                    <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 bg-transparent rounded-2xl text-lg font-bold">
                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                        Como Funciona
                                    </Button>
                                </a>
                            </div>
                        )}

                        {step === "register" && (
                            <div className="w-full max-w-md mx-auto p-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl backdrop-blur-xl border border-white/10 animate-in fade-in zoom-in duration-300">
                                <RegistrationForm onSuccess={() => setStep("payment")} />
                            </div>
                        )}

                        {step === "payment" && (
                            <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-sm text-green-400 font-medium animate-pulse flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Dados salvos! Realize o pagamento para liberar seu acesso instantâneo.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <MercadoPagoButton />
                                    <a href="#como-funciona">
                                        <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 bg-transparent rounded-2xl text-lg font-bold">
                                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                            Como Funciona
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto py-8 border-y border-white/5">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white">Treino Prontamente</p>
                                <p className="text-xs text-gray-500">Geração inteligente em poucos minutos</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white">100% Personalizado</p>
                                <p className="text-xs text-gray-500">Focado nos seus pontos fracos</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white">Ciência de Ponta</p>
                                <p className="text-xs text-gray-500">Periodização baseada em dados</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section id="como-funciona" className="py-24 border-t border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sua jornada em <span className="text-green-500">3 passos</span></h2>
                            <p className="text-gray-400">Simples, rápido e extremamente eficiente.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { step: "01", title: "Perfil Detalhado", desc: "Nossa IA analisa seu biotipo, objetivos e limitações através de 20+ perguntas estratégicas." },
                                { step: "02", title: "Geração por IA", desc: "Algoritmos de ponta criam uma periodização exclusiva, escolhendo os melhores exercícios para você." },
                                { step: "03", title: "Resultados Reais", desc: "Receba seu treino em PDF pronto para executar, com cargas sugeridas e protocolos detalhados." }
                            ].map((s, i) => (
                                <div key={i} className="relative group">
                                    <div className="text-6xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-green-500/10 transition-colors">{s.step}</div>
                                    <h3 className="text-xl font-bold mb-4 text-white">{s.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="beneficios" className="py-24 bg-gradient-to-b from-transparent to-white/[0.02] border-t border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Ciência por trás do <span className="text-green-500">Resultado</span></h2>
                            <p className="text-gray-400">Por que o FitPlan Pro é superior aos métodos tradicionais?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Hipertrofia Otimizada",
                                    desc: "Cálculos precisos de volume e intensidade para máximo ganho muscular.",
                                    icon: <Target className="w-6 h-6" />
                                },
                                {
                                    title: "Economia Inteligente",
                                    desc: "Tenha a expertise de um Personal Trainer de elite por uma fração do custo.",
                                    icon: <Zap className="w-6 h-6" />
                                },
                                {
                                    title: "Prevenção de Lesões",
                                    desc: "IA que respeita suas limitações e sugere progressões seguras.",
                                    icon: <Dumbbell className="w-6 h-6" />
                                },
                                {
                                    title: "Bio-Feedback",
                                    desc: "Ajustes constantes baseados na sua evolução e resposta ao treino.",
                                    icon: <Sparkles className="w-6 h-6" />
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-green-500/20 transition-all hover:bg-white/[0.05] group">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/10 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Action Call to Action */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-green-500 to-emerald-700 p-8 md:p-16 text-center">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
                                Pronto para a sua melhor versão?
                            </h2>
                            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative z-10">
                                Libere seu acesso agora e comece a treinar com a ciência da inteligência artificial.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-6 relative z-10">
                                {step !== "payment" ? (
                                    <Button
                                        size="lg"
                                        onClick={() => {
                                            setStep("register");
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="h-16 px-10 bg-white text-black hover:bg-gray-100 text-lg font-bold rounded-2xl shadow-2xl transition-all hover:scale-105"
                                    >
                                        Quero Minha Vaga Agora
                                    </Button>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <MercadoPagoButton />
                                        <div className="flex items-center gap-2 text-white/90 font-medium">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Acesso imediato após aprovação
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

function RegistrationForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("https://workspace.n8n.automatech.tech/webhook/dadosbanco", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    source: "landing_page",
                    timestamp: new Date().toISOString()
                })
            })

            if (response.ok) {
                onSuccess()
            } else {
                alert("Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.")
            }
        } catch (error) {
            console.error("Error saving lead:", error)
            alert("Erro de conexão. Verifique sua internet.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-white/70 text-xs uppercase tracking-wider font-bold">Nome Completo</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    <Input
                        id="name"
                        required
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-green-500/50"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70 text-xs uppercase tracking-wider font-bold">E-mail</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    <Input
                        id="email"
                        type="email"
                        required
                        placeholder="seu@e-mail.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-green-500/50"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/70 text-xs uppercase tracking-wider font-bold">WhatsApp / Telefone</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    <Input
                        id="phone"
                        required
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-green-500/50"
                    />
                </div>
            </div>
            <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-[0.98]"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Prosseguir para Pagamento"}
            </Button>
            <p className="text-[10px] text-center text-white/40 italic">
                Seus dados estão seguros e serão usados apenas para criar seu acesso.
            </p>
        </form>
    )
}

function MercadoPagoButton() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current && containerRef.current.innerHTML === "") {
            const script = document.createElement("script")
            script.src = "https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js"
            script.setAttribute("data-preference-id", "300429693-2b15a780-5d7f-4875-8d45-5a42d0c0b647")
            script.setAttribute("data-source", "button")
            containerRef.current.appendChild(script)
        }
    }, [])

    return <div ref={containerRef} className="mp-button-wrapper" />
}
