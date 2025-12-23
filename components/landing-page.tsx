"use client"

import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Dumbbell, Zap, Target, Brain, ArrowRight, Play, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
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
                        <Link href="/auth/login">
                            <Button className="bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-full px-6">
                                Começar agora
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
                        Seu Personal Trainer <br />
                        <span className="bg-gradient-to-r from-green-400 tracking-tighter to-emerald-500 bg-clip-text text-transparent italic">
                            100% Inteligente
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
                        Treinos personalizados criados por <span className="text-white font-medium">Inteligência Artificial</span> em segundos.
                        Responda algumas perguntas e nossa IA irá montar o plano perfeito para seus objetivos.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth/login">
                            <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-transform text-lg font-bold rounded-2xl group">
                                <Dumbbell className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                Criar Meu Treino com IA
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 bg-transparent rounded-2xl text-lg font-bold">
                            <Play className="w-4 h-4 mr-2 fill-white" />
                            Ver Demonstração
                        </Button>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto py-8 border-y border-white/5">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white">Treino em 30 segundos</p>
                                <p className="text-xs text-gray-500">Agilidade total na montagem</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-red-500" />
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
                                <p className="text-sm font-bold text-white">Baseado em Ciência</p>
                                <p className="text-xs text-gray-500">Periodização inteligente</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="beneficios" className="py-24 bg-gradient-to-b from-transparent to-white/[0.02]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher um <span className="text-green-500">Personal IA</span>?</h2>
                            <p className="text-gray-400">A tecnologia mais avançada aplicada ao seu desenvolvimento físico.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Análise Biométrica",
                                    desc: "IA analisa seu peso, altura e biotipo para definir o volume ideal.",
                                    icon: <Target className="w-6 h-6" />
                                },
                                {
                                    title: "Ajuste de Carga",
                                    desc: "Sugestões de carga baseadas no seu nível de experiência.",
                                    icon: <Zap className="w-6 h-6" />
                                },
                                {
                                    title: "Foco Muscular",
                                    desc: "Priorização automática de grupos musculares específicos.",
                                    icon: <Dumbbell className="w-6 h-6" />
                                },
                                {
                                    title: "Sempre Disponível",
                                    desc: "Seu treino atualizado a qualquer hora em qualquer lugar.",
                                    icon: <Sparkles className="w-6 h-6" />
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-all hover:bg-white/[0.05] group">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/10 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social Proof / Call to Action */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-green-500 to-emerald-700 p-8 md:p-16 text-center">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
                                Pronto para transformar seu corpo?
                            </h2>
                            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative z-10">
                                Junte-se a milhares de usuários que já estão treinando com inteligência artificial.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                                <Link href="/auth/login">
                                    <Button size="lg" className="h-16 px-10 bg-white text-black hover:bg-gray-100 text-lg font-bold rounded-2xl shadow-2xl">
                                        Começar Agora Grátis
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-2 text-white/90 font-medium">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Sem cartão de crédito
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
