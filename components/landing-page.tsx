"use client"

import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Apple, Utensils, Zap, Target, Brain, ArrowRight, Play, CheckCircle2, Lock, CreditCard, Info } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Phone, Mail, User, MessageSquare, Smartphone } from "lucide-react"
import { Browser } from "@capacitor/browser"

export function LandingPage() {
    const [step, setStep] = useState<"idle" | "register" | "payment">("idle")
    const [registeredEmail, setRegisteredEmail] = useState("")
    const [showIosGuide, setShowIosGuide] = useState(false)

    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            {/* Mesh Gradient Overlay */}
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl transition-all duration-300">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl shadow-green-500/20 group-hover:scale-110 transition-transform">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">NutriPlan Pro</span>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] text-green-500 font-bold leading-none tracking-widest uppercase mb-0.5">AI Nutritionist</p>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold uppercase">Enterprise</span>
                            </div>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-10 text-sm font-semibold text-gray-400">
                        <a href="#como-funciona" className="hover:text-emerald-400 transition-colors relative group">
                            Como funciona
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
                        </a>
                        <a href="#beneficios" className="hover:text-emerald-400 transition-colors relative group">
                            Benefícios
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
                        </a>
                        <a href="/app/fitplan-pro.apk" download className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Download App
                        </a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/auth/login/" className="hidden sm:block">
                            <Button variant="ghost" className="text-sm font-bold hover:bg-white/5 text-gray-300 px-6">
                                Entrar
                            </Button>
                        </Link>
                        <Button
                            onClick={() => {
                                setStep("register")
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="bg-white text-black hover:bg-gray-100 font-bold px-6 rounded-xl hidden md:flex"
                        >
                            Começar
                        </Button>
                    </div>
                </div>
            </header>

            <main className="relative pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-4 text-center pb-32">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] md:text-xs font-bold text-emerald-400 mb-10 animate-fade-in tracking-widest uppercase">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        A nova era da alimentação de alta performance
                        <Sparkles className="w-3 h-3 animate-pulse" />
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
                        Sua Dieta Feita <br />
                        <span className="inline-block relative">
                            <span className="relative z-10 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent italic px-2">
                                pela Inteligência Artificial
                            </span>
                            <div className="absolute -bottom-2 left-0 w-full h-8 bg-emerald-500/10 blur-2xl -rotate-1" />
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-2xl text-gray-400 mb-12 leading-relaxed font-medium">
                        Pare de adivinhar o que comer. O <span className="text-white">NutriPlan Pro</span> molda sua jornada com precisão matemática e nutricional, criando planos 100% personalizados em segundos.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-8">
                        {step === "idle" && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl px-4">
                                <Button
                                    size="lg"
                                    onClick={() => setStep("register")}
                                    className="w-full sm:w-auto h-16 px-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all text-xl font-black rounded-3xl group shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95"
                                >
                                    Começar Agora
                                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                                </Button>
                                <a href="#como-funciona" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="w-full h-16 px-12 border-white/10 hover:bg-white/5 bg-transparent rounded-3xl text-xl font-bold backdrop-blur-xl">
                                        Vídeo Demo
                                        <Play className="w-5 h-5 ml-3 text-emerald-500 fill-emerald-500" />
                                    </Button>
                                </a>
                            </div>
                        )}

                        {step === "idle" && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link href="/app/fitplan-pro.apk" download className="hidden sm:inline-block">
                                        <Button variant="link" className="text-green-500 hover:text-green-400 font-bold gap-2">
                                            <Zap className="w-4 h-4" />
                                            Baixar para Android (APK)
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="link"
                                        onClick={() => setShowIosGuide(!showIosGuide)}
                                        className="text-gray-400 hover:text-white font-medium gap-2"
                                    >
                                        <Apple className="w-4 h-4" />
                                        Instalar no iPhone (iOS)
                                    </Button>
                                </div>

                                {showIosGuide && (
                                    <div className="w-full max-w-sm p-6 bg-white/5 border border-white/10 rounded-3xl animate-in fade-in zoom-in duration-300 text-left">
                                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                            <Info className="w-4 h-4 text-green-500" />
                                            Como instalar no iPhone:
                                        </h4>
                                        <ol className="space-y-3 text-xs text-gray-400">
                                            <li className="flex gap-3">
                                                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 font-bold">1</span>
                                                <span>Acesse este site pelo navegador <strong>Safari</strong>.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 font-bold">2</span>
                                                <span>Toque no botão de <strong>Compartilhar</strong> (quadrado com seta para cima).</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 font-bold">3</span>
                                                <span>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 font-bold">4</span>
                                                <span>Toque em <strong>Adicionar</strong> no canto superior direito.</span>
                                            </li>
                                        </ol>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowIosGuide(false)}
                                            className="w-full mt-4 text-[10px] text-gray-500 hover:text-white"
                                        >
                                            Fechar Guia
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === "register" && (
                            <div className="w-full max-w-md mx-auto p-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl backdrop-blur-xl border border-white/10 animate-in fade-in zoom-in duration-300">
                                <RegistrationForm onSuccess={(email) => {
                                    setRegisteredEmail(email)
                                    setStep("payment")
                                }} />
                            </div>
                        )}

                        {step === "payment" && (
                            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="p-10 bg-gray-900/40 rounded-[40px] border border-green-500/20 text-center max-w-md backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />

                                    <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-500/20 group-hover:rotate-12 transition-transform duration-500">
                                        <CheckCircle2 className="w-10 h-10 text-green-400 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Pagamento em Andamento</h3>
                                    <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                                        Abrimos a janela segura do Mercado Pago. Guarde seus dados abaixo para acessar assim que concluir:
                                    </p>

                                    <div className="grid gap-3 mb-8">
                                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                                            <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Seu Usuário (E-mail)</p>
                                                <p className="text-sm text-white font-medium truncate">{registeredEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                                            <Lock className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sua Senha</p>
                                                <p className="text-sm text-white font-medium italic">A senha que você acabou de criar</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10 mb-8">
                                        <p className="text-xs text-green-400/90 leading-relaxed font-medium">
                                            Após concluir o pagamento, seu acesso será liberado instantaneamente e você também receberá os dados por e-mail.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <MercadoPagoButton />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href="/auth/login/" className="w-full">
                                                <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 text-gray-400 text-sm font-medium rounded-xl">
                                                    Área do Aluno
                                                </Button>
                                            </Link>
                                            <a href="https://wa.me/555131994389" target="_blank" rel="noopener noreferrer" className="w-full">
                                                <Button variant="outline" className="w-full h-12 border-green-500/20 hover:bg-green-500/5 text-green-500 text-sm font-medium rounded-xl">
                                                    <MessageSquare className="w-4 h-4 mr-2" />
                                                    Suporte
                                                </Button>
                                            </a>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-gray-600 mt-6 italic">
                                        Se a janela de pagamento não abriu, clique em "Mercado Pago" acima.
                                    </p>
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
                                <p className="text-sm font-bold text-white">Dieta Pronta</p>
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
                <section id="como-funciona" className="py-32 relative overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Sua jornada em <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">3 passos</span></h2>
                            <p className="text-xl text-gray-400 font-medium">O caminho mais curto entre você e seu corpo ideal.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                            {[
                                { step: "01", title: "Perfil Nutricional", desc: "Nossa IA analisa sua rotina, objetivos, restrições e preferências através de perguntas estratégicas.", icon: <Brain className="w-6 h-6 text-white" /> },
                                { step: "02", title: "Análise por IA", desc: "Algoritmos de ponta criam uma estratégia alimentar exclusiva, equilibrando macros e micronutrientes.", icon: <Bot className="w-6 h-6 text-white" /> },
                                { step: "03", title: "Plano Alimentar", desc: "Receba seu plano em PDF pronto para seguir, com opções de substituições e dicas práticas.", icon: <Sparkles className="w-6 h-6 text-white" /> }
                            ].map((s, i) => (
                                <div key={i} className="relative flex flex-col items-center group">
                                    <div className="w-24 h-24 rounded-[32px] bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 relative z-10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-500">
                                        <div className="absolute -top-4 -right-4 text-xs font-black px-2 py-1 bg-emerald-500 text-black rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                                            {s.step}
                                        </div>
                                        {s.icon}
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-white text-center tracking-tight">{s.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-center font-medium px-4">{s.desc}</p>

                                    {i < 2 && (
                                        <div className="hidden md:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
                                    )}
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
                            <p className="text-gray-400">Por que o NutriPlan Pro é superior aos métodos tradicionais?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Cálculo de Macros Pro",
                                    desc: "Fórmulas avançadas que calculam exatamente o que seu corpo precisa para cada objetivo.",
                                    icon: <Target className="w-8 h-8 text-white" />,
                                    color: "from-green-500 to-emerald-600"
                                },
                                {
                                    title: "Economia Inteligente",
                                    desc: "Tenha a expertise de um Nutricionista top por menos do que você gasta em um lanche.",
                                    icon: <Zap className="w-8 h-8 text-white" />,
                                    color: "from-blue-500 to-cyan-600"
                                },
                                {
                                    title: "Dieta Sem Tortura",
                                    desc: "Nossa IA aprende seus gostos e cria prazer no processo de emagrecimento ou ganho.",
                                    icon: <Utensils className="w-8 h-8 text-white" />,
                                    color: "from-orange-500 to-red-600"
                                },
                                {
                                    title: "Suporte 24/7 com IA",
                                    desc: "Dúvidas sobre o que comer? Nossa IA está sempre online para te orientar.",
                                    icon: <Sparkles className="w-8 h-8 text-white" />,
                                    color: "from-purple-500 to-indigo-600"
                                }
                            ].map((feature, i) => (
                                <div key={i} className="group relative p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.04] overflow-hidden">
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-white tracking-tight">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Action Call to Action */}
                <section className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="relative rounded-[60px] overflow-hidden bg-gray-900 border border-white/5 p-12 md:p-24 text-center group">
                            {/* Animated Background Blur */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full group-hover:bg-emerald-500/10 transition-colors duration-1000" />

                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 relative z-10 tracking-tighter">
                                Pronto para a sua <br />
                                <span className="text-emerald-500 italic">melhor versão?</span>
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
                                Junte-se a milhares de pessoas que já transformaram seus corpos com a precisão da Inteligência Artificial.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-6 relative z-10">
                                {step !== "payment" ? (
                                    <div className="flex flex-col items-center gap-6">
                                        <Button
                                            size="lg"
                                            onClick={() => {
                                                setStep("register");
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="h-20 px-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-2xl font-black rounded-3xl shadow-[0_30px_60px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Quero Começar Agora
                                        </Button>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center overflow-hidden">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                ))}
                                            </div>
                                            <span>+5.000 alunos transformados</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-6 p-8 bg-green-500/5 rounded-[40px] border border-green-500/20 backdrop-blur-3xl">
                                        <MercadoPagoButton />
                                        <div className="flex items-center gap-3 text-green-400 font-black text-sm uppercase tracking-widest">
                                            <Shield className="w-5 h-5" />
                                            Acesso Vitalício Liberado
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/555131994389"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 group animate-in slide-in-from-right-10 duration-500"
            >
                <div className="hidden group-hover:flex items-center px-4 py-2 bg-white text-black rounded-full shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300 font-bold text-sm">
                    Suporte Técnico
                </div>
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 hover:scale-110 active:scale-95 transition-all text-white">
                    <MessageSquare size={28} />
                </div>
            </a>
        </div>
    )
}

function RegistrationForm({ onSuccess }: { onSuccess: (email: string) => void }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", cpf: "", password: "" })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("https://workspace.n8n.automatech.tech/webhook/dadosbanco", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    cpf: formData.cpf.replace(/\D/g, ""), // Envia apenas dígitos
                    source: "landing_page",
                    timestamp: new Date().toISOString()
                })
            })

            if (response.ok) {
                const textResponse = await response.text()

                const openCheckout = async (url: string) => {
                    // No APK, window.open fica "preso". Usamos o Browser nativo que tem botão de fechar.
                    try {
                        await Browser.open({ url })
                    } catch (e) {
                        // Fallback para web tradicional
                        const width = 600;
                        const height = 800;
                        const left = window.screenX + (window.outerWidth - width) / 2;
                        const top = window.screenY + (window.outerHeight - height) / 2;
                        window.open(
                            url,
                            'MercadoPagoCheckout',
                            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
                        );
                    }
                }

                try {
                    // Tenta tratar como JSON primeiro
                    const data = JSON.parse(textResponse)
                    if (data.checkoutUrl) {
                        openCheckout(data.checkoutUrl)
                        onSuccess(formData.email)
                        return
                    }
                } catch (e) {
                    // Se não for JSON, procura um link direto no texto (comum no n8n)
                    const urlRegex = /(https?:\/\/[^\s]+)/g
                    const foundUrls = textResponse.match(urlRegex)
                    if (foundUrls && foundUrls.length > 0) {
                        // Pega o último link (geralmente o link do mercado pago no final da mensagem)
                        const checkoutUrl = foundUrls[foundUrls.length - 1]
                        openCheckout(checkoutUrl)
                        onSuccess(formData.email)
                        return
                    }
                }
                onSuccess(formData.email)
            } else {
                const errorText = await response.text().catch(() => "Unknown error")
                console.error("Webhook error response:", response.status, errorText)
                alert(`Erro no servidor (${response.status}). Por favor, tente novamente.`)
            }
        } catch (error) {
            console.error("Network error saving lead:", error)
            alert("Erro de conexão. Verifique se o seu n8n permite conexões (CORS) ou se o link do webhook está correto.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6 relative overflow-hidden group">
            {/* Form Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[80px] -mr-16 -mt-16 pointer-events-none" />

            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Crie sua Conta</h3>
                <p className="text-gray-400 text-sm font-medium">Inicie sua transformação agora</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2 group">
                    <Label htmlFor="name" className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black ml-1 group-focus-within:text-green-500 transition-colors">Nome Completo</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                        <Input
                            id="name"
                            required
                            placeholder="Ex: João Silva"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                        <Label htmlFor="email" className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black ml-1 group-focus-within:text-green-500 transition-colors">E-mail de Acesso</Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 group">
                        <Label htmlFor="phone" className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black ml-1 group-focus-within:text-green-500 transition-colors">WhatsApp</Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                            <Input
                                id="phone"
                                required
                                placeholder="(00) 00000-0000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 group">
                    <Label htmlFor="cpf" className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black ml-1 group-focus-within:text-green-500 transition-colors">CPF (Para o Pix)</Label>
                    <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                        <Input
                            id="cpf"
                            required
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={e => {
                                let value = e.target.value.replace(/\D/g, "")
                                if (value.length <= 11) {
                                    value = value.replace(/(\d{3})(\d)/, "$1.$2")
                                    value = value.replace(/(\d{3})(\d)/, "$1.$2")
                                    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
                                    setFormData({ ...formData, cpf: value })
                                }
                            }}
                            className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <Label htmlFor="password" className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black ml-1 group-focus-within:text-green-500 transition-colors">Criar Senha Secreta</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                        <Input
                            id="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl focus:border-green-500/50 focus:ring-green-500/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-black rounded-3xl shadow-[0_20px_40px_rgba(34,197,94,0.2)] transition-all active:scale-[0.98] mt-4"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Prosseguir para Checkout"}
            </Button>

            <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest italic group-hover:text-green-500/50 transition-colors">
                🔐 Conexão 100% Criptografada via SSL
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
