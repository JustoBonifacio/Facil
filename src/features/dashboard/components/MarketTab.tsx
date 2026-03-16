
import React from 'react';
import { LineChart, Zap } from 'lucide-react';

export const MarketTab: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-10">
            <section className="bg-white p-10 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
                    <LineChart className="w-10 h-10 text-facil-blue animate-icon-pulse" /> Tendências de Mercado
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="p-8 bg-blue-50/50 rounded-xl border border-blue-100 transition-all hover:shadow-lg group">
                        <div className="flex items-center gap-2 mb-2">
                            <LineChart className="w-4 h-4 text-facil-blue group-hover:animate-icon-pulse" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço Médio Talatona</p>
                        </div>
                        <h4 className="text-3xl font-black text-facil-blue">450.000 Kz <span className="text-sm font-bold text-emerald-500">↑ 4%</span></h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">Baseado em 142 anúncios</p>
                    </div>
                    <div className="p-8 bg-indigo-50/50 rounded-xl border border-indigo-100 transition-all hover:shadow-lg group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Procura vs Oferta</p>
                        <h4 className="text-3xl font-black text-indigo-900 uppercase">Alta</h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">Média de 12 contactos/anúncio</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:shadow-lg">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tempo Médio Venda</p>
                        <h4 className="text-3xl font-black text-slate-900">42 Dias</h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">Estável vs mês anterior</p>
                    </div>
                </div>

                <div className="bg-slate-900 p-10 rounded-xl text-white relative overflow-hidden group/eval">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-facil-blue/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover/eval:scale-125 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                            Avaliação Automática de Mercado <Zap className="w-6 h-6 text-facil-blue animate-icon-bounce" />
                        </h3>
                        <p className="text-slate-400 mb-8 max-w-xl font-medium">Estime o valor do seu imóvel com a nossa IA baseada em dados reais de Angola.</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <select className="bg-white/10 p-4 rounded-lg border border-white/20 outline-none focus:bg-white/20 transition-all font-bold text-sm">
                                <option className="bg-slate-900">Talatona</option>
                                <option className="bg-slate-900">Kilamba</option>
                                <option className="bg-slate-900">Islandia</option>
                            </select>
                            <select className="bg-white/10 p-4 rounded-lg border border-white/20 outline-none focus:bg-white/20 transition-all font-bold text-sm">
                                <option className="bg-slate-900">Apartamento</option>
                                <option className="bg-slate-900">Vivenda</option>
                            </select>
                            <input type="number" placeholder="Área m²" className="bg-white/10 p-4 rounded-lg border border-white/20 outline-none focus:bg-white/20 placeholder:text-white/30 font-bold text-sm" />
                            <button className="bg-facil-blue px-8 py-4 rounded-lg font-black hover:bg-facil-blue/90 transition shadow-xl text-[10px] uppercase tracking-widest active:scale-95">Estimar Preço</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
